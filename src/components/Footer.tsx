import { Heart } from 'lucide-react';
import { LOGO_URL } from '@/lib/logo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={LOGO_URL} alt="RexMaths Brain" className="w-11 h-11 rounded-xl object-cover" />
              <div>
                <span className="font-display font-bold text-lg text-white block leading-none">RexMaths</span>
                <span className="text-xs text-primary-400 font-semibold leading-none">Brain</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Awakening the culture of practicing mathematics in upcoming Nigerian youths.
              AI-powered, curriculum-aligned, and rewarding excellence.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-primary-400 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-primary-400 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('curriculum')} className="hover:text-primary-400 transition-colors">Curriculum</button></li>
              <li><button onClick={() => onNavigate('prizes')} className="hover:text-primary-400 transition-colors">Prizes</button></li>
              <li><button onClick={() => onNavigate('register')} className="hover:text-primary-400 transition-colors">Register</button></li>
              <li><button onClick={() => onNavigate('admin-login')} className="hover:text-primary-400 transition-colors">Admin Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Prize Information</h4>
            <div className="bg-gradient-to-br from-accent-500/20 to-success-500/20 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-accent-400 mb-1">₦30,000</div>
              <p className="text-sm">For students scoring 70% and above in cumulative term assessment.</p>
              <div className="mt-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span>Registration:</span>
                  <span className="text-white font-semibold">₦5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 RexMaths Brain. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-error-500" /> for Nigerian children
          </p>
        </div>
      </div>
    </footer>
  );
}
