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
import AdminDashboard from './components/admin/AdminDashboard';
import LoginModal from './components/auth/LoginModal';
import { BrowserRouter as Router } from 'react-router-dom';


const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, userProfile } = useAuth();

  const handleSectionChange = (section: string) => {
    if (section === 'login') {
      setIsLoginModalOpen(true);
      return;
    }
    if (section === 'profile' && !user) {
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