import { Link, useLocation } from 'react-router-dom';
import { Scale, Shield, Languages, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useLanguage } from '../lib/language';

export default function Header() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { user, signOut } = useAuth();
  const { isHindi, toggleLanguage } = useLanguage();

  return (
    <header className="bg-[#1a2847] border-b-4 border-[#ff9933] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full">
              <Scale className="w-8 h-8 text-[#1a2847]" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">AI Lawyer</h1>
              <p className="text-[#ff9933] text-xs">Legal Intelligence & Awareness Platform</p>
            </div>
          </Link>

          {isLanding ? (
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white hover:text-[#ff9933] transition-colors">Features</a>
              <a href="#about" className="text-white hover:text-[#ff9933] transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-[#ff9933] transition-colors">Contact</a>
              <button onClick={toggleLanguage} className="px-4 py-2 border border-white/30 text-white rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {isHindi ? 'English' : 'हिन्दी'}
              </button>
              <Link to="/login" className="px-6 py-2 bg-white text-[#1a2847] rounded hover:bg-[#ff9933] hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/login" className="px-6 py-2 bg-[#ff9933] text-white rounded hover:bg-[#138808] transition-colors">
                Create Account
              </Link>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={toggleLanguage} className="text-white hover:text-[#ff9933] transition-colors flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {isHindi ? 'English' : 'हिन्दी'}
              </button>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white hover:text-[#ff9933] transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button onClick={signOut} className="text-white hover:text-[#ff9933] transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-white hover:text-[#ff9933] transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Login
                </Link>
              )}
              <Link to="/contact" className="text-white hover:text-[#ff9933] transition-colors">
                Contact
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
