import { useState } from 'react';
import { LogIn, Loader2, AlertCircle, Brain, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-700 to-primary-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 border border-white/20">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-primary-200">Sign in to continue your mathematics journey</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500">Don't have an account? </span>
            <button onClick={() => onNavigate('register')} className="text-sm text-primary-600 font-semibold hover:text-primary-700">
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
