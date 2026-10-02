import { Trophy, Award, CheckCircle, ArrowRight, Star, Medal } from 'lucide-react';

interface PrizesPageProps {
  onNavigate: (page: string) => void;
}

export default function PrizesPage({ onNavigate }: PrizesPageProps) {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-accent-500 to-accent-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">Prizes & Rewards</h1>
          <p className="text-xl text-accent-100">
            At RexMaths Brain, we reward excellence. Score 70% and above in your cumulative term
            assessment and win real cash prizes.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Prize */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-success-50 to-accent-50 rounded-3xl p-8 lg:p-12 text-center border-2 border-success-200 shadow-lg">
              <div className="inline-flex p-4 bg-success-500 rounded-2xl mb-6 shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ₦30,000 Cash Prize
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Every student who scores <strong className="text-success-700">70% and above</strong> in
                their cumulative term assessment wins ₦30,000. The cumulative score combines results
                from all assessments within a term.
              </p>
              <div className="inline-flex items-center gap-2 bg-success-100 text-success-800 px-4 py-2 rounded-full text-sm font-semibold">
                <CheckCircle className="w-4 h-4" />
                Score 70%+ to qualify
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12">How to Win</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', icon: CheckCircle, title: 'Register', desc: 'Pay ₦5,000 registration fee and create your account', color: 'bg-primary-500' },
                { step: '2', icon: Star, title: 'Take Quizzes', desc: 'Complete 40 curriculum questions per term across all three terms', color: 'bg-accent-500' },
                { step: '3', icon: Medal, title: 'Mental Math', desc: 'Take the 40-question mental math challenge within 2 hours', color: 'bg-error-500' },
                { step: '4', icon: Trophy, title: 'Win Prize', desc: 'Score 70%+ in cumulative assessment and claim your ₦30,000', color: 'bg-success-500' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                      <div className={`inline-flex p-3 ${item.color} rounded-2xl mb-4 shadow-md`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-xs font-bold text-gray-400 mb-2">STEP {item.step}</div>
                      <h3 className="font-display font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {i < 3 && (
                      <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-gray-300" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prize Rules */}
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-primary-600" />
              <h2 className="font-display text-2xl font-bold text-gray-900">Prize Rules</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Each student receives 40 unique AI-generated questions per term — no question is ever repeated for any child.',
                'The cumulative score is calculated from all quiz attempts within a term, including the mental math challenge.',
                'Students must score at least 70% in their cumulative assessment to qualify for the ₦30,000 prize.',
                'Quiz questions are unique to each child — our AI engine ensures no two students receive the same questions.',
                'The mental math challenge consists of 40 questions to be answered within a 2-hour time limit.',
                'Registration costs ₦5,000 and grants access to all three terms plus the mental math challenge.',
                'Scores are displayed as percentages after each quiz attempt.',
                'Prizes are awarded based on cumulative term performance, not individual quiz scores.',
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{rule}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('register')}
              className="px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 group"
            >
              Register & Start Winning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
