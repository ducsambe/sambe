import React from 'react';
import { X, User, Heart, Search, Globe, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: Array<{ id: string; label: string }>;
  onSectionChange: (section: string) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  navigationItems, 
  onSectionChange 
}) => {
  const { user, userProfile, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    onClose();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-600 to-red-600">
          <div className="flex items-center">
            <img 
              src="/WhatsApp Image 2025-08-04 at 12.27.08_fad1086b.jpg" 
              alt="GEOCASA GROUP" 
              className="h-8 w-auto mr-2"
            />
            <div>
              <h2 className="text-lg font-bold text-white">GEOCASA</h2>
              <p className="text-xs text-green-100">Cameroun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Section */}
        {user && userProfile ? (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-red-600 rounded-full flex items-center justify-center">
                {userProfile.avatar_url ? (
                  <img 
                    src={userProfile.avatar_url || "/placeholder.svg"} 
                    alt={userProfile.full_name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{userProfile.full_name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => handleSectionChange('login')}
              className="w-full flex items-center justify-center bg-gradient-to-r from-green-600 to-red-600 text-white py-3 px-4 rounded-lg font-medium"
            >
              <User className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Login' : 'Connexion'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="py-4">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* Admin Access */}
          <button
            onClick={() => handleSectionChange('admin')}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Shield className="h-5 w-5 mr-3" />
            <span className="font-medium">{language === 'en' ? 'Admin Panel' : 'Panneau Admin'}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 py-4">
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
            <Search className="h-5 w-5 mr-3" />
            <span>{language === 'en' ? 'Search' : 'Rechercher'}</span>
          </button>
          
          <button className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
            <Heart className="h-5 w-5 mr-3" />
            <span>{language === 'en' ? 'Favorites' : 'Favoris'}</span>
          </button>

          <button
            onClick={toggleLanguage}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-5 w-5 mr-3" />
            <span>{language === 'fr' ? 'English' : 'Français'}</span>
          </button>
        </div>

        {/* User Actions */}
        {user && userProfile && (
          <div className="border-t border-gray-200 py-4">
            <button
              onClick={() => handleSectionChange('profile')}
              className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="h-5 w-5 mr-3" />
              {language === 'en' ? 'My Profile' : 'Mon Profil'}
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {language === 'en' ? 'Logout' : 'Déconnexion'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
