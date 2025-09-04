import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useAuth } from './hooks/useAuth';
import { Database } from './lib/database.types';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import CategoriesPage from './components/CategoriesPage';
import AboutPage from './components/AboutPage';
import UserProfilePage from './components/UserProfilePage';
import MessagingPage from './components/MessagingPage';
import FavoritesPage from './components/FavoritesPage';
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/auth/LoginModal';
import { BrowserRouter as Router } from 'react-router-dom';


const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, userProfile, loading } = useAuth();

  // Show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-geocasa-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }
  const handleSectionChange = (section: string) => {
    if (section === 'login') {
      setIsLoginModalOpen(true);
      return;
    }
    if (section === 'profile' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (section === 'favorites' && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (section === 'admin') {
      setActiveSection('admin');
      return;
    }
    setActiveSection(section);
  };

  // Show admin dashboard if on admin section
  if (activeSection === 'admin') {
    return (
      <>
        <AdminDashboard />
        <Toaster position="top-right" />
      </>
    );
  }
  
  const renderContent = () => {
    switch (activeSection) {
      case 'accueil':
        return <HomePage />;
      case 'categories':
        return <CategoriesPage />;
      case 'about':
        return <AboutPage />;
      case 'profile':
        return <UserProfilePage onClose={() => setActiveSection('accueil')} />;
      case 'messaging':
        return <MessagingPage />;
      case 'favorites':
        return <FavoritesPage onClose={() => setActiveSection('accueil')} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout 
      activeSection={activeSection} 
      onSectionChange={handleSectionChange}
    >
      {renderContent()}
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      
      <Toaster position="top-right" />
    </Layout>
  );
};

function App() {
   return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;