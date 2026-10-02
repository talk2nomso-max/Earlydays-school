import { useEffect, useState } from 'react';
import { Users, Trophy, BookOpen, Zap, LogOut, TrendingUp, Award, ChevronDown, ChevronUp, Mail, Phone, Eye } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, Student, QuizAttempt } from '@/lib/supabase';
import { generateQuizQuestions, generateMentalMathQuestions } from '@/lib/questionGenerator';
import { QuizQuestion, Term } from '@/lib/supabase';
import { LOGO_URL } from '@/lib/logo';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { signOut } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<QuizQuestion[] | null>(null);
  const [previewConfig, setPreviewConfig] = useState<{ classLevel: string; term: Term; quizType: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [studentsRes, attemptsRes] = await Promise.all([
      supabase.from('students').select('*').order('created_at', { ascending: false }),
      supabase.from('quiz_attempts').select('*').order('created_at', { ascending: false }),
    ]);
    setStudents((studentsRes.data as Student[]) || []);
    setAttempts((attemptsRes.data as QuizAttempt[]) || []);
    setLoading(false);
  }

  const getStudentAttempts = (studentId: string) => attempts.filter(a => a.student_id === studentId);
  const getStudentCumulative = (studentId: string) => {
    const studentAttempts = getStudentAttempts(studentId);
    if (studentAttempts.length === 0) return 0;
    return Math.round(studentAttempts.reduce((sum, a) => sum + a.percentage, 0) / studentAttempts.length);
  };
  const prizeWinners = students.filter(s => getStudentCumulative(s.id) >= 70);

  const handlePreview = (classLevel: string, term: Term, quizType: 'curriculum' | 'mental_math') => {
    // Generate sample questions for preview (using a sample student ID)
    const sampleId = `preview-${classLevel}-${term}`;
    const questions = quizType === 'mental_math'
      ? generateMentalMathQuestions(sampleId, classLevel as any, [])
      : generateQuizQuestions(sampleId, classLevel as any, term, []);

    setPreviewQuestions(questions);
    setPreviewConfig({ classLevel, term, quizType });
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-3">
                <img src={LOGO_URL} alt="RexMaths Brain" className="w-10 h-10 rounded-xl object-cover" />
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">RexMaths Brain — Management Panel</p>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 text-primary-600" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-3xl font-bold font-display text-gray-900">{students.length}</div>
            <div className="text-xs text-gray-500 mt-1">Registered Students</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-6 h-6 text-success-600" />
              <span className="text-xs text-gray-400">Winners</span>
            </div>
            <div className="text-3xl font-bold font-display text-success-600">{prizeWinners.length}</div>
            <div className="text-xs text-gray-500 mt-1">Scored 70%+ (₦30,000)</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-6 h-6 text-accent-600" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-3xl font-bold font-display text-gray-900">{attempts.filter(a => a.quiz_type === 'curriculum').length}</div>
            <div className="text-xs text-gray-500 mt-1">Curriculum Attempts</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-error-600" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-3xl font-bold font-display text-gray-900">{attempts.filter(a => a.quiz_type === 'mental_math').length}</div>
            <div className="text-xs text-gray-500 mt-1">Mental Math Attempts</div>
          </div>
        </div>

        {/* Question Preview Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6" />
              <div>
                <h3 className="font-display text-lg font-bold">Preview Quiz Questions</h3>
                <p className="text-primary-200 text-sm">View sample AI-generated questions for any class and term</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <PreviewControls onPreview={handlePreview} />
          </div>
        </div>

        {/* Question Preview Results */}
        {previewQuestions && previewConfig && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-gray-900">
                  {previewConfig.classLevel} — {previewConfig.quizType === 'mental_math' ? 'Mental Math' : previewConfig.term}
                </h3>
                <p className="text-sm text-gray-500">{previewQuestions.length} questions · Sample preview</p>
              </div>
              <button
                onClick={() => { setPreviewQuestions(null); setPreviewConfig(null); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all"
              >
                Close Preview
              </button>
            </div>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto scrollbar-thin">
              {previewQuestions.map((q, i) => (
                <div key={q.id} className="px-6 py-4">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="bg-primary-100 text-primary-700 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{q.topic}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          q.difficulty === 'easy' ? 'bg-success-50 text-success-700' :
                          q.difficulty === 'medium' ? 'bg-accent-50 text-accent-700' :
                          'bg-error-50 text-error-700'
                        }`}>{q.difficulty}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900 mb-2">{q.question_text}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, j) => (
                          <div key={j} className={`text-xs px-3 py-1.5 rounded-lg ${
                            opt === q.correct_answer ? 'bg-success-50 text-success-700 font-semibold' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {String.fromCharCode(65 + j)}. {opt}
                            {opt === q.correct_answer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prize Winners */}
        {prizeWinners.length > 0 && (
          <div className="bg-gradient-to-br from-success-50 to-accent-50 rounded-2xl border-2 border-success-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-7 h-7 text-success-600" />
              <h3 className="font-display text-xl font-bold text-gray-900">Prize Winners (70%+)</h3>
            </div>
            <div className="space-y-2">
              {prizeWinners.map(s => {
                const cumScore = getStudentCumulative(s.id);
                return (
                  <div key={s.id} className="bg-white rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-success-600" />
                      <div>
                        <div className="font-semibold text-gray-900">{s.full_name}</div>
                        <div className="text-xs text-gray-500">{s.class_level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success-600">{cumScore}%</div>
                      <div className="text-xs text-gray-500">₦30,000 prize</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-display text-lg font-bold text-gray-900">All Students</h3>
            <p className="text-sm text-gray-500">Click a student to view their quiz history</p>
          </div>
          {students.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students registered yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map(student => {
                const studentAttempts = getStudentAttempts(student.id);
                const cumulative = getStudentCumulative(student.id);
                const isExpanded = expandedStudent === student.id;
                return (
                  <div key={student.id}>
                    <button
                      onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          cumulative >= 70 ? 'bg-success-100 text-success-700' : 'bg-primary-100 text-primary-700'
                        }`}>
                          {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{student.full_name}</div>
                          <div className="text-xs text-gray-500">{student.class_level} · {studentAttempts.length} attempts</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${cumulative >= 70 ? 'text-success-600' : 'text-gray-700'}`}>
                            {cumulative}%
                          </div>
                          <div className="text-xs text-gray-400">Cumulative</div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-6 pb-4 bg-gray-50 animate-slide-down">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-xl p-4">
                            <div className="text-xs font-semibold text-gray-400 mb-2">Contact Info</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {student.parent_email}
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {student.parent_phone}
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-4">
                            <div className="text-xs font-semibold text-gray-400 mb-2">Registration</div>
                            <div className="text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-semibold ${student.registration_paid ? 'text-success-600' : 'text-accent-600'}`}>
                                  {student.registration_paid ? 'Paid' : 'Pending'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600">Joined:</span>
                                <span className="text-gray-700">{new Date(student.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {studentAttempts.length > 0 ? (
                          <div className="bg-white rounded-xl overflow-hidden">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <div className="text-xs font-semibold text-gray-400">Quiz History</div>
                            </div>
                            <div className="divide-y divide-gray-100">
                              {studentAttempts.map(a => (
                                <div key={a.id} className="px-4 py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded ${a.quiz_type === 'mental_math' ? 'bg-error-50' : 'bg-primary-50'}`}>
                                      {a.quiz_type === 'mental_math' ? <Zap className="w-4 h-4 text-error-600" /> : <BookOpen className="w-4 h-4 text-primary-600" />}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {a.quiz_type === 'mental_math' ? 'Mental Math' : a.term}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {new Date(a.created_at).toLocaleDateString()} · {a.score}/{a.total_questions}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`text-sm font-bold ${a.percentage >= 70 ? 'text-success-600' : 'text-gray-700'}`}>
                                    {a.percentage}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl p-4 text-center text-sm text-gray-500">
                            No quiz attempts yet.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewControls({ onPreview }: { onPreview: (classLevel: string, term: Term, quizType: 'curriculum' | 'mental_math') => void }) {
  const [classLevel, setClassLevel] = useState('Primary 1');
  const [term, setTerm] = useState<Term>('First Term');
  const [quizType, setQuizType] = useState<'curriculum' | 'mental_math'>('curriculum');

  const classLevels = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'];
  const terms: Term[] = ['First Term', 'Second Term', 'Third Term'];

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
          >
            {classLevels.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Term</label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value as Term)}
            disabled={quizType === 'mental_math'}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white disabled:bg-gray-100 disabled:text-gray-400"
          >
            {terms.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Type</label>
          <select
            value={quizType}
            onChange={(e) => setQuizType(e.target.value as 'curriculum' | 'mental_math')}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
          >
            <option value="curriculum">Curriculum Quiz</option>
            <option value="mental_math">Mental Math Challenge</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onPreview(classLevel, term, quizType)}
        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
      >
        <Eye className="w-4 h-4" />
        Generate Preview
      </button>
    </div>
  );
}
