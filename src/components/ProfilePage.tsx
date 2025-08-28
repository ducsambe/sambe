import React, { useState, useEffect } from 'react';
import { User, Camera, Edit, Save, X, History, CreditCard, Percent, Heart, Upload, Lock, Eye, EyeOff, MapPin, Calendar, Phone, Mail, LogOut, Star, Download, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, userProfile, updateProfile, signOut } = useAuth();
  const { notifications } = useNotifications();
  const { getFavoriteProperties } = useFavorites();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  
  const [editForm, setEditForm] = useState({
    full_name: userProfile?.full_name || '',
    email: userProfile?.email || '',
    phone_number: userProfile?.phone_number || '',
    avatar_url: userProfile?.avatar_url || '',
    address: userProfile?.address || '',
    city: userProfile?.city || '',
    country: 'Cameroun'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock payment data - replace with real data from your backend
  const [payments] = useState([
    {
      id: '1',
      property_title: language === 'en' ? 'Premium Residential Land - Douala' : 'Terrain Résidentiel Premium - Douala',
      amount: 2500000,
      type: language === 'en' ? 'Transaction Fee' : 'Frais de Transaction',
      status: 'completed',
      date: '2024-01-15',
      payment_method: 'MTN Mobile Money',
      reference: 'TXN-2024-001'
    },
    {
      id: '2',
      property_title: language === 'en' ? 'Modern Apartment - Yaoundé' : 'Appartement Moderne - Yaoundé',
      amount: 150000,
      type: language === 'en' ? 'Reservation Fee' : 'Frais de Réservation',
      status: 'completed',
      date: '2024-01-10',
      payment_method: 'Orange Money',
      reference: 'TXN-2024-002'
    },
    {
      id: '3',
      property_title: language === 'en' ? 'Commercial Space - Bafoussam' : 'Espace Commercial - Bafoussam',
      amount: 75000,
      type: language === 'en' ? 'Documentation Fee' : 'Frais de Documentation',
      status: 'pending',
      date: '2024-01-20',
      payment_method: 'Bank Transfer',
      reference: 'TXN-2024-003'
    }
  ]);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        phone_number: userProfile.phone_number || '',
        avatar_url: userProfile.avatar_url || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        country: 'Cameroun'
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = await getFavoriteProperties();
      setFavoriteProperties(favorites);
    };
    
    if (userProfile) {
      loadFavorites();
    }
  }, [userProfile, getFavoriteProperties]);

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Access Restricted' : 'Accès Restreint'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Please log in to access your profile.' 
              : 'Veuillez vous connecter pour accéder à votre profil.'
            }
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Here you would upload the image to your storage service
      let avatarUrl = editForm.avatar_url;
      if (profileImageFile) {
        // Mock image upload - replace with actual upload logic
        avatarUrl = profileImagePreview;
      }

      await updateProfile({
        ...editForm,
        avatar_url: avatarUrl
      });

      setIsEditing(false);
      setProfileImageFile(null);
      setProfileImagePreview('');
      toast.success(language === 'en' ? 'Profile updated successfully!' : 'Profil mis à jour avec succès !');
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to update profile' : 'Échec de la mise à jour du profil');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(language === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      // Here you would call your password change API
      toast.success(language === 'en' ? 'Password changed successfully!' : 'Mot de passe changé avec succès !');
      setShowPasswordChange(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(language === 'en' ? 'Failed to change password' : 'Échec du changement de mot de passe');
    }
  };

  const handleCancel = () => {
    setEditForm({
      full_name: userProfile.full_name || '',
      email: userProfile.email || '',
      phone_number: userProfile.phone_number || '',
      avatar_url: userProfile.avatar_url || '',
      address: userProfile.address || '',
      city: userProfile.city || '',
      country: 'Cameroun'
    });
    setIsEditing(false);
    setProfileImageFile(null);
    setProfileImagePreview('');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(language === 'en' ? 'Logged out successfully' : 'Déconnexion réussie');
    } catch (error) {
      toast.error(language === 'en' ? 'Logout failed' : 'Échec de la déconnexion');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return language === 'en' ? 'Completed' : 'Terminé';
      case 'pending': return language === 'en' ? 'Pending' : 'En attente';
      case 'failed': return language === 'en' ? 'Failed' : 'Échoué';
      default: return status;
    }
  };

  const tabs = [
    { id: 'profile', label: language === 'en' ? 'Profile' : 'Profil', icon: User },
    { id: 'favorites', label: language === 'en' ? 'Favorites' : 'Favoris', icon: Heart },
    { id: 'payments', label: language === 'en' ? 'Payments' : 'Paiements', icon: CreditCard },
    { id: 'history', label: language === 'en' ? 'History' : 'Historique', icon: History }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-green-600 to-red-600 flex items-center justify-center">
                  {profileImagePreview || userProfile.avatar_url ? (
                    <img 
                      src={profileImagePreview || userProfile.avatar_url} 
                      alt={userProfile.full_name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User className="h-16 w-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{userProfile.full_name}</h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-red-100 text-green-800 rounded-full text-sm font-medium mt-2">
                {userProfile.role === 'client' 
                  ? (language === 'en' ? 'Client' : 'Client')
                  : (language === 'en' ? 'Administrator' : 'Administrateur')
                }
              </span>
            </div>

            {/* Profile Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {language === 'en' ? 'Personal Information' : 'Informations Personnelles'}
                </h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-red-700 transition-all flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Edit' : 'Modifier'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Save' : 'Sauvegarder'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Cancel' : 'Annuler'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Full Name' : 'Nom Complet'}
                  </label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Phone' : 'Téléphone'}
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'City' : 'Ville'}
                  </label>
                  <select
                    value={editForm.city}
                    onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
                  >
                    <option value="">
                      {language === 'en' ? 'Select a city' : 'Sélectionner une ville'}
                    </option>
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Bamenda">Bamenda</option>
                    <option value="Garoua">Garoua</option>
                    <option value="Maroua">Maroua</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Address' : 'Adresse'}
                  </label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-50"
                    placeholder={language === 'en' ? 'Enter your address' : 'Entrez votre adresse'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Registration Date' : 'Date d\'inscription'}
                  </label>
                  <input
                    type="text"
                    value={new Date(userProfile.created_at).toLocaleDateString('fr-FR')}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Country' : 'Pays'}
                  </label>
                  <input
                    type="text"
                    value="Cameroun 🇨🇲"
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {language === 'en' ? 'Security' : 'Sécurité'}
                </h3>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'Change Password' : 'Changer le Mot de Passe'}
                </button>
              </div>

              {showPasswordChange && (
                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Current Password' : 'Mot de Passe Actuel'}
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'New Password' : 'Nouveau Mot de Passe'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Confirm New Password' : 'Confirmer le Nouveau Mot de Passe'}
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordChange}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {language === 'en' ? 'Update Password' : 'Mettre à Jour'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {language === 'en' ? 'Cancel' : 'Annuler'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'My Favorite Properties' : 'Mes Biens Favoris'}
              </h3>
              <span className="bg-gradient-to-r from-green-100 to-red-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {favoriteProperties.length} {language === 'en' ? 'properties' : 'biens'}
              </span>
            </div>

            {favoriteProperties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'No Favorites Yet' : 'Aucun Favori Pour le Moment'}
                </h4>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'Start exploring properties and add them to your favorites!'
                    : 'Commencez à explorer les biens et ajoutez-les à vos favoris !'
                  }
                </p>
                <button className="bg-gradient-to-r from-green-600 to-red-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-red-700 transition-all">
                  {language === 'en' ? 'Browse Properties' : 'Parcourir les Biens'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProperties.map(property => (
                  <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src={property.property_images?.[0]?.image_url || '/placeholder.svg?height=200&width=300&query=modern house'} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <button className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {property.status === 'disponible' 
                            ? (language === 'en' ? 'Available' : 'Disponible')
                            : property.status === 'vendu'
                            ? (language === 'en' ? 'Sold' : 'Vendu')
                            : (language === 'en' ? 'Reserved' : 'Réservé')
                          }
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h4>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-green-600">{formatPrice(property.price)}</p>
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            {language === 'en' ? 'View' : 'Voir'}
                          </button>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                            {language === 'en' ? 'Contact' : 'Contacter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {language === 'en' ? 'Payment Management' : 'Gestion des Paiements'}
              </h3>
              <button className="bg-gradient-to-r from-green-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-red-700 transition-all flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {language === 'en' ? 'New Payment' : 'Nouveau Paiement'}
              </button>
            </div>
            
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{payments.filter(p => p.status === 'completed').length}</div>
                <div className="text-green-100">
                  {language === 'en' ? 'Completed Payments' : 'Paiements Terminés'}
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{payments.filter(p => p.status === 'pending').length}</div>
                <div className="text-yellow-100">
                  {language === 'en' ? 'Pending Payments' : 'Paiements en Attente'}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">
                  {formatPrice(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}
                </div>
                <div className="text-blue-100">
                  {language === 'en' ? 'Total Paid' : 'Total Payé'}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold">
                  {language === 'en' ? 'Payment History' : 'Historique des Paiements'}
                </h4>
              </div>
              <div className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900">{payment.property_title}</h5>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {getStatusText(payment.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{language === 'en' ? 'Type:' : 'Type :'}</span>
                            <div>{payment.type}</div>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'en' ? 'Method:' : 'Méthode :'}</span>
                            <div>{payment.payment_method}</div>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'en' ? 'Date:' : 'Date :'}</span>
                            <div>{new Date(payment.date).toLocaleDateString('fr-FR')}</div>
                          </div>
                          <div>
                            <span className="font-medium">{language === 'en' ? 'Reference:' : 'Référence :'}</span>
                            <div className="font-mono text-xs">{payment.reference}</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6 text-right">
                        <div className="text-xl font-bold text-green-600">{formatPrice(payment.amount)}</div>
                        <div className="flex gap-2 mt-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {language === 'en' ? 'Receipt' : 'Reçu'}
                          </button>
                          {payment.status === 'pending' && (
                            <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                              {language === 'en' ? 'Pay Now' : 'Payer'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-lg font-semibold mb-4">
                {language === 'en' ? 'Available Payment Methods' : 'Méthodes de Paiement Disponibles'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-semibold">MTN Mobile Money</h5>
                  <p className="text-sm text-gray-600">*126#</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-semibold">Orange Money</h5>
                  <p className="text-sm text-gray-600">#150#</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h5 className="font-semibold">
                    {language === 'en' ? 'Bank Transfer' : 'Virement Bancaire'}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {language === 'en' ? 'All major banks' : 'Toutes les banques'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Activity History' : 'Historique des Activités'}
            </h3>
            
            <div className="space-y-4">
              {notifications.slice(0, 5).map(notification => (
                <div key={notification.id} className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${notification.is_read ? 'bg-gray-300' : 'bg-green-500'}`}></div>
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                <>
                  <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'en' ? 'Account Login' : 'Connexion au Compte'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? 'Successful login to your account' : 'Connexion réussie à votre compte'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {language === 'en' ? 'Today at 14:30' : 'Aujourd\'hui à 14:30'}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {language === 'en' ? 'Profile Updated' : 'Profil Mis à Jour'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? 'Your profile information has been updated' : 'Vos informations de profil ont été mises à jour'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {language === 'en' ? 'Yesterday at 16:45' : 'Hier à 16:45'}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'en' ? 'My Profile' : 'Mon Profil'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage your personal information and track your activities'
              : 'Gérez vos informations personnelles et suivez vos activités'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="flex flex-wrap justify-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-600 to-red-600 text-white shadow-lg'
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-2xl p-6">
          {renderTabContent()}
        </div>

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center mx-auto shadow-lg"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {language === 'en' ? 'Logout' : 'Se Déconnecter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;