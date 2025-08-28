import React, { useState } from 'react';
import { User, Heart, Bell, FileText, CreditCard, Settings, Download, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { properties } from '../../data/properties';

const UserDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return null;

  const favoriteProperties = properties.filter(p => user.favorites.includes(p.id));
  
  const mockReservations = [
    {
      id: '1',
      property: properties[0],
      status: 'confirmed',
      created_at: '2024-01-15T10:00:00Z',
      expires_at: '2024-02-15T23:59:59Z'
    }
  ];

  const mockPayments = [
    {
      id: '1',
      amount: 75000,
      status: 'completed',
      created_at: '2024-01-15T10:00:00Z',
      property_title: 'Terrain Résidentiel Premium - Vue Mer'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'reservations', label: 'Réservations', icon: FileText },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{favoriteProperties.length}</div>
                <div className="text-emerald-100">Biens favoris</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{mockReservations.length}</div>
                <div className="text-blue-100">Réservations actives</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="text-2xl font-bold">{mockPayments.length}</div>
                <div className="text-purple-100">Achats réalisés</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
                  <Heart className="h-5 w-5 text-emerald-600 mr-3" />
                  <div>
                    <div className="font-medium">Bien ajouté aux favoris</div>
                    <div className="text-sm text-gray-600">Terrain Résidentiel Premium - Vue Mer</div>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium">Paiement effectué</div>
                    <div className="text-sm text-gray-600">{formatPrice(75000)} - Terrain Saly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Mes biens favoris</h3>
            {favoriteProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun bien en favoris</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteProperties.map(property => (
                  <div key={property.id} className="bg-white p-4 rounded-xl shadow-lg">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold mb-2">{property.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <div className="text-lg font-bold text-emerald-600">
                      {formatPrice(property.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'reservations':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Mes réservations</h3>
            <div className="space-y-4">
              {mockReservations.map(reservation => (
                <div key={reservation.id} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{reservation.property.title}</h4>
                      <p className="text-sm text-gray-600">{reservation.property.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date de réservation:</span>
                      <div className="font-medium">{new Date(reservation.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Expire le:</span>
                      <div className="font-medium">{new Date(reservation.expires_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                      Finaliser l'achat
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payments':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Historique des paiements</h3>
            <div className="space-y-4">
              {mockPayments.map(payment => (
                <div key={payment.id} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold">{payment.property_title}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-600">
                        {formatPrice(payment.amount)}
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Payé
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger la facture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Nouveau bien disponible</h4>
                    <p className="text-sm text-gray-600">Un terrain correspondant à vos critères est disponible</p>
                    <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
                  </div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">Paiement confirmé</h4>
                    <p className="text-sm text-gray-600">Votre paiement de {formatPrice(75000)} a été traité</p>
                    <p className="text-xs text-gray-400 mt-1">Hier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Paramètres du compte</h3>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold mb-4">Informations personnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => updateUser({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => updateUser({ email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={user.phone}
                      onChange={(e) => updateUser({ phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold mb-4">Préférences de notification</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.notifications_enabled}
                      onChange={(e) => updateUser({ notifications_enabled: e.target.checked })}
                      className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Recevoir les notifications par email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={user.two_factor_enabled}
                      onChange={(e) => updateUser({ two_factor_enabled: e.target.checked })}
                      className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <span>Authentification à deux facteurs (2FA)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
          <p className="text-gray-600">Bienvenue, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium mt-2">
                  {user.role === 'client' ? 'Client' : 'Administrateur'}
                </span>
              </div>

              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-emerald-100 text-emerald-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;