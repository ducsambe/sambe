import React, { useState } from 'react';
import { Search, Menu, Heart, User, LogOut, Settings, Bell, Shield, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import UserProfilePage from './UserProfilePage';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, onSectionChange }) => {
  const { user, userProfile, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { language } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigationItems = [
    { id: 'accueil', label: language === 'en' ? 'Home' : 'Accueil' },
    { id: 'categories', label: language === 'en' ? 'Properties' : 'Nos Biens' },
    { id: 'about', label: language === 'en' ? 'About' : 'À Propos' },
    { id: 'messaging', label: language === 'en' ? 'Messaging' : 'Messagerie' },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'Profil' },
  ];

  const handleSectionChange = (section: string) => {
    if (section === 'profile' && !user) {
      onSectionChange('login');
      return;
    }
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    onSectionChange('accueil');
  };

  // Show profile page if user clicked on profile
  if (showProfile && user && userProfile) {
    return <UserProfilePage onClose={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => onSectionChange('accueil')}>
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/WhatsApp Image 2025-08-04 at 12.27.08_fad1086b.jpg" 
                  alt="GEOCASA GROUP" 
                  className="h-10 w-auto mr-3"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-geocasa-blue to-geocasa-orange bg-clip-text text-transparent">
                    GEOCASA GROUP
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    {language === 'en' ? 'Real Estate Cameroon' : 'Le Cadastre et L Immobilier Facile'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-geocasa-blue bg-blue-50 shadow-sm'
                      : 'text-gray-700 hover:text-geocasa-blue hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Admin Access Button */}
              <button 
                onClick={() => onSectionChange('admin')}
                className="hidden sm:flex items-center p-2 text-gray-600 hover:text-geocasa-orange hover:bg-orange-50 rounded-lg transition-all"
                title={language === 'en' ? 'Admin Access' : 'Accès Admin'}
              >
                <Shield className="h-5 w-5" />
              </button>

              {/* Search Button */}
              <button className="p-2 text-gray-600 hover:text-geocasa-blue hover:bg-gray-50 rounded-lg transition-all">
                <Search className="h-5 w-5" />
              </button>

              {/* Favorites Button */}
              <button 
                onClick={() => handleSectionChange('favorites')}
                className="relative p-2 text-gray-600 hover:text-geocasa-orange hover:bg-gray-50 rounded-lg transition-all"
              >
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user && userProfile ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="hidden sm:flex items-center p-2 text-gray-600 hover:text-geocasa-blue hover:bg-gray-50 rounded-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-geocasa-blue to-geocasa-orange rounded-full flex items-center justify-center mr-2">
                      {userProfile.profile_image_url ? (
                        <img 
                          src={userProfile.profile_image_url || "/placeholder.svg"} 
                          alt={`${userProfile.first_name} ${userProfile.last_name}`} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="text-sm font-medium max-w-24 truncate">
                      {userProfile.first_name} {userProfile.last_name}
                    </span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile.first_name} {userProfile.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button 
                        onClick={() => {
                          handleSectionChange('profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        {language === 'en' ? 'My Profile' : 'Mon Profil'}
                      </button>
                      
                      <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors">
                        <Bell className="h-4 w-4 mr-3" />
                        {language === 'en' ? 'Notifications' : 'Notifications'}
                      </button>
                      
                      <button 
                        onClick={() => {
                          handleSectionChange('favorites');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Heart className="h-4 w-4 mr-3" />
                        {language === 'en' ? 'My Favorites' : 'Mes Favoris'}
                        {favorites.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          handleSectionChange('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 transition-colors"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        {language === 'en' ? 'Admin Panel' : 'Panneau Admin'}
                      </button>
                      
                      <hr className="my-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-geocasa-orange hover:bg-orange-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {language === 'en' ? 'Logout' : 'Déconnexion'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => handleSectionChange('login')}
                  className="hidden sm:flex items-center bg-gradient-to-r from-geocasa-blue to-geocasa-orange hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
                >
                  <User className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Login' : 'Connexion'}
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/WhatsApp Image 2025-08-04 at 12.27.08_fad1086b.jpg" 
                  alt="GEOCASA GROUP" 
                  className="h-8 w-auto mr-3"
                />
                <h3 className="text-xl font-bold">GEOCASA GROUP</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                {language === 'en' 
                  ? 'Your trusted partner for all your real estate projects in Cameroon. Over 15 years of experience serving Douala, Yaoundé and beyond.'
                  : 'Votre partenaire de confiance pour tous vos projets immobiliers au Cameroun. Plus de 15 ans d\'expérience au service de Douala, Yaoundé et au-delà.'
                }
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                  Instagram
                </a>
                <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Quick Links' : 'Liens Rapides'}
              </h4>
              <ul className="space-y-3">
                {navigationItems.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleSectionChange(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => handleSectionChange('admin')}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {language === 'en' ? 'Admin Access' : 'Accès Admin'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Contact' : 'Contact'}
              </h4>
              <div className="space-y-3 text-gray-300">
                <p>Douala, Akwa - Cameroun</p>
                <p>Yaoundé, Bastos - Cameroun</p>
                <p>+237 6 XX XX XX XX</p>
                <p>contact@geocasagroup.cm</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GEOCASA GROUP - Cameroun. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
};

export default Layout;