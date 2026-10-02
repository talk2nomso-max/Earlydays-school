import { useState } from 'react';
import { Menu, X, LogIn, Home, Info, BookOpen, Trophy, Phone } from 'lucide-react';
import { LOGO_URL } from '@/lib/logo';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
    { id: 'prizes', label: 'Prizes', icon: Trophy },
    { id: 'contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group">
            <img src={LOGO_URL} alt="RexMaths Brain" className="w-11 h-11 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow" />
            <div className="text-left">
              <span className="font-display font-bold text-lg text-gray-900 block leading-none">RexMaths</span>
              <span className="text-xs text-primary-600 font-semibold leading-none">Brain</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    currentPage === link.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('login')}
              className="ml-2 px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium flex items-center gap-2 ${
                    currentPage === link.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                onNavigate('login');
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
