import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { weeklyCoverage, classLevels } from '@/lib/questionGenerator';
import type { ClassLevel, Term } from '@/lib/supabase';

export default function CurriculumPage() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Primary 1');
  const [selectedTerm, setSelectedTerm] = useState<Term>('First Term');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const terms: Term[] = ['First Term', 'Second Term', 'Third Term'];
  const weeks = weeklyCoverage[selectedClass][selectedTerm];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-primary-700 to-primary-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-14 h-14 mx-auto mb-4 text-accent-400" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Curriculum & Weekly Coverage</h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Detailed breakdown of topics for each class, term by term, week by week —
            aligned with the Nigerian primary school mathematics curriculum.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Class Selection */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Select Class</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {classLevels.map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedClass === cls
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Term Selection */}
          <div className="mb-8">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Select Term</h2>
            <div className="grid grid-cols-3 gap-3 max-w-2xl">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    selectedTerm === term
                      ? 'bg-accent-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-accent-50 border border-gray-200'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
              <h3 className="font-display text-xl font-bold">
                {selectedClass} — {selectedTerm}
              </h3>
              <p className="text-primary-100 text-sm mt-1">
                10 weeks of coverage · 40 AI-generated quiz questions per term
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {weeks.map((week) => (
                <div key={week.week}>
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 text-primary-700 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm">
                        {week.week}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Week {week.week}</div>
                        <div className="text-sm text-gray-500">
                          {week.topics.join(', ')}
                        </div>
                      </div>
                    </div>
                    {expandedWeek === week.week ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedWeek === week.week && (
                    <div className="px-6 pb-4 pl-20 animate-slide-down">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">Topics Covered:</h4>
                        <ul className="space-y-1">
                          {week.topics.map((topic, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 text-xs text-primary-600 font-medium">
                          Quiz questions for this term are drawn from all weekly topics above.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
