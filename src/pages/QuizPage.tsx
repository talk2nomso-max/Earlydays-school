import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, Loader2, Brain, Zap, ShieldCheck, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, QuizQuestion, Term } from '@/lib/supabase';
import { generateQuizQuestions, generateMentalMathQuestions } from '@/lib/questionGenerator';
import { useAntiMalpractice, isJuniorClass, getPerQuestionTime, getTotalQuizTime } from '@/hooks/useAntiMalpractice';

interface QuizPageProps {
  term: Term;
  quizType: 'curriculum' | 'mental_math';
  onNavigate: (page: string) => void;
  onComplete: (result: { score: number; total: number; percentage: number; answers: Record<string, string>; questions: QuizQuestion[] }) => void;
}

export default function QuizPage({ term, quizType, onNavigate, onComplete }: QuizPageProps) {
  const { user, student } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const isJunior = student ? isJuniorClass(student.class_level) : false;
  const totalQuizTime = student ? getTotalQuizTime(student.class_level, quizType) : 3600;
  const perQTime = student ? getPerQuestionTime(student.class_level, quizType) : 60;
  const [timeLeft, setTimeLeft] = useState(totalQuizTime);

  const antiMalpractice = useAntiMalpractice({
    enabled: isJunior,
    perQuestionTime: perQTime,
    lockFullscreen: isJunior,
  });

  useEffect(() => {
    if (!user || !student) return;
    generateQuestions();
  }, [user, student]);

  async function generateQuestions() {
    if (!user || !student) return;

    const { data: previousAttempts } = await supabase
      .from('quiz_attempts')
      .select('question_ids')
      .eq('student_id', user.id)
      .eq('quiz_type', quizType);

    const previousIds: string[] = [];
    (previousAttempts || []).forEach(a => {
      if (a.question_ids) previousIds.push(...a.question_ids);
    });

    let generated: QuizQuestion[];
    if (quizType === 'mental_math') {
      generated = generateMentalMathQuestions(user.id, student.class_level, previousIds);
    } else {
      generated = generateQuizQuestions(user.id, student.class_level, term, previousIds);
    }

    setQuestions(generated);

    const { data } = await supabase
      .from('quiz_attempts')
      .insert({
        student_id: user.id,
        class_level: student.class_level,
        term: term,
        quiz_type: quizType,
        question_ids: generated.map(q => q.id),
        total_questions: 40,
        started_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (data) setAttemptId(data.id);
    setLoading(false);
  }

  const finishQuiz = useCallback(async () => {
    if (!user || questions.length === 0 || !attemptId) return;

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) score++;
    });

    const percentage = Math.round((score / questions.length) * 100);

    await supabase
      .from('quiz_attempts')
      .update({
        score,
        percentage,
        answers,
        completed_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    onComplete({
      score,
      total: questions.length,
      percentage,
      answers,
      questions,
    });
  }, [user, questions, answers, attemptId, onComplete]);

  // Overall timer
  useEffect(() => {
    if (loading || questions.length === 0) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, questions, timeLeft, finishQuiz]);

  // Per-question timer auto-advance for junior classes
  useEffect(() => {
    if (!isJunior || loading || questions.length === 0) return;
    if (antiMalpractice.perQuestionTimeLeft <= 0) {
      // Auto-advance to next question
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        antiMalpractice.resetPerQuestionTimer();
      } else {
        finishQuiz();
      }
    }
  }, [antiMalpractice.perQuestionTimeLeft, isJunior, currentIdx, questions.length, loading, finishQuiz, antiMalpractice]);

  // Reset per-question timer when changing questions
  useEffect(() => {
    if (isJunior) {
      antiMalpractice.resetPerQuestionTimer();
    }
  }, [currentIdx, isJunior]);

  // Locked state - finish quiz
  useEffect(() => {
    if (antiMalpractice.isLocked) {
      finishQuiz();
    }
  }, [antiMalpractice.isLocked, finishQuiz]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / 40) * 100;
  const timeProgress = ((totalQuizTime - timeLeft) / totalQuizTime) * 100;

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-primary-100 rounded-2xl mb-4">
            {quizType === 'mental_math' ? <Zap className="w-10 h-10 text-error-600" /> : <Brain className="w-10 h-10 text-primary-600" />}
          </div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-2">Generating Your Unique Questions...</h2>
          <p className="text-gray-500 mb-4">AI is creating 40 personalized questions just for you</p>
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Quiz Header */}
      <div className={`fixed top-16 left-0 right-0 z-40 ${timeLeft < 300 ? 'bg-error-600' : 'bg-white border-b border-gray-200'} transition-colors`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className={`text-sm font-medium ${timeLeft < 300 ? 'text-white' : 'text-gray-600'}`}>
            {quizType === 'mental_math' ? 'Mental Math Challenge' : `${term} Quiz`} · {student?.class_level}
          </div>
          <div className={`flex items-center gap-2 ${timeLeft < 300 ? 'text-white' : 'text-gray-900'}`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
        {/* Overall progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full transition-all ${timeLeft < 300 ? 'bg-white' : 'bg-primary-500'}`}
            style={{ width: `${timeProgress}%` }}
          />
        </div>
        {/* Per-question timer for junior classes */}
        {isJunior && (
          <div className="h-0.5 bg-gray-100">
            <div
              className={`h-full transition-all ${
                antiMalpractice.perQuestionTimeLeft < 10 ? 'bg-error-500' : 'bg-accent-500'
              }`}
              style={{ width: `${(antiMalpractice.perQuestionTimeLeft / perQTime) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Anti-malpractice warning banner for junior classes */}
      {isJunior && (
        <div className="fixed top-[88px] left-0 right-0 z-30 bg-primary-50 border-b border-primary-200 py-1.5 text-center">
          <span className="text-xs font-semibold text-primary-700 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            This quiz is monitored. Stay on this page and do not ask for help.
          </span>
        </div>
      )}

      {/* Malpractice warning toast */}
      {antiMalpractice.warning && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-50 bg-error-500 text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-slide-down max-w-md">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{antiMalpractice.warning}</span>
        </div>
      )}

      {/* Malpractice lock screen */}
      {antiMalpractice.isLocked && (
        <div className="fixed inset-0 z-50 bg-error-900/95 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
            <div className="inline-flex p-4 bg-error-100 rounded-2xl mb-4">
              <AlertTriangle className="w-10 h-10 text-error-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Quiz Ended</h2>
            <p className="text-gray-600 mb-4">
              The quiz has been ended because too many violations were detected. Your answers so far have been saved.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              Violations: {antiMalpractice.violations}
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${isJunior ? 'pt-32' : 'pt-24'} pb-24`}>
        {/* Question Counter + Per-question timer for junior */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-medium text-gray-500">Question</span>
            <span className="text-2xl font-bold text-gray-900 ml-2">{currentIdx + 1}</span>
            <span className="text-gray-400">/ {questions.length}</span>
          </div>
          <div className="flex items-center gap-4">
            {isJunior && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                antiMalpractice.perQuestionTimeLeft < 10 ? 'bg-error-100 text-error-700' : 'bg-accent-100 text-accent-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold text-sm">{antiMalpractice.perQuestionTimeLeft}s</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              {answeredCount} answered · {40 - answeredCount} remaining
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 animate-fade-in" key={currentQ.id}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              {currentQ.topic}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              currentQ.difficulty === 'easy' ? 'bg-success-50 text-success-700' :
              currentQ.difficulty === 'medium' ? 'bg-accent-50 text-accent-700' :
              'bg-error-50 text-error-700'
            }`}>
              {currentQ.difficulty}
            </span>
            {isJunior && (
              <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full flex items-center gap-1 ml-auto">
                <Eye className="w-3 h-3" />
                Monitored
              </span>
            )}
          </div>

          <h2 className="font-display text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {currentQ.question_text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [currentQ.id]: option })}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  answers[currentQ.id] === option
                    ? 'border-primary-500 bg-primary-50 text-primary-900'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${
                  answers[currentQ.id] === option
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-40 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl font-bold hover:from-success-600 hover:to-success-700 transition-all shadow-md flex items-center gap-2"
            >
              <Flag className="w-5 h-5" />
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1));
                if (isJunior) antiMalpractice.resetPerQuestionTimer();
              }}
              className="px-5 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Question Grid */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(i)}
                className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                  i === currentIdx
                    ? 'bg-primary-600 text-white'
                    : answers[q.id]
                    ? 'bg-success-100 text-success-700 border border-success-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Violation counter for junior classes */}
        {isJunior && antiMalpractice.violations > 0 && (
          <div className="mt-4 bg-error-50 border border-error-200 rounded-xl p-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-error-600" />
            <span className="text-sm text-error-700">
              Warning {antiMalpractice.violations} of 3 — the quiz will end automatically after 3 violations.
            </span>
          </div>
        )}
      </div>

      {/* Submit Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-8 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-accent-100 rounded-2xl mb-4">
                <AlertCircle className="w-10 h-10 text-accent-600" />
              </div>
              <h2 className="font-display text-xl font-bold text-gray-900">Submit Quiz?</h2>
              <p className="text-gray-600 mt-2">
                You've answered {answeredCount} out of {questions.length} questions.
                {answeredCount < 40 && ` ${40 - answeredCount} questions are unanswered.`}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  finishQuiz();
                }}
                className="w-full px-6 py-3 bg-success-500 hover:bg-success-600 text-white rounded-xl font-bold transition-all"
              >
                Yes, Submit Now
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
              >
                Keep Going
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
