import { useState } from 'react';
import { LogIn, Loader2, AlertCircle, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LOGO_URL } from '@/lib/logo';

interface AdminLoginPageProps {
  onNavigate: (page: string) => void;
}

export default function AdminLoginPage({ onNavigate }: AdminLoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (email !== 'talk2nomso@gmail.com') {
      setError('This login is restricted to the administrator account only.');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary-600/20 backdrop-blur-sm rounded-2xl mb-4 border border-primary-500/30">
            <img src={LOGO_URL} alt="RexMaths Brain" className="w-10 h-10 rounded-lg object-cover" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-400">Restricted access — administrators only</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8">
          {error && (
            <div className="bg-error-500/20 border border-error-500/30 text-error-300 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
                placeholder="admin@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
                placeholder="Enter admin password"
              />
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
                  Admin Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button onClick={() => onNavigate('home')} className="text-sm text-gray-400 hover:text-white transition-colors">
              Back to Home
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary-400 flex-shrink-0" />
            <p className="text-xs text-gray-400">
              This page is exclusively for the site administrator. Student accounts cannot access this area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
