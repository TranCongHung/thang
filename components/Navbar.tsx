import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Trophy, Home, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Trang chủ', icon: <Home size={20} /> },
    { path: '/leaderboard', label: 'Bảng vàng', icon: <Trophy size={20} /> },
  ];

  return (
    <nav className="bg-military-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-1.5 rounded text-yellow-400 font-bold border-2 border-yellow-500">
                <BookOpen size={24} />
              </div>
              <span className="font-serif font-bold text-xl tracking-wide uppercase text-yellow-500">
                Sư đoàn 324
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-military-700 text-yellow-400'
                      : 'text-gray-300 hover:bg-military-800 hover:text-white'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-military-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-military-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-military-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-military-900 text-yellow-400'
                    : 'text-gray-300 hover:bg-military-700 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;