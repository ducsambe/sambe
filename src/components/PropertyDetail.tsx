import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Home, Ruler, MessageCircle, Calculator, Share2, Heart, Eye, Play, Clock, ShoppingCart } from 'lucide-react';
import { Property } from '../types';
import GoogleMapLots from './maps/GoogleMapLots';
import PaymentModal from './payment/PaymentModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PropertyDetailProps {
  property: Property;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ 
  property, 
  onClose, 
  onToggleFavorite, 
  isFavorite 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);
  const [loanAmount, setLoanAmount] = useState(property.price * 0.8);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const { user } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return monthlyPayment;
  };

  const handleReservation = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver');
      return;
    }
    
    // Start 48h reservation timer
    setReservationTimer(48 * 60 * 60); // 48 hours in seconds
    toast.success('Bien réservé pour 48h!');
  };

  const handlePurchase = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour acheter');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleLotSelect = (lot: any) => {
    setSelectedLot(lot);
  };

  const handleWhatsApp = () => {
    const lotInfo = selectedLot ? ` (Lot ${selectedLot.lot_number})` : '';
    const price = selectedLot ? selectedLot.price : property.price;
    const message = `Bonjour, je suis intéressé(e) par le bien: ${property.title}${lotInfo} - ${formatPrice(price)}. Pouvez-vous me donner plus d'informations ?`;
    const whatsappUrl = `https://wa.me/${property.agent.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
            {/* Images */}
            <div>
              {/* Video Section */}
              {property.video && (
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
                        src={property.video}
                        className="w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Vidéo de présentation"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="relative h-96 rounded-xl overflow-hidden mb-4">
                <img 
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {property.images.length > 1 && (
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
                  {property.images.map((_, index) => (
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
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-emerald-500 shadow-lg' 
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

              {/* Google Maps for Lots */}
              {property.type === 'lot' && property.lots && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-3">Carte des lots disponibles</h4>
                  <GoogleMapLots 
                    property={property}
                    onLotSelect={handleLotSelect}
                    selectedLot={selectedLot}
                  />
                  {selectedLot && (
                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                      <h5 className="font-semibold text-emerald-800">Lot sélectionné: {selectedLot.lot_number}</h5>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Surface:</span>
                          <span className="font-medium ml-2">{selectedLot.area} m²</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Prix:</span>
                          <span className="font-medium ml-2 text-emerald-600">{formatPrice(selectedLot.price)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div>
              {/* Reservation Timer */}
              {reservationTimer && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center text-yellow-800">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-semibold">Réservé pour vous</span>
                  </div>
                  <div className="text-sm text-yellow-700 mt-1">
                    Temps restant: {Math.floor(reservationTimer / 3600)}h {Math.floor((reservationTimer % 3600) / 60)}min
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="text-3xl font-bold text-emerald-600 mb-4">
                  {formatPrice(selectedLot ? selectedLot.price : property.price)}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Home className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-semibold capitalize">{property.type}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Ruler className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm text-gray-600">Surface</div>
                    <div className="font-semibold">{selectedLot ? selectedLot.area : property.area} m²</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-sm text-gray-600">Statut</div>
                    <div className="font-semibold capitalize">{property.status}</div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Caractéristiques</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 bg-emerald-50 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3" />
                        <span className="text-sm text-emerald-800">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-xl mb-6">
                  <h3 className="font-semibold mb-2">Votre conseiller</h3>
                  <div className="text-gray-700">
                    <div className="font-medium">{property.agent.name}</div>
                    <div className="text-sm">{property.agent.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Section */}
          {showCalculator && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Simulateur de prêt</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant du prêt (€)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux d'intérêt (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (années)
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Mensualité estimée</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatPrice(calculateMonthlyPayment())}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            {property.status === 'disponible' && !reservationTimer && (
              <button
                onClick={handleReservation}
                className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                Réserver 48h
              </button>
            )}
            
            {(property.status === 'disponible' || reservationTimer) && (
              <button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Acheter maintenant
              </button>
            )}
            
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contacter par WhatsApp
            </button>
            
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <Calculator className="h-5 w-5 mr-2" />
              {showCalculator ? 'Masquer' : 'Simuler'}
            </button>
            
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg ${
                isFavorite
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Heart className={`h-5 w-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Retiré' : 'Favoris'}
            </button>
            
            <button
              onClick={handleShare}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Partager
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        property={property}
        lot={selectedLot}
        onPaymentSuccess={() => {
          setShowPaymentModal(false);
          setReservationTimer(null);
          toast.success('Achat finalisé avec succès!');
        }}
      />
    </div>
  );
};

export default PropertyDetail;