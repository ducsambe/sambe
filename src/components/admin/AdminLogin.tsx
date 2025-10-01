import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Shield, AlertCircle, Home } from 'lucide-react';
import { supabase, isSupabaseConfigured, mockAdmins } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onLoginSuccess: (adminData: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    if (!isSupabaseConfigured()) {
      
      const admin = mockAdmins.find(a => 
        (a.email === formData.login || a.username === formData.login) && 
        a.password_hash === formData.password
      );
      
      if (!admin) {
        setError('Identifiants incorrects');
        return;
      }
      
      localStorage.setItem('geocasa_admin', JSON.stringify(admin));
      toast.success(`Bienvenue ${admin.first_name} ${admin.last_name} !`);
      onLoginSuccess(admin);
      return;
    }

    // Query admins table directly
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select(`
        *
      `)
      .or(`email.eq.${formData.login},username.eq.${formData.login}`)
      .eq('password_hash', formData.password)
      .maybeSingle();

    if (adminError || !adminData) {
      setError('Identifiants incorrects');
      return;
    }

    if (!adminData.is_active) {
      setError('Compte désactivé. Contactez l\'administrateur.');
      return;
    }

    localStorage.setItem('geocasa_admin', JSON.stringify(adminData));
    toast.success(`Bienvenue ${adminData.first_name} ${adminData.last_name} !`);
    onLoginSuccess(adminData);
  } catch (err) {
    console.error('Erreur de connexion:', err);
    setError('Identifiants incorrects ou erreur serveur.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-geocasa-blue via-geocasa-blue-dark to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='m0 0h40v40h-40z'/%3E%3Cpath d='m0 0 20 20-20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <img 
              src="/WhatsApp Image 2025-08-04 at 12.27.08_fad1086b.jpg" 
              alt="GEOCASA GROUP" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Administration
          </h1>
          <p className="text-geocasa-orange font-semibold text-lg">
            GEOCASA GROUP
          </p>
          <p className="text-blue-200 text-sm">
            Portail d'administration sécurisé
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-geocasa-blue mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Connexion Admin</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur ou Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none transition-all"
                  placeholder="admin ou admin@geocasagroup.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-geocasa-blue to-geocasa-blue-dark hover:from-geocasa-blue-dark hover:to-geocasa-blue text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Comptes de démonstration :</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div><strong>Super Admin:</strong> admin / admin123</div>
              <div><strong>Admin:</strong> geocasa_admin / geocasa2024</div>
              <div><strong>Manager:</strong> manager / manager123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm mb-2">
            © 2025 GEOCASA GROUP - Tous droits réservés
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-200 hover:text-white transition-colors text-sm font-medium"
          >
            <Home className="h-4 w-4 mr-1" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;