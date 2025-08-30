import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  User,
  Smartphone,
  Mail,
  Globe,
  Bell,
  Clock,
  Save,
  RotateCcw,
  AlertCircle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SecurityManagement: React.FC = () => {
  const { language } = useLanguage();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true,
    suspiciousActivityAlerts: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSecuritySettingChange = (setting: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error(language === 'en' ? 'Password must be at least 8 characters' : 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Simulate password change
    toast.success(language === 'en' ? 'Password updated successfully' : 'Mot de passe mis à jour avec succès');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const saveSecuritySettings = () => {
    toast.success(language === 'en' ? 'Security settings saved' : 'Paramètres de sécurité enregistrés');
  };

  // Mock security logs data
  const securityLogs = [
    {
      id: '1',
      action: 'login',
      status: 'success',
      user: 'admin@geocasa.com',
      ip: '192.168.1.1',
      device: 'Chrome on Windows',
      timestamp: '2024-01-20T10:30:00Z',
      location: 'Douala, Cameroon'
    },
    {
      id: '2',
      action: 'password_change',
      status: 'success',
      user: 'admin@geocasa.com',
      ip: '192.168.1.1',
      device: 'Chrome on Windows',
      timestamp: '2024-01-19T15:45:00Z',
      location: 'Douala, Cameroon'
    },
    {
      id: '3',
      action: 'login',
      status: 'failed',
      user: 'unknown@example.com',
      ip: '103.156.22.45',
      device: 'Firefox on Linux',
      timestamp: '2024-01-18T02:20:00Z',
      location: 'Lagos, Nigeria'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en' 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Security Management' : 'Gestion de la Sécurité'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage security settings and monitor activity' 
              : 'Gérez les paramètres de sécurité et surveillez l\'activité'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">3</div>
              <div className="text-gray-600">{language === 'en' ? 'Active Sessions' : 'Sessions Actives'}</div>
            </div>
            <Shield className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">124</div>
              <div className="text-gray-600">{language === 'en' ? 'Successful Logins' : 'Connexions Réussies'}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-gray-600">{language === 'en' ? 'Failed Attempts' : 'Tentatives Échouées'}</div>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-orange">30</div>
              <div className="text-gray-600">{language === 'en' ? 'Days Since Last Audit' : 'Jours Depuis le Dernier Audit'}</div>
            </div>
            <Clock className="h-8 w-8 text-geocasa-orange" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-geocasa-blue" />
            {language === 'en' ? 'Security Settings' : 'Paramètres de Sécurité'}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Two-Factor Authentication' : 'Authentification à Deux Facteurs'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Add an extra layer of security to your account' 
                    : 'Ajoutez une couche de sécurité supplémentaire à votre compte'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={securitySettings.twoFactorAuth}
                  onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Login Alerts' : 'Alertes de Connexion'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Get notified when someone logs into your account' 
                    : 'Soyez notifié lorsque quelqu\'un se connecte à votre compte'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={securitySettings.loginAlerts}
                  onChange={(e) => handleSecuritySettingChange('loginAlerts', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Suspicious Activity Alerts' : 'Alertes d\'Activité Suspecte'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Receive alerts for unusual activity' 
                    : 'Recevez des alertes pour les activités inhabituelles'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={securitySettings.suspiciousActivityAlerts}
                  onChange={(e) => handleSecuritySettingChange('suspiciousActivityAlerts', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Session Timeout (minutes)' : 'Délai d\'Expiration de Session (minutes)'}
              </label>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={60}>60</option>
                <option value={120}>120</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Password Expiry (days)' : 'Expiration du Mot de Passe (jours)'}
              </label>
              <select
                value={securitySettings.passwordExpiry}
                onChange={(e) => handleSecuritySettingChange('passwordExpiry', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value={30}>30</option>
                <option value={60}>60</option>
                <option value={90}>90</option>
                <option value={180}>180</option>
              </select>
            </div>

            <button
              onClick={saveSecuritySettings}
              className="w-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-4 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Save Settings' : 'Enregistrer les Paramètres'}
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2 text-geocasa-orange" />
            {language === 'en' ? 'Change Password' : 'Changer le Mot de Passe'}
          </h3>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Current Password' : 'Mot de Passe Actuel'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'New Password' : 'Nouveau Mot de Passe'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Confirm New Password' : 'Confirmer le Nouveau Mot de Passe'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800">
                {language === 'en' 
                  ? 'Password must be at least 8 characters long and include uppercase, lowercase, and numbers' 
                  : 'Le mot de passe doit contenir au moins 8 caractères, incluant majuscules, minuscules et chiffres'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-4 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
            >
              {language === 'en' ? 'Update Password' : 'Mettre à jour le Mot de Passe'}
            </button>
          </form>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-600" />
            {language === 'en' ? 'Security Activity Log' : 'Journal d\'Activité de Sécurité'}
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search logs...' : 'Rechercher dans les logs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
            >
              <option value="all">{language === 'en' ? 'All Status' : 'Tous les Statuts'}</option>
              <option value="success">{language === 'en' ? 'Success' : 'Succès'}</option>
              <option value="failed">{language === 'en' ? 'Failed' : 'Échec'}</option>
            </select>

            <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Export' : 'Exporter'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'Action' : 'Action'}</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'User' : 'Utilisateur'}</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'IP Address' : 'Adresse IP'}</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'Device' : 'Appareil'}</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'Time' : 'Heure'}</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">{language === 'en' ? 'Status' : 'Statut'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900 capitalize">{log.action.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{log.user}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{log.ip}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{log.device}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{formatDate(log.timestamp)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      <span className="ml-1 capitalize">{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          {language === 'en' ? 'Showing 3 of 127 activities' : 'Affichage de 3 activités sur 127'}
        </div>
      </div>
    </div>
  );
};

export default SecurityManagement;