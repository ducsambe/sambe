import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import { 
  BarChart3, 
  Users, 
  Building, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  TrendingUp,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { properties, loading, error } = useProperties();

  useEffect(() => {
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('geocasa_admin');
    if (storedAdmin) {
      try {
        const adminInfo = JSON.parse(storedAdmin);
        setAdminData(adminInfo);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('geocasa_admin');
      }
    }
  }, []);

  const handleLoginSuccess = (adminInfo: any) => {
    setAdminData(adminInfo);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('geocasa_admin');
    setAdminData(null);
    setIsAuthenticated(false);
    toast.success('Déconnexion réussie');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // Mock stats - in real app, these would come from API
  const stats = {
    total_properties: properties.length,
    total_users: 1247,
    total_sales: 89,
    monthly_revenue: 2450000,
    pending_reservations: 12,
    conversion_rate: 7.2
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-gray-600">
                  Bienvenue {adminData?.full_name || adminData?.email} - {adminData?.role}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-4 py-2 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Bien
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-geocasa-blue to-geocasa-blue-light p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_properties}</div>
                    <div className="text-blue-100">Biens disponibles</div>
                  </div>
                  <Building className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-geocasa-orange to-geocasa-orange-light p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_users}</div>
                    <div className="text-orange-100">Utilisateurs</div>
                  </div>
                  <Users className="h-8 w-8 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.total_sales}</div>
                    <div className="text-purple-100">Ventes réalisées</div>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stats.conversion_rate}%</div>
                    <div className="text-orange-100">Taux de conversion</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Actions Rapides
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Plus className="h-4 w-4 mr-3 text-green-600" />
                    Ajouter un bien
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Users className="h-4 w-4 mr-3 text-blue-600" />
                    Gérer les utilisateurs
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-3 text-purple-600" />
                    Exporter les données
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                  Alertes
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-sm font-medium text-orange-800">
                      {stats.pending_reservations} réservations en attente
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-800">
                      Système opérationnel
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Revenus du Mois
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPrice(stats.monthly_revenue)}
                </div>
                <div className="text-sm text-gray-600">+12% vs mois dernier</div>
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Biens</h1>
                <p className="text-gray-600">Gérez tous vos biens immobiliers</p>
              </div>
              <button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un bien
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un bien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="disponible">Disponible</option>
                  <option value="réservé">Réservé</option>
                  <option value="vendu">Vendu</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bien
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProperties.map(property => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={property.property_images?.[0]?.image_url || 
                                   property.images?.[0] || 
                                   'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                              alt={property.title}
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{property.title}</div>
                              <div className="text-sm text-gray-500">{property.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {property.property_type || property.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(property.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            property.status === 'disponible' 
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'réservé'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900 p-1 rounded">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-1 rounded">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600">Gérez tous les utilisateurs de la plateforme</p>
              </div>
              <button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un utilisateur
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-gray-600">Total utilisateurs</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-gray-600">Nouveaux ce mois</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-gray-600">Taux d'activité</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Interface de gestion des utilisateurs</p>
                <p className="text-sm">Fonctionnalité en développement</p>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Paiements</h1>
              <p className="text-gray-600">Suivez tous les paiements et transactions</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-semibold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Paiements Récents
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Terrain Douala - 25M FCFA</span>
                    </div>
                    <span className="text-xs text-gray-500">Aujourd'hui</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Villa Yaoundé - 85M FCFA</span>
                    </div>
                    <span className="text-xs text-gray-500">Hier</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-600" />
                  Paiements en Attente
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm">Appartement Akwa - 35M FCFA</span>
                    </div>
                    <span className="text-xs text-gray-500">2 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics et Rapports</h1>
              <p className="text-gray-600">Analysez les performances de votre plateforme</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Locations Populaires</h4>
                <div className="space-y-3">
                  {[
                    { location: 'Douala - Akwa', count: 15 },
                    { location: 'Yaoundé - Bastos', count: 12 },
                    { location: 'Douala - Bonapriso', count: 8 }
                  ].map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-green-600 mr-2" />
                        <span>{location.location}</span>
                      </div>
                      <span className="font-semibold">{location.count} biens</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h4 className="font-semibold mb-4">Performances Mensuelles</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Vues de biens</span>
                    <span className="font-semibold">12,456</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Demandes de contact</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversions</span>
                    <span className="font-semibold">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg font-medium mb-2">Fonctionnalité en développement</div>
              <p>Cette section sera bientôt disponible</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
      adminData={adminData}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;