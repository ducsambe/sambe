import React from 'react';
import { Search, Menu, Heart, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onLoginClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                ImmoLux
              </h1>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Accueil
            </a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Terrains
            </a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Maisons
            </a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Lots
            </a>
            <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-all">
              <Heart className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="hidden sm:flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <User className="h-4 w-4 mr-3" />
                      Mon espace
                    </a>
                    {user.role === 'admin' && (
                      <a href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-3" />
                        Administration
                      </a>
                    )}
                    <button 
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="hidden sm:flex items-center bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                <User className="h-4 w-4 mr-2" />
                Connexion
              </button>
            )}
            
            <button 
              className="md:hidden p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-all"
              onClick={onMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;