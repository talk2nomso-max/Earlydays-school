import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const hasValidConfig = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http');

export const isSupabaseConfigured = hasValidConfig;

// Create a safe client — use placeholder URL if env vars are missing so createClient doesn't throw
export const supabase: SupabaseClient = createClient(
  hasValidConfig ? supabaseUrl : 'https://placeholder.supabase.co',
  hasValidConfig ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export const isAdminEmail = (email: string | undefined | null): boolean => {
  return email === 'talk2nomso@gmail.com';
};

export type ClassLevel = 'Primary 1' | 'Primary 2' | 'Primary 3' | 'Primary 4' | 'Primary 5' | 'Primary 6';
export type Term = 'First Term' | 'Second Term' | 'Third Term';
export type QuizType = 'curriculum' | 'mental_math';

export interface Student {
  id: string;
  full_name: string;
  class_level: ClassLevel;
  parent_email: string;
  parent_phone: string;
  registration_paid: boolean;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  class_level: string;
  term: string;
  question_ids: string[];
  answers: Record<string, string>;
  score: number;
  total_questions: number;
  percentage: number;
  quiz_type: QuizType;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  difficulty: string;
}
