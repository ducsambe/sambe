import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Home, Ruler, MessageCircle, Heart, Play } from 'lucide-react';
import { Database } from '../lib/database.types';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
  onToggleFavorite: (propertyId: string) => void;
  isFavorite: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ 
  property, 
  onClose, 
  onToggleFavorite, 
  isFavorite 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const { user } = useAuth();
  const { language } = useLanguage();

  const images = property.images || 
                 ['https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleWhatsApp = () => {
    const message = language === 'en'
      ? `Hello, I'm interested in the property: ${property.title} - ${formatPrice(property.price)} located in ${property.location}. Can you provide more information?`
      : `Bonjour, je suis intéressé(e) par le bien: ${property.title} - ${formatPrice(property.price)} situé à ${property.location}. Pouvez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/237670123456?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFavoriteClick = () => {
    if (!user) {
      toast.error(language === 'en' ? 'Please login to add favorites' : 'Veuillez vous connecter pour ajouter aux favoris');
      return;
    }
    onToggleFavorite(property.id);
  };
  if (images.length === 0) {
    images.push('https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800');
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{property.location}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images and Video */}
            <div>
              {/* Video Section */}
              {property.presentation_video_url && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {showVideo ? 'Masquer la vidéo' : 'Voir la vidéo de présentation'}
                  </button>
                  {showVideo && (
                    <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src={property.presentation_video_url}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Vidéo de présentation"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Image Carousel */}
              <div className="relative h-80 rounded-xl overflow-hidden mb-4">
                <img 
                  src={images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div>
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(property.price)}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold capitalize">{property.type || 'N/A'}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Ruler className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm text-gray-600">Surface</div>
                    <div className="font-semibold">{property.area_sqm || 'N/A'} m²</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 mx-auto mb-2 rounded-full ${
                      property.status === 'disponible' ? 'bg-green-500' :
                      property.status === 'réservé' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div className="text-sm text-gray-600">Statut</div>
                    <div className="font-semibold capitalize">{property.status || 'N/A'}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
                  {property.features && property.features.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                        <span className="text-sm text-green-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <p className="text-gray-500">Aucune caractéristique spécifiée</p>
                  )}
                </div>

                {/* Agent Info */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-6">
                  <h3 className="font-semibold mb-2">Votre conseiller</h3>
                  <div className="text-gray-700">
                    <div className="font-medium">Jean-Claude MBALLA</div>
                    <div className="text-sm">+237 670 123 456</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={handleFavoriteClick}
                    className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg ${
                      isFavorite
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite 
                      ? (language === 'en' ? 'Remove' : 'Retirer')
                      : (language === 'en' ? 'Add to Favorites' : 'Ajouter aux Favoris')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;