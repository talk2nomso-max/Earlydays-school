import { useState } from 'react';
import { UserPlus, Loader2, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { classLevels } from '@/lib/questionGenerator';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [classLevel, setClassLevel] = useState('Primary 1');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password, fullName, classLevel, parentEmail, parentPhone);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center animate-slide-up">
          <div className="inline-flex p-4 bg-success-100 rounded-2xl mb-4">
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your account has been created. Please sign in with your email and password to access the quizzes.
          </p>
          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-accent-800">
              <strong>Registration Fee: ₦5,000</strong>
              <br />
              Please complete your payment to activate full quiz access. You'll be prompted to pay after signing in.
            </p>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all"
          >
            Proceed to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Register for RexMaths Brain</h1>
          <p className="text-gray-600">Create your account and start your mathematics journey today</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Child's Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                placeholder="Enter child's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
              <div className="grid grid-cols-3 gap-2">
                {classLevels.map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setClassLevel(cls)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      classLevel === cls
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Email</label>
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="parent@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Phone</label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="+234 800 000 0000"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-gray-900 mb-4">Account Credentials</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Login Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="child@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>
            </div>

            <div className="bg-accent-50 border border-accent-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-accent-800 font-medium">Registration Fee</div>
                  <div className="text-2xl font-bold text-accent-900">₦5,000</div>
                </div>
                <div className="text-right text-sm text-accent-700">
                  <div>Full access to all 3 terms</div>
                  <div>+ Mental Math Challenge</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">Already have an account? </span>
            <button onClick={() => onNavigate('login')} className="text-sm text-primary-600 font-semibold hover:text-primary-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
