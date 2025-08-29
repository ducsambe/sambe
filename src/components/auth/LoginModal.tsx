import React, { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'user@geocasa.com',
    password: 'user123',
    fullName: '',
    phone: '',
    confirmPassword: ''
  });

  // Demo credentials helper
  const fillDemoCredentials = () => {
    setFormData({
      email: 'user@geocasa.com',
      password: 'user123',
      fullName: 'Demo User',
      phone: '+237670123456',
      confirmPassword: 'user123'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Direct login with email/phone and password
        const result = await signIn(formData.email.trim(), formData.password);
        if (result.success) {
          toast.success(language === 'en' ? 'Welcome back!' : 'Bon retour !');
          onClose();
        } else {
          toast.error(result.error || (language === 'en' ? 'Login failed' : 'Échec de la connexion'));
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error(language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
          return;
        }
        
        const result = await signUp(
          formData.email, 
          formData.password,
          { full_name: formData.fullName, phone_number: formData.phone }
        );
        
        if (result.success) {
          toast.success(language === 'en' ? 'Account created successfully!' : 'Compte créé avec succès !');
          onClose();
        } else {
          toast.error(result.error || (language === 'en' ? 'Registration failed' : 'Échec de l\'inscription'));
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || (language === 'en' ? 'An error occurred' : 'Une erreur s\'est produite'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-geocasa-blue"></div>
              <span>{language === 'en' ? 'Please wait...' : 'Veuillez patienter...'}</span>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src="/WhatsApp Image 2025-08-04 at 12.27.08_fad1086b.jpg" 
              alt="GEOCASA GROUP" 
              className="h-8 w-auto mr-3"
            />
            <h2 className="text-xl font-bold text-gray-900">
              {isLogin 
                ? (language === 'en' ? 'Welcome Back' : 'Bon Retour')
                : (language === 'en' ? 'Create Account' : 'Créer un Compte')
              }
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Demo Credentials Helper */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-blue-800 mb-1">
                  {language === 'en' ? 'Demo Credentials' : 'Identifiants de Démonstration'}
                </h4>
                <p className="text-xs text-blue-600">
                  {language === 'en' ? 'Click to fill demo credentials' : 'Cliquez pour remplir les identifiants de démo'}
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                {language === 'en' ? 'Fill Demo' : 'Remplir Démo'}
              </button>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              <div><strong>Email:</strong> user@geocasa.com</div>
              <div><strong>{language === 'en' ? 'Password' : 'Mot de passe'}:</strong> user123</div>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Full Name' : 'Nom Complet'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:opacity-50"
                    placeholder={language === 'en' ? 'Enter your full name' : 'Entrez votre nom complet'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:opacity-50"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Email Address' : 'Adresse Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none disabled:opacity-50"
                placeholder={language === 'en' ? 'Enter your email' : 'Entrez votre email'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Password' : 'Mot de Passe'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                disabled={isLoading}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none disabled:opacity-50"
                placeholder={language === 'en' ? 'Enter your password' : 'Entrez votre mot de passe'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Confirm Password' : 'Confirmer le Mot de Passe'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none disabled:opacity-50"
                  placeholder={language === 'en' ? 'Confirm your password' : 'Confirmez votre mot de passe'}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {language === 'en' ? 'Please wait...' : 'Veuillez patienter...'}
              </div>
            ) : (
              isLogin 
                ? (language === 'en' ? 'Sign In' : 'Se Connecter')
                : (language === 'en' ? 'Create Account' : 'Créer un Compte')
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <div className="font-semibold mb-1">
              {language === 'en' ? 'Test Account Available:' : 'Compte de Test Disponible:'}
            </div>
            <div>Email: user@geocasa.com</div>
            <div>{language === 'en' ? 'Password' : 'Mot de passe'}: user123</div>
          </div>
          <p className="text-gray-600">
            {isLogin 
              ? (language === 'en' ? "Don't have an account?" : "Vous n'avez pas de compte ?")
              : (language === 'en' ? "Already have an account?" : "Vous avez déjà un compte ?")
            }
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-geocasa-blue hover:text-geocasa-blue-dark font-semibold"
            >
              {isLogin 
                ? (language === 'en' ? 'Sign Up' : 'S\'inscrire')
                : (language === 'en' ? 'Sign In' : 'Se Connecter')
              }
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;