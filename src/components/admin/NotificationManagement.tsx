import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Send, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Clock,
  Calendar
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const NotificationManagement: React.FC = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    scheduled_for: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock notifications for development
    const mockNotifications = [
      {
        id: '1',
        title: 'Nouvelle propriété disponible',
        message: 'Une nouvelle villa vient d\'être ajoutée à Douala',
        type: 'info',
        target: 'all',
        sent_count: 1247,
        created_at: '2024-01-20T10:00:00Z',
        status: 'sent'
      },
      {
        id: '2',
        title: 'Maintenance programmée',
        message: 'Maintenance du site prévue dimanche de 2h à 4h',
        type: 'warning',
        target: 'all',
        sent_count: 1247,
        created_at: '2024-01-19T15:30:00Z',
        status: 'sent'
      },
      {
        id: '3',
        title: 'Offre spéciale terrains',
        message: 'Réduction de 10% sur tous les terrains ce mois-ci',
        type: 'success',
        target: 'clients',
        sent_count: 892,
        created_at: '2024-01-18T09:00:00Z',
        status: 'scheduled',
        scheduled_for: '2024-02-01T09:00:00Z'
      }
    ];
    setNotifications(mockNotifications);
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const notification = {
        id: `notif-${Date.now()}`,
        ...newNotification,
        sent_count: newNotification.target === 'all' ? 1247 : 892,
        created_at: new Date().toISOString(),
        status: newNotification.scheduled_for ? 'scheduled' : 'sent'
      };

      setNotifications(prev => [notification, ...prev]);
      setShowCreateForm(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        scheduled_for: ''
      });
      
      toast.success(language === 'en' ? 'Notification created successfully' : 'Notification créée avec succès');
    } catch (error) {
      toast.error(language === 'en' ? 'Error creating notification' : 'Erreur lors de la création');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!confirm(language === 'en' ? 'Delete this notification?' : 'Supprimer cette notification ?')) {
      return;
    }

    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success(language === 'en' ? 'Notification deleted' : 'Notification supprimée');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTargetText = (target: string) => {
    if (language === 'en') {
      return target === 'all' ? 'All Users' : 'Clients Only';
    } else {
      return target === 'all' ? 'Tous les utilisateurs' : 'Clients uniquement';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'en' 
      ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Notification Management' : 'Gestion des Notifications'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Send and manage notifications to users' : 'Envoyez et gérez les notifications aux utilisateurs'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-6 py-3 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300 flex items-center shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {language === 'en' ? 'Create Notification' : 'Créer une Notification'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-blue">{notifications.length}</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Sent' : 'Total Envoyées'}</div>
            </div>
            <Bell className="h-8 w-8 text-geocasa-blue" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.status === 'sent').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Delivered' : 'Livrées'}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {notifications.filter(n => n.status === 'scheduled').length}
              </div>
              <div className="text-gray-600">{language === 'en' ? 'Scheduled' : 'Programmées'}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-geocasa-orange">1247</div>
              <div className="text-gray-600">{language === 'en' ? 'Total Users' : 'Total Utilisateurs'}</div>
            </div>
            <Users className="h-8 w-8 text-geocasa-orange" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search notifications...' : 'Rechercher des notifications...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
          >
            <option value="all">{language === 'en' ? 'All Types' : 'Tous les Types'}</option>
            <option value="info">{language === 'en' ? 'Information' : 'Information'}</option>
            <option value="success">{language === 'en' ? 'Success' : 'Succès'}</option>
            <option value="warning">{language === 'en' ? 'Warning' : 'Avertissement'}</option>
            <option value="error">{language === 'en' ? 'Error' : 'Erreur'}</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredNotifications.length} {language === 'en' ? 'notifications found' : 'notifications trouvées'}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            {language === 'en' ? 'Recent Notifications' : 'Notifications Récentes'}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {getTargetText(notification.target)}
                          </span>
                          <span className="flex items-center">
                            <Send className="h-4 w-4 mr-1" />
                            {notification.sent_count} {language === 'en' ? 'recipients' : 'destinataires'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(notification.created_at)}
                          </span>
                          {notification.scheduled_for && (
                            <span className="flex items-center text-yellow-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {language === 'en' ? 'Scheduled' : 'Programmée'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-geocasa-blue rounded-lg hover:bg-gray-100 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'en' ? 'No notifications found' : 'Aucune notification trouvée'}
              </h3>
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                  : 'Essayez d\'ajuster votre recherche ou votre filtre pour trouver ce que vous cherchez.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {language === 'en' ? 'Create Notification' : 'Créer une Notification'}
                </h3>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Title' : 'Titre'}
                </label>
                <input
                  type="text"
                  required
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  placeholder={language === 'en' ? 'Notification title' : 'Titre de la notification'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Message' : 'Message'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  placeholder={language === 'en' ? 'Notification message' : 'Message de la notification'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Type' : 'Type'}
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  >
                    <option value="info">{language === 'en' ? 'Information' : 'Information'}</option>
                    <option value="success">{language === 'en' ? 'Success' : 'Succès'}</option>
                    <option value="warning">{language === 'en' ? 'Warning' : 'Avertissement'}</option>
                    <option value="error">{language === 'en' ? 'Error' : 'Erreur'}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Target Audience' : 'Public Cible'}
                  </label>
                  <select
                    value={newNotification.target}
                    onChange={(e) => setNewNotification({...newNotification, target: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                  >
                    <option value="all">{language === 'en' ? 'All Users' : 'Tous les utilisateurs'}</option>
                    <option value="clients">{language === 'en' ? 'Clients Only' : 'Clients uniquement'}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Schedule (optional)' : 'Planification (optionnelle)'}
                </label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduled_for}
                  onChange={(e) => setNewNotification({...newNotification, scheduled_for: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-geocasa-blue focus:border-transparent outline-none"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
                >
                  {language === 'en' ? 'Create Notification' : 'Créer la Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationManagement;