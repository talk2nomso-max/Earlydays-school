import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { isAdminEmail } from '@/lib/supabase';
import { isJuniorClass } from '@/hooks/useAntiMalpractice';
import type { Term, QuizQuestion } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import AboutPage from '@/pages/AboutPage';
import CurriculumPage from '@/pages/CurriculumPage';
import PrizesPage from '@/pages/PrizesPage';
import ContactPage from '@/pages/ContactPage';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import StudentDashboard from '@/pages/StudentDashboard';
import QuizPage from '@/pages/QuizPage';
import ResultsPage from '@/pages/ResultsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import PreTestTutorial from '@/pages/PreTestTutorial';

interface QuizConfig {
  term: Term;
  quizType: 'curriculum' | 'mental_math';
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: Record<string, string>;
  questions: QuizQuestion[];
}

function AppContent() {
  const { user, student, isAdmin, loading } = useAuth();
  const [page, setPage] = useState('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [pendingQuizConfig, setPendingQuizConfig] = useState<QuizConfig | null>(null);

  // Handle auth-based redirects
  useEffect(() => {
    if (loading) return;
    if (user && isAdmin && (page === 'login' || page === 'admin-login')) {
      setPage('admin-dashboard');
    }
    if (user && !isAdmin && student && (page === 'login' || page === 'register')) {
      setPage('dashboard');
    }
    if (!user && (page === 'dashboard' || page === 'quiz' || page === 'results')) {
      setPage('login');
    }
  }, [user, isAdmin, student, loading, page]);

  const navigate = (target: string) => {
    setPage(target);
    window.scrollTo(0, 0);
  };

  const startQuiz = (term: Term, quizType: 'curriculum' | 'mental_math') => {
    const config: QuizConfig = { term, quizType };
    // For junior classes, show the pre-test tutorial first
    if (student && isJuniorClass(student.class_level)) {
      setPendingQuizConfig(config);
      setShowTutorial(true);
    } else {
      setQuizConfig(config);
      setPage('quiz');
      window.scrollTo(0, 0);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    if (pendingQuizConfig) {
      setQuizConfig(pendingQuizConfig);
      setPendingQuizConfig(null);
      setPage('quiz');
      window.scrollTo(0, 0);
    }
  };

  const handleTutorialCancel = () => {
    setShowTutorial(false);
    setPendingQuizConfig(null);
    setPage('dashboard');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setQuizConfig(null);
    setPage('results');
    window.scrollTo(0, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading RexMaths Brain...</p>
        </div>
      </div>
    );
  }

  // Pre-test tutorial overlay
  if (showTutorial && student) {
    return (
      <PreTestTutorial
        studentName={student.full_name}
        classLevel={student.class_level}
        onStart={handleTutorialComplete}
        onCancel={handleTutorialCancel}
      />
    );
  }

  // Quiz page (requires auth)
  if (page === 'quiz' && quizConfig && user && student) {
    return (
      <QuizPage
        term={quizConfig.term}
        quizType={quizConfig.quizType}
        onNavigate={navigate}
        onComplete={handleQuizComplete}
      />
    );
  }

  // Results page
  if (page === 'results') {
    return (
      <ResultsPage result={quizResult} onNavigate={navigate} />
    );
  }

  // Admin dashboard (requires admin)
  if (page === 'admin-dashboard' && user && isAdmin) {
    return <AdminDashboard onNavigate={navigate} />;
  }

  // Admin login page
  if (page === 'admin-login') {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  // Student dashboard (requires auth, non-admin)
  if (page === 'dashboard' && user && !isAdmin && student) {
    return <StudentDashboard onNavigate={navigate} onStartQuiz={startQuiz} />;
  }

  // Login page
  if (page === 'login') {
    return <LoginPage onNavigate={navigate} />;
  }

  // Register page
  if (page === 'register') {
    return <RegisterPage onNavigate={navigate} />;
  }

  // Public pages with navbar and footer
  const publicPages = ['home', 'about', 'curriculum', 'prizes', 'contact'];
  const showChrome = publicPages.includes(page) || page === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col">
      {showChrome && <Navbar onNavigate={navigate} currentPage={page} />}
      <div className="flex-1">
        {page === 'home' && <LandingPage onNavigate={navigate} />}
        {page === 'about' && <AboutPage />}
        {page === 'curriculum' && <CurriculumPage />}
        {page === 'prizes' && <PrizesPage onNavigate={navigate} />}
        {page === 'contact' && <ContactPage />}
      </div>
      {showChrome && <Footer onNavigate={navigate} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
