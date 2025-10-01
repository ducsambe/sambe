import React, { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Eye, MessageCircle, MapPin, Ruler, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyModal from './PropertyModal';
import { useProperties } from '../hooks/useProperties';

interface FavoritesPageProps {
  onClose: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onClose }) => {
  const { user, userProfile } = useAuth();
  const { favorites, toggleFavorite, loading } = useFavorites();
  const { properties } = useProperties();
  const { language } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Get favorite properties from the properties list
  const favoriteProperties = properties.filter(property => 
    favorites.includes(property.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsApp = (property: any) => {
    const message = language === 'en' 
      ? `Hello, I'm interested in the property: ${property.title} - ${formatPrice(property.price || 0)}`
      : `Bonjour, je suis intéressé(e) par le bien: ${property.title} - ${formatPrice(property.price || 0)}`;
    const whatsappUrl = `https://wa.me/237670123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Access Restricted' : 'Accès Restreint'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Please log in to view your favorites.' 
              : 'Veuillez vous connecter pour voir vos favoris.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center text-white hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Back to Home' : 'Retour à l\'Accueil'}
            </button>
            <h1 className="text-3xl font-bold text-white text-center flex-1">
              {language === 'en' ? 'My Favorites' : 'Mes Favoris'}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {favoriteProperties.length} {language === 'en' ? 'Favorite Properties' : 'Biens Favoris'}
                </h2>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Properties you\'ve saved for later'
                    : 'Biens que vous avez sauvegardés'
                  }
                </p>
              </div>
            </div>
            {favoriteProperties.length > 0 && (
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {language === 'en' ? 'Total Value' : 'Valeur Totale'}
                </div>
                <div className="text-2xl font-bold text-geocasa-blue">
                  {formatPrice(favoriteProperties.reduce((sum, p) => sum + (p.price || 0), 0))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Favorites Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-geocasa-blue"></div>
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No Favorites Yet' : 'Aucun Favori Pour le Moment'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? 'Start exploring properties and add them to your favorites!'
                : 'Commencez à explorer les biens et ajoutez-les à vos favoris !'
              }
            </p>
            <button 
              onClick={onClose}
              className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange text-white px-8 py-3 rounded-lg hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark transition-all duration-300"
            >
              {language === 'en' ? 'Browse Properties' : 'Parcourir les Biens'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map(property => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img 
                    src={property.images?.[0] || 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <button 
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
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
                    {property.area_sqm && (
                      <>
                        <span className="mx-2">•</span>
                        <Ruler className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.area_sqm} m²</span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-bold text-geocasa-blue">{formatPrice(property.price || 0)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedProperty(property)}
                      className="flex-1 bg-geocasa-blue text-white px-3 py-2 rounded text-sm hover:bg-geocasa-blue-dark transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'View' : 'Voir'}
                    </button>
                    <button 
                      onClick={() => handleWhatsApp(property)}
                      className="bg-geocasa-orange text-white px-3 py-2 rounded text-sm hover:bg-geocasa-orange-dark transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Contact' : 'Contacter'}
                    </button>
                    <button 
                      onClick={() => toggleFavorite(property.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                      title={language === 'en' ? 'Remove from favorites' : 'Retirer des favoris'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={favorites.includes(selectedProperty.id)}
        />
      )}
    </div>
  );
};

export default FavoritesPage;