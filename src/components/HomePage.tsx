import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, ChevronLeft, ChevronRight, Play, Star, Users, Award, TrendingUp, Home, Building, TreePine, Phone, Mail, MessageCircle } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyModal from './PropertyModal';
import Hero from './Hero';

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { properties, loading } = useProperties();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { language } = useLanguage();
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    type: ''
  });

  // Create featured images from properties
  const featuredImages = properties.slice(0, 4).map(property => ({
    id: property.id,
    image: property.property_images?.[0]?.image_url || 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1200',
    location: property.location || (language === 'en' ? 'Location not specified' : 'Localisation non spécifiée'),
    propertyId: property.id
  }));

  // Create featured videos from properties with videos
  const featuredVideos = properties
    .filter(p => p.presentation_video_url)
    .slice(0, 4)
    .map(property => ({
      id: property.id,
      thumbnail: property.property_images?.[0]?.image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      location: property.location || (language === 'en' ? 'Location not specified' : 'Localisation non spécifiée'),
      propertyId: property.id
    }));

  // Auto-scroll for featured images
  useEffect(() => {
    if (featuredImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === featuredImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === featuredImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? featuredImages.length - 1 : prev - 1
    );
  };

  const handleImageClick = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
    }
  };

  const handleVideoClick = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const propertyTypes = [
    {
      id: 'terrain',
      title: language === 'en' ? 'Land' : 'Terrains',
      description: language === 'en' ? 'Prime land for development' : 'Terrains de choix pour développement',
      icon: TreePine,
      count: '150+',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'maison',
      title: language === 'en' ? 'Houses' : 'Maisons',
      description: language === 'en' ? 'Beautiful family homes' : 'Belles maisons familiales',
      icon: Home,
      count: '200+',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'appartement',
      title: language === 'en' ? 'Apartments' : 'Appartements',
      description: language === 'en' ? 'Modern urban living' : 'Vie urbaine moderne',
      icon: Building,
      count: '100+',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'lot',
      title: language === 'en' ? 'Lots' : 'Lots',
      description: language === 'en' ? 'Investment opportunities' : 'Opportunités d\'investissement',
      icon: TrendingUp,
      count: '50+',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Kouam',
      location: 'Douala',
      text: language === 'en' 
        ? 'GEOCASA helped me find my dream home in Douala. Professional service and great properties!'
        : 'GEOCASA m\'a aidé à trouver la maison de mes rêves à Douala. Service professionnel et excellentes propriétés !',
      rating: 5,
      image: '/placeholder.svg?height=60&width=60&text=MK'
    },
    {
      name: 'Jean Baptiste',
      location: 'Yaoundé',
      text: language === 'en'
        ? 'Excellent investment opportunities. I bought 3 properties through GEOCASA and very satisfied.'
        : 'Excellentes opportunités d\'investissement. J\'ai acheté 3 propriétés via GEOCASA et très satisfait.',
      rating: 5,
      image: '/placeholder.svg?height=60&width=60&text=JB'
    },
    {
      name: 'Fatima Ngozi',
      location: 'Bafoussam',
      text: language === 'en'
        ? 'The team is very professional and helped me throughout the entire process. Highly recommended!'
        : 'L\'équipe est très professionnelle et m\'a aidé tout au long du processus. Hautement recommandé !',
      rating: 5,
      image: '/placeholder.svg?height=60&width=60&text=FN'
    }
  ];

  const features = [
    {
      icon: Award,
      title: language === 'en' ? 'Certified Properties' : 'Propriétés Certifiées',
      description: language === 'en' 
        ? 'All properties are legally verified and certified'
        : 'Toutes les propriétés sont légalement vérifiées et certifiées'
    },
    {
      icon: Users,
      title: language === 'en' ? 'Expert Team' : 'Équipe d\'Experts',
      description: language === 'en'
        ? 'Professional real estate agents with local expertise'
        : 'Agents immobiliers professionnels avec expertise locale'
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Investment Guidance' : 'Conseils d\'Investissement',
      description: language === 'en'
        ? 'Strategic advice for profitable real estate investments'
        : 'Conseils stratégiques pour des investissements immobiliers rentables'
    },
    {
      icon: Phone,
      title: language === 'en' ? '24/7 Support' : 'Support 24/7',
      description: language === 'en'
        ? 'Round-the-clock customer support and assistance'
        : 'Support client et assistance 24h/24'
    }
  ];

  const locations = [
    {
      name: 'Douala',
      properties: '250+',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: language === 'en' ? 'Economic capital with prime locations' : 'Capitale économique avec emplacements de choix'
    },
    {
      name: 'Yaoundé',
      properties: '180+',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: language === 'en' ? 'Political capital with modern developments' : 'Capitale politique avec développements modernes'
    },
    {
      name: 'Bafoussam',
      properties: '120+',
      image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: language === 'en' ? 'Growing city with investment potential' : 'Ville en croissance avec potentiel d\'investissement'
    },
    {
      name: 'Bamenda',
      properties: '80+',
      image: 'https://images.pexels.com/photos/1396127/pexels-photo-1396127.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: language === 'en' ? 'Beautiful landscapes and affordable properties' : 'Beaux paysages et propriétés abordables'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Featured Properties' : 'Propriétés en Vedette'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Discover our handpicked selection of premium properties across Cameroon'
                : 'Découvrez notre sélection de propriétés premium à travers le Cameroun'
              }
            </p>
          </div>
          
          {featuredImages.length > 0 && (
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              >
                {featuredImages.map((item, index) => (
                  <div
                    key={item.id}
                    className="min-w-full h-full relative cursor-pointer"
                    onClick={() => handleImageClick(item.propertyId)}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.location}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="flex items-center text-gray-800">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-semibold">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Navigation Buttons */}
              {featuredImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full transition-all shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Dots Indicator */}
              {featuredImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {featuredImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Property Types' : 'Types de Propriétés'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'Find the perfect property type for your needs'
                : 'Trouvez le type de propriété parfait pour vos besoins'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-geocasa-blue">{type.count}</span>
                    <span className="text-sm text-gray-500">
                      {language === 'en' ? 'Available' : 'Disponibles'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Prime Locations' : 'Emplacements de Choix'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'Explore properties in Cameroon\'s most desirable locations'
                : 'Explorez les propriétés dans les emplacements les plus prisés du Cameroun'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {locations.map((location) => (
              <div
                key={location.name}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={location.image || "/placeholder.svg"}
                    alt={location.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{location.name}</h3>
                  <p className="text-green-200 text-sm mb-2">{location.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">{location.properties}</span>
                    <span className="text-green-200 text-sm">
                      {language === 'en' ? 'Properties' : 'Propriétés'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-geocasa-blue to-geocasa-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {language === 'en' ? 'Why Choose GEOCASA?' : 'Pourquoi Choisir GEOCASA ?'}
            </h2>
            <p className="text-xl text-blue-100">
              {language === 'en' 
                ? 'Your trusted partner in Cameroon real estate'
                : 'Votre partenaire de confiance dans l\'immobilier camerounais'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-green-100">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'What Our Clients Say' : 'Ce Que Disent Nos Clients'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'en' 
                ? 'Real stories from satisfied customers'
                : 'Témoignages réels de clients satisfaits'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Virtual Tours' : 'Visites Virtuelles'}
              </h2>
              <p className="text-xl text-gray-600">
                {language === 'en' 
                  ? 'Take a virtual tour of our premium properties'
                  : 'Faites une visite virtuelle de nos propriétés premium'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                  onClick={() => handleVideoClick(video.propertyId)}
                >
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.location}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-green-600 ml-1" />
                    </div>
                  </div>
                  
                  {/* Location Label */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                      <div className="flex items-center text-gray-800 text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-green-600" />
                        <span className="font-medium truncate">{video.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-geocasa-blue to-geocasa-orange">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">
                {language === 'en' ? 'Properties Available' : 'Biens Disponibles'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1200+</div>
              <div className="text-blue-100">
                {language === 'en' ? 'Happy Clients' : 'Clients Satisfaits'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-blue-100">
                {language === 'en' ? 'Years Experience' : 'Années d\'Expérience'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-green-100">
                {language === 'en' ? 'Cities Covered' : 'Villes Couvertes'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Ready to Find Your Dream Property?' : 'Prêt à Trouver Votre Propriété de Rêve ?'}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'en' 
              ? 'Contact our expert team today and let us help you find the perfect property in Cameroon'
              : 'Contactez notre équipe d\'experts aujourd\'hui et laissez-nous vous aider à trouver la propriété parfaite au Cameroun'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
              <Phone className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Call Us Now' : 'Appelez-Nous'}
            </button>
            <button className="bg-geocasa-orange hover:bg-geocasa-orange-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {language === 'en' ? 'WhatsApp' : 'WhatsApp'}
            </button>
            <button className="border-2 border-gray-300 hover:border-geocasa-blue text-gray-700 hover:text-geocasa-blue px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Email Us' : 'Nous Écrire'}
            </button>
          </div>
        </div>
      </section>

      {/* Property Modal */}
      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(selectedProperty.id)}
        />
      )}
    </div>
  );
};

export default HomePage;