import { useEffect } from 'react';
import { Trophy, Home, RotateCcw, CheckCircle, XCircle, Award } from 'lucide-react';
import { QuizQuestion } from '@/lib/supabase';

interface ResultsPageProps {
  result: {
    score: number;
    total: number;
    percentage: number;
    answers: Record<string, string>;
    questions: QuizQuestion[];
  } | null;
  onNavigate: (page: string) => void;
}

export default function ResultsPage({ result, onNavigate }: ResultsPageProps) {
  useEffect(() => {
    if (!result) {
      onNavigate('dashboard');
    }
  }, [result, onNavigate]);

  if (!result) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { score, total, percentage, answers, questions } = result;
  const isPass = percentage >= 70;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Result Card */}
        <div className={`bg-white rounded-3xl shadow-xl p-8 mb-6 text-center animate-slide-up ${isPass ? 'border-2 border-success-200' : ''}`}>
          <div className={`inline-flex p-6 rounded-2xl mb-6 ${isPass ? 'bg-gradient-to-br from-success-400 to-success-600' : 'bg-gradient-to-br from-primary-400 to-primary-600'}`}>
            {isPass ? (
              <Trophy className="w-16 h-16 text-white" />
            ) : (
              <Award className="w-16 h-16 text-white" />
            )}
          </div>

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            {isPass ? 'Excellent Work!' : 'Quiz Complete!'}
          </h1>

          {isPass ? (
            <p className="text-lg text-success-600 font-semibold mb-6">
              You've scored 70% or above — you qualify for the ₦30,000 prize!
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              Keep practicing! Score 70% or above to win the ₦30,000 prize.
            </p>
          )}

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold font-display text-gray-900">{score}</div>
              <div className="text-xs text-gray-500 mt-1">Correct</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-3xl font-bold font-display text-gray-900">{total - score}</div>
              <div className="text-xs text-gray-500 mt-1">Wrong</div>
            </div>
            <div className={`rounded-xl p-4 ${isPass ? 'bg-success-50' : 'bg-gray-50'}`}>
              <div className={`text-3xl font-bold font-display ${isPass ? 'text-success-600' : 'text-gray-900'}`}>{percentage}%</div>
              <div className="text-xs text-gray-500 mt-1">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isPass ? 'bg-gradient-to-r from-success-400 to-success-600' : 'bg-gradient-to-r from-primary-400 to-primary-600'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span className="font-semibold text-accent-600">70% (prize threshold)</span>
            <span>100%</span>
          </div>
        </div>

        {/* Prize Notification */}
        {isPass && (
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 flex-shrink-0" />
              <div>
                <h3 className="font-display text-xl font-bold">Congratulations! 🎉</h3>
                <p className="text-accent-100 text-sm mt-1">
                  You've qualified for the ₦30,000 prize! Your cumulative score is 70% or above.
                  Prize details will be sent to your parent's email.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Answer Review */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-display text-lg font-bold text-gray-900">Answer Review</h3>
            <p className="text-sm text-gray-500">See which questions you got right and wrong</p>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto scrollbar-thin">
            {questions.map((q, i) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              return (
                <div key={q.id} className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 mt-0.5 ${isCorrect ? 'text-success-600' : 'text-error-600'}`}>
                      {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {i + 1}. {q.question_text}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="text-gray-500">
                          Your answer: <span className={isCorrect ? 'text-success-700 font-medium' : 'text-error-700 font-medium'}>
                            {userAnswer || 'Not answered'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-gray-500">
                            Correct answer: <span className="text-success-700 font-medium">{q.correct_answer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
