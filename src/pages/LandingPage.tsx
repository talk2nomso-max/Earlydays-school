import { Brain, Trophy, Users, Zap, Target, ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { LOGO_URL } from '@/lib/logo';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl font-bold">∑</div>
          <div className="absolute top-40 right-20 text-7xl font-bold">π</div>
          <div className="absolute bottom-20 left-1/3 text-8xl font-bold">√</div>
          <div className="absolute top-1/2 right-1/4 text-6xl font-bold">∞</div>
          <div className="absolute bottom-10 right-10 text-9xl font-bold">÷</div>
          <div className="absolute top-20 left-1/2 text-7xl font-bold">×</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Zap className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-medium">AI-Powered Mathematics Quiz Platform</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Awakening the Culture of <span className="text-accent-400">Mathematics</span> in Nigerian Youth
              </h1>

              <p className="text-lg text-primary-100 mb-8 max-w-xl">
                RexMaths Brain generates unique AI-powered mathematics quiz questions based on the Nigerian primary
                school curriculum. From Primary 1 to Primary 6, every child gets their own set of questions — no repeats, ever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Register Now — ₦5,000
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('curriculum')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-semibold text-lg transition-all border border-white/20 flex items-center justify-center gap-2"
                >
                  View Curriculum
                </button>
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success-400" />
                  <span>40 Questions Per Term</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success-400" />
                  <span>Unique To Each Child</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success-400" />
                  <span>Win ₦30,000</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex justify-center animate-fade-in">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 flex flex-col justify-center items-center">
                  <img src={LOGO_URL} alt="RexMaths Brain" className="w-28 h-28 rounded-2xl object-cover mb-4 shadow-lg" />
                  <div className="text-center">
                    <div className="text-5xl font-bold font-display mb-2">40</div>
                    <div className="text-primary-200">Questions Per Term</div>
                    <div className="mt-4 text-3xl font-bold font-display text-accent-400">₦30,000</div>
                    <div className="text-primary-200 text-sm">Prize Money</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-success-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg animate-bounce-subtle">
                  Score 70%+ to Win!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '6 Classes', label: 'Primary 1 to Primary 6', color: 'text-primary-600' },
              { icon: Brain, value: '40 Questions', label: 'Per Term, Unique Each Child', color: 'text-accent-600' },
              { icon: Trophy, value: '₦30,000', label: 'Prize for 70%+ Scorers', color: 'text-success-600' },
              { icon: Target, value: '3 Terms', label: 'Full Academic Year Coverage', color: 'text-error-600' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-gray-50 mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold font-display text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why RexMaths Brain?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are transforming how Nigerian children engage with mathematics through AI-powered,
              curriculum-aligned quizzes that make learning exciting and rewarding.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Generated Questions',
                description: 'Every child receives a unique set of 40 questions. Our AI engine ensures no two students get the same questions — ever.',
                color: 'from-primary-500 to-primary-700',
              },
              {
                icon: BookOpen,
                title: 'Nigerian Curriculum',
                description: 'Questions are aligned with the most current Nigerian primary school mathematics curriculum, organized by term and week.',
                color: 'from-accent-500 to-accent-700',
              },
              {
                icon: Trophy,
                title: 'Win Real Prizes',
                description: 'Score 70% and above in your cumulative term assessment and win ₦30,000. Excellence has real rewards!',
                color: 'from-success-500 to-success-700',
              },
              {
                icon: Zap,
                title: 'Mental Math Challenge',
                description: 'Test your speed with 40 challenging mental math questions to be completed within 2 hours. Build computational fluency!',
                color: 'from-error-500 to-error-700',
              },
              {
                icon: TrendingUp,
                title: 'Track Progress',
                description: 'See your scores as percentages after every quiz. Track improvement across all three terms of the academic year.',
                color: 'from-primary-600 to-primary-800',
              },
              {
                icon: Star,
                title: 'Weekly Coverage',
                description: 'Each class has a detailed weekly breakdown of topics, ensuring systematic preparation throughout the term.',
                color: 'from-accent-600 to-accent-800',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 hover:border-primary-200 group"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prize Section */}
      <section className="py-20 bg-gradient-to-br from-accent-500 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Trophy className="absolute top-10 right-10 w-64 h-64" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
            Win ₦30,000 Cash Prize!
          </h2>
          <p className="text-xl text-accent-100 max-w-3xl mx-auto mb-8">
            Every student who scores 70% and above in their cumulative term assessment wins ₦30,000.
            Practice hard, aim high, and let your mathematics skills earn you real rewards!
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-white text-accent-700 rounded-xl font-bold text-lg hover:bg-accent-50 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Register & Start Quiz
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Classes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Class
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From Primary 1 to Primary 6, each class has a tailored curriculum with 40 questions per term.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'].map((cls, i) => (
              <button
                key={cls}
                onClick={() => onNavigate('register')}
                className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${['#2cb8ef', '#1799d1', '#1479a8', '#f59e0b', '#d97706', '#16628b'][i]}, ${['#56d3ff', '#2cb8ef', '#1799d1', '#fbbf24', '#f59e0b', '#1479a8'][i]})`,
                }}
              >
                <div className="text-white">
                  <div className="text-3xl font-bold font-display mb-2">{cls.replace('Primary ', 'P')}</div>
                  <div className="text-sm font-medium opacity-90">{cls}</div>
                  <div className="mt-3 text-xs opacity-75">40 Questions/Term</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-700 to-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Mathematics Journey?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Register for just ₦5,000 and get access to all three terms of curriculum-based quizzes,
            plus the mental math challenge. Your questions are waiting!
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="px-10 py-5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-bold text-xl transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-3 group"
          >
            Register Now — ₦5,000
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
