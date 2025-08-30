import React, { useState } from 'react';
import { 
  Settings,
  Bell,
  Globe,
  Save,
  RotateCcw,
  User,
  Mail,
  Smartphone,
  CreditCard,
  Building,
  MapPin,
  Download,
  Upload
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const SettingsManagement: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    language: language,
    timezone: 'Africa/Douala',
    currency: 'XAF',
    dateFormat: 'dd/MM/yyyy',
    propertiesPerPage: 10
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Geocasa',
    email: 'contact@geocasa.com',
    phone: '+237 6XX XXX XXX',
    address: 'Douala, Cameroon',
    taxId: '123456789',
    currency: 'XAF'
  });

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));

    if (setting === 'language') {
      setLanguage(value);
    }
  };

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    toast.success(language === 'en' ? 'Settings saved successfully' : 'Paramètres enregistrés avec succès');
  };

  const resetSettings = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      language: language,
      timezone: 'Africa/Douala',
      currency: 'XAF',
      dateFormat: 'dd/MM/yyyy',
      propertiesPerPage: 10
    });
    toast.success(language === 'en' ? 'Settings reset to default' : 'Paramètres réinitialisés par défaut');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Settings Management' : 'Gestion des Paramètres'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Customize your application preferences' 
              : 'Personnalisez vos préférences d\'application'}
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={resetSettings}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Reset' : 'Réinitialiser'}
          </button>
          <button
            onClick={saveSettings}
            className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-4 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Save Changes' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-geocasa-blue" />
            {language === 'en' ? 'Notification Preferences' : 'Préférences de Notification'}
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Email Notifications' : 'Notifications par Email'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Receive important updates via email' 
                    : 'Recevez des mises à jour importantes par email'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Push Notifications' : 'Notifications Push'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Get instant alerts on your device' 
                    : 'Recevez des alertes instantanées sur votre appareil'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'SMS Notifications' : 'Notifications SMS'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Receive text message alerts' 
                    : 'Recevez des alertes par message texte'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {language === 'en' ? 'Marketing Emails' : 'Emails Marketing'}
                </div>
                <div className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Receive promotional offers and updates' 
                    : 'Recevez des offres promotionnelles et des mises à jour'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.marketingEmails}
                  onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-geocasa-blue"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-geocasa-orange" />
            {language === 'en' ? 'Application Settings' : 'Paramètres de l\'Application'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Language' : 'Langue'}
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Timezone' : 'Fuseau Horaire'}
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value="Africa/Douala">Douala (GMT+1)</option>
                <option value="Africa/Lagos">Lagos (GMT+1)</option>
                <option value="Africa/Johannesburg">Johannesburg (GMT+2)</option>
                <option value="Europe/Paris">Paris (GMT+1)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Currency' : 'Devise'}
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value="XAF">XAF (Franc CFA)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="XOF">XOF (Franc CFA Ouest)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Date Format' : 'Format de Date'}
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-MM-dd">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'en' ? 'Properties Per Page' : 'Biens par Page'}
              </label>
              <select
                value={settings.propertiesPerPage}
                onChange={(e) => handleSettingChange('propertiesPerPage', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-gray-600" />
          {language === 'en' ? 'Company Information' : 'Informations de l\'Entreprise'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Company Name' : 'Nom de l\'Entreprise'}
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Phone Number' : 'Numéro de Téléphone'}
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Tax ID' : 'Numéro d\'Identification Fiscale'}
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={companyInfo.taxId}
                onChange={(e) => handleCompanyInfoChange('taxId', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Address' : 'Adresse'}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                rows={2}
                value={companyInfo.address}
                onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Import/Export */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-gray-600" />
          {language === 'en' ? 'Data Management' : 'Gestion des Données'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <Download className="h-4 w-4 mr-2 text-geocasa-blue" />
              {language === 'en' ? 'Export Data' : 'Exporter les Données'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {language === 'en' 
                ? 'Download your data in various formats for backup or analysis' 
                : 'Téléchargez vos données dans différents formats pour sauvegarde ou analyse'}
            </p>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                {language === 'en' ? 'Export as CSV' : 'Exporter en CSV'}
              </button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                {language === 'en' ? 'Export as Excel' : 'Exporter en Excel'}
              </button>
              <button className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                {language === 'en' ? 'Export as JSON' : 'Exporter en JSON'}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <Upload className="h-4 w-4 mr-2 text-geocasa-orange" />
              {language === 'en' ? 'Import Data' : 'Importer des Données'}
            </h4>
            <p className="text-sm text-gray-60 mb-4">
              {language === 'en' 
                ? 'Upload data from external sources to update your records' 
                : 'Importez des données de sources externes pour mettre à jour vos enregistrements'}
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-500 mb-2">
                {language === 'en' ? 'Drag & drop files here' : 'Glissez-déposez les fichiers ici'}
              </div>
              <div className="text-sm text-gray-400 mb-3">
                {language === 'en' ? 'or' : 'ou'}
              </div>
              <label className="cursor-pointer bg-geocasa-blue text-white px-4 py-2 rounded-lg hover:bg-geocasa-blue-dark transition-colors">
                <span>{language === 'en' ? 'Browse Files' : 'Parcourir les Fichiers'}</span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;