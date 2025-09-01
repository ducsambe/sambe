import React from 'react';
import { Heart, MapPin, Eye, MessageCircle, Home, Ruler, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PropertyCardProps {
  property: any;
  onViewDetails: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  viewMode?: 'grid' | 'list';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onViewDetails, 
  onToggleFavorite, 
  isFavorite,
  viewMode = 'grid'
}) => {
  const { language } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible':
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'vendu':
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'réservé':
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'terrain':
        return 'bg-green-100 text-green-800';
      case 'maison':
        return 'bg-blue-100 text-blue-800';
      case 'appartement':
        return 'bg-purple-100 text-purple-800';
      case 'lot':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      terrain: language === 'en' ? 'Land' : 'Terrain',
      maison: language === 'en' ? 'House' : 'Maison',
      appartement: language === 'en' ? 'Apartment' : 'Appartement',
      lot: language === 'en' ? 'Lot' : 'Lot',
      studio: language === 'en' ? 'Studio' : 'Studio',
      chambre: language === 'en' ? 'Room' : 'Chambre',
      commercial: language === 'en' ? 'Commercial' : 'Commercial'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      disponible: language === 'en' ? 'Available' : 'Disponible',
      available: language === 'en' ? 'Available' : 'Disponible',
      vendu: language === 'en' ? 'Sold' : 'Vendu',
      sold: language === 'en' ? 'Sold' : 'Vendu',
      réservé: language === 'en' ? 'Reserved' : 'Réservé',
      reserved: language === 'en' ? 'Reserved' : 'Réservé'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const handleWhatsApp = () => {
    const message = language === 'en' 
      ? `Hello, I'm interested in the property: ${property.title} - ${formatPrice(property.price || 0)}`
      : `Bonjour, je suis intéressé(e) par le bien: ${property.title} - ${formatPrice(property.price || 0)}`;
    const whatsappUrl = `https://wa.me/237670123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const propertyImage = property.property_images?.[0]?.image_url || 
    property.images?.[0] || 
    'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=400';

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
            <img 
              src={propertyImage || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(property.status || 'available')}`}>
                {getStatusLabel(property.status || 'available')}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(property.type || 'maison')}`}>
                {getTypeLabel(property.type || 'maison')}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors">
                {property.title}
              </h3>
              <div className="text-3xl font-bold text-green-600">
                {formatPrice(property.price || 0)}
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-sm">{property.location}</span>
              {property.area_sqm && (
                <>
                  <span className="mx-2">•</span>
                  <Ruler className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.area_sqm} m²</span>
                </>
              )}
            </div>

            <p className="text-gray-700 text-sm mb-6 line-clamp-3">
              {property.description}
            </p>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {property.features.slice(0, 4).map((feature: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                  >
                    {feature}
                  </span>
                ))}
                {property.features.length > 4 && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                    +{property.features.length - 4} {language === 'en' ? 'more' : 'autres'}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(property.id)}
                className="flex-1 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                <Eye className="h-4 w-4 mr-2" />
                {language === 'en' ? 'View Details' : 'Voir Détails'}
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={propertyImage || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(property.status || 'available')}`}>
            {getStatusLabel(property.status || 'available')}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(property.type || 'maison')}`}>
            {getTypeLabel(property.type || 'maison')}
          </span>
        </div>
        
        <button
          onClick={() => onToggleFavorite(property.id)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
            {property.title}
          </h3>
          <div className="text-2xl font-bold text-green-600 ml-4">
            {formatPrice(property.price || 0)}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-2 text-green-500" />
          <span className="text-sm">{property.location}</span>
          {(property.area_sqm || property.area) && (
            <>
              <span className="mx-2">•</span>
              <Ruler className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.area_sqm || property.area} m²</span>
            </>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {property.features.slice(0, 3).map((feature: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
              >
                {feature}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg">
                +{property.features.length - 3} {language === 'en' ? 'others' : 'autres'}
              </span>
            )}
          </div>
        )}

        {/* Date */}
        {property.created_at && (
          <div className="flex items-center text-gray-500 text-xs mb-4">
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              {language === 'en' ? 'Listed' : 'Publié'} {new Date(property.created_at).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(property.id)}
            className="flex-1 bg-gradient-to-r from-green-600 to-red-600 hover:from-green-700 hover:to-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <Eye className="h-4 w-4 mr-2" />
            {language === 'en' ? 'View Details' : 'Voir Détails'}
          </button>
          <button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

