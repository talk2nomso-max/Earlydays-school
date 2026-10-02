import { Target, Heart, BookOpen, Trophy, Users, TrendingUp, GraduationCap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-700 to-primary-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-6 text-accent-400" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">Our Mission</h1>
          <p className="text-xl text-primary-100 leading-relaxed">
            To awaken the culture of practicing mathematics in upcoming Nigerian youths by making
            learning engaging, rewarding, and accessible to every child across the nation.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Why We Built RexMaths Brain</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mathematics is the foundation of science, technology, and innovation. Yet many Nigerian
                children struggle with math because they lack consistent practice and motivation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                RexMaths Brain was created to change that. By combining AI-generated questions with
                real cash rewards, we make mathematics practice exciting and purposeful. Every question
                a child answers brings them closer to mastery — and potentially to winning real prizes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform covers the full Nigerian primary school curriculum from Primary 1 to
                Primary 6, with weekly coverage that aligns with what children learn in school each term.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: 'Curriculum-Aligned', desc: 'Follows the latest Nigerian primary school curriculum', color: 'bg-primary-50 text-primary-700' },
                { icon: Trophy, title: 'Real Rewards', desc: '₦30,000 for students scoring 70% and above', color: 'bg-accent-50 text-accent-700' },
                { icon: Users, title: 'All Classes', desc: 'Primary 1 through Primary 6 covered', color: 'bg-success-50 text-success-700' },
                { icon: TrendingUp, title: 'Track Progress', desc: 'Monitor improvement across three terms', color: 'bg-error-50 text-error-700' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`${item.color} rounded-2xl p-6`}>
                    <Icon className="w-8 h-8 mb-3" />
                    <h3 className="font-display font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm opacity-80">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl p-8 lg:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                  <Heart className="w-8 h-8 text-error-500" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Passion for Learning</h3>
                <p className="text-gray-600 text-sm">We believe every child can excel in mathematics with the right tools and motivation.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                  <GraduationCap className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Academic Excellence</h3>
                <p className="text-gray-600 text-sm">Our questions are designed to build real understanding, not just test-taking skills.</p>
              </div>
              <div className="text-center">
                <div className="inline-flex p-4 bg-white rounded-2xl shadow-sm mb-4">
                  <Trophy className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Rewarding Success</h3>
                <p className="text-gray-600 text-sm">We put our money where our mission is — ₦30,000 for top performers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
