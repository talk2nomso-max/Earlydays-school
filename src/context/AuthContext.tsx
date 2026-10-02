import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isAdminEmail, Student, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  student: Student | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, classLevel: string, parentEmail: string, parentPhone: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // If Supabase isn't configured, skip auth and show the app immediately
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(isAdminEmail(session?.user?.email));
      if (session?.user && !isAdminEmail(session?.user?.email)) {
        fetchStudentProfile(session.user.id);
      }
      setLoading(false);
    }).catch(() => {
      if (!mounted) return;
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(isAdminEmail(session?.user?.email));
      if (session?.user && !isAdminEmail(session?.user?.email)) {
        fetchStudentProfile(session.user.id);
      } else {
        setStudent(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function fetchStudentProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      setStudent(data as Student | null);
    } catch {
      setStudent(null);
    }
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    classLevel: string,
    parentEmail: string,
    parentPhone: string
  ): Promise<{ error: string | null }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      const { error: profileError } = await supabase
        .from('students')
        .insert({
          id: data.user.id,
          full_name: fullName,
          class_level: classLevel,
          parent_email: parentEmail,
          parent_phone: parentPhone,
          registration_paid: false,
        });
      if (profileError) return { error: profileError.message };
    }

    return { error: null };
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStudent(null);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ session, user, student, isAdmin, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
