import { useEffect, useState } from 'react';
import { Brain, Trophy, Zap, BookOpen, LogOut, PlayCircle, CheckCircle, Clock, TrendingUp, Award, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, QuizAttempt, Term } from '@/lib/supabase';

interface StudentDashboardProps {
  onNavigate: (page: string) => void;
  onStartQuiz: (term: Term, quizType: 'curriculum' | 'mental_math') => void;
}

export default function StudentDashboard({ onNavigate, onStartQuiz }: StudentDashboardProps) {
  const { user, student, signOut } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAttempts();
    }
  }, [user]);

  async function fetchAttempts() {
    if (!user) return;
    const { data } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });
    setAttempts((data as QuizAttempt[]) || []);
    setLoading(false);
  }

  const terms: Term[] = ['First Term', 'Second Term', 'Third Term'];

  const getTermAttempts = (term: Term) => attempts.filter(a => a.term === term && a.quiz_type === 'curriculum');
  const getMentalMathAttempts = () => attempts.filter(a => a.quiz_type === 'mental_math');
  const getBestScore = (term: Term) => {
    const termAttempts = getTermAttempts(term);
    if (termAttempts.length === 0) return null;
    return Math.max(...termAttempts.map(a => a.percentage));
  };
  const getCumulativeScore = () => {
    if (attempts.length === 0) return 0;
    const allScores = attempts.map(a => a.percentage);
    return Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
  };

  const cumulative = getCumulativeScore();
  const qualifiesForPrize = cumulative >= 70;

  if (!student) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold">Welcome, {student.full_name}!</h1>
              <p className="text-primary-200 mt-1">{student.class_level} · RexMaths Brain Student</p>
            </div>
            <div className="flex items-center gap-3">
              {!student.registration_paid && (
                <button
                  onClick={() => setShowPayment(true)}
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  Complete Payment
                </button>
              )}
              <button
                onClick={signOut}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Banner */}
        {!student.registration_paid && (
          <div className="bg-accent-50 border-2 border-accent-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-accent-500 p-3 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-accent-900">Registration Payment Required</h3>
                <p className="text-sm text-accent-700">
                  Complete your ₦5,000 registration payment to unlock full quiz access.
                </p>
              </div>
              <button
                onClick={() => setShowPayment(true)}
                className="px-5 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold text-sm transition-all"
              >
                Pay ₦5,000
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <span className="text-xs font-medium text-gray-400">Cumulative</span>
            </div>
            <div className={`text-3xl font-bold font-display ${qualifiesForPrize ? 'text-success-600' : 'text-gray-900'}`}>
              {cumulative}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {qualifiesForPrize ? 'Qualifies for ₦30,000 prize!' : 'Need 70%+ to win prize'}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-6 h-6 text-accent-600" />
              <span className="text-xs font-medium text-gray-400">Quizzes</span>
            </div>
            <div className="text-3xl font-bold font-display text-gray-900">{attempts.filter(a => a.quiz_type === 'curriculum').length}</div>
            <div className="text-xs text-gray-500 mt-1">Curriculum attempts</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-error-600" />
              <span className="text-xs font-medium text-gray-400">Mental Math</span>
            </div>
            <div className="text-3xl font-bold font-display text-gray-900">{getMentalMathAttempts().length}</div>
            <div className="text-xs text-gray-500 mt-1">Challenge attempts</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-success-600" />
              <span className="text-xs font-medium text-gray-400">Status</span>
            </div>
            <div className="text-lg font-bold font-display text-gray-900">
              {qualifiesForPrize ? 'Winner!' : 'Keep Going'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {qualifiesForPrize ? '₦30,000 prize unlocked' : `${70 - cumulative}% to go`}
            </div>
          </div>
        </div>

        {/* Prize Progress */}
        {cumulative > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-accent-600" />
              <h3 className="font-display text-lg font-bold text-gray-900">Prize Progress</h3>
            </div>
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  qualifiesForPrize ? 'bg-gradient-to-r from-success-400 to-success-600' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                }`}
                style={{ width: `${Math.min(cumulative, 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {cumulative}% / 70% needed
              </div>
            </div>
            {qualifiesForPrize && (
              <div className="mt-3 bg-success-50 border border-success-200 rounded-xl p-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-success-600" />
                <span className="text-sm font-semibold text-success-800">
                  Congratulations! You've qualified for the ₦30,000 prize!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Quiz Options */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Curriculum Quizzes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <div>
                  <h3 className="font-display text-lg font-bold">Curriculum Quizzes</h3>
                  <p className="text-primary-200 text-sm">40 questions per term</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {terms.map((term) => {
                const bestScore = getBestScore(term);
                const termAttempts = getTermAttempts(term);
                return (
                  <div key={term} className="border border-gray-200 rounded-xl p-4 hover:border-primary-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{term}</h4>
                        <p className="text-xs text-gray-500">{termAttempts.length} attempt(s)</p>
                      </div>
                      {bestScore !== null && (
                        <div className={`text-lg font-bold ${bestScore >= 70 ? 'text-success-600' : 'text-gray-700'}`}>
                          {bestScore}%
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onStartQuiz(term, 'curriculum')}
                      className="w-full mt-2 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {termAttempts.length > 0 ? 'Retake Quiz' : 'Start Quiz'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mental Math Challenge */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-error-500 to-error-700 text-white px-6 py-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                <div>
                  <h3 className="font-display text-lg font-bold">Mental Math Challenge</h3>
                  <p className="text-error-100 text-sm">40 questions · 2 hours</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-error-50 border border-error-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-error-600" />
                  <span className="text-sm font-semibold text-error-800">Time Limit: 2 Hours</span>
                </div>
                <p className="text-sm text-error-700">
                  40 challenging mental mathematics questions. Test your speed and accuracy!
                </p>
              </div>

              {getMentalMathAttempts().length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Attempts:</h4>
                  <div className="space-y-2">
                    {getMentalMathAttempts().slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {a.score}/{a.total_questions} correct
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${a.percentage >= 70 ? 'text-success-600' : 'text-gray-700'}`}>
                          {a.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => onStartQuiz('First Term', 'mental_math')}
                className="w-full px-4 py-3 bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <Zap className="w-5 h-5" />
                Start Mental Math Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {attempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {attempts.slice(0, 8).map((attempt) => (
                <div key={attempt.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${attempt.quiz_type === 'mental_math' ? 'bg-error-50' : 'bg-primary-50'}`}>
                      {attempt.quiz_type === 'mental_math' ? (
                        <Zap className="w-4 h-4 text-error-600" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {attempt.quiz_type === 'mental_math' ? 'Mental Math Challenge' : attempt.term}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(attempt.created_at).toLocaleDateString()} · {attempt.score}/{attempt.total_questions} correct
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${attempt.percentage >= 70 ? 'text-success-600' : 'text-gray-700'}`}>
                    {attempt.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowPayment(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-accent-100 rounded-2xl mb-4">
                <CreditCard className="w-10 h-10 text-accent-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900">Complete Registration</h2>
              <p className="text-gray-600 mt-2">Pay ₦5,000 to unlock all quizzes</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration Fee</span>
                <span className="font-semibold text-gray-900">₦5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Access</span>
                <span className="font-semibold text-gray-900">3 Terms + Mental Math</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-accent-700 text-lg">₦5,000</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center">
                Payment instructions will be sent to your parent's email. Once payment is confirmed,
                your account will be activated.
              </p>
              <button
                onClick={async () => {
                  setShowPayment(false);
                  onNavigate('dashboard');
                }}
                className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold transition-all"
              >
                I Understand — Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
