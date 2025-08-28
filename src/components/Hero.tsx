import React, { useState } from 'react';
import { Search, MapPin, Home, Building, TreePine, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const propertyTypes = [
    { 
      id: 'all', 
      label: language === 'en' ? 'All Properties' : 'Tous les Biens',
      icon: Home 
    },
    { 
      id: 'terrain', 
      label: language === 'en' ? 'Land' : 'Terrains',
      icon: TreePine 
    },
    { 
      id: 'maison', 
      label: language === 'en' ? 'Houses' : 'Maisons',
      icon: Home 
    },
    { 
      id: 'appartement', 
      label: language === 'en' ? 'Apartments' : 'Appartements',
      icon: Building 
    }
  ];

  const stats = [
    {
      number: '500+',
      label: language === 'en' ? 'Properties Available' : 'Biens Disponibles'
    },
    {
      number: '15+',
      label: language === 'en' ? 'Years Experience' : 'Années d\'Expérience'
    },
    {
      number: '1000+',
      label: language === 'en' ? 'Happy Clients' : 'Clients Satisfaits'
    },
    {
      number: '50+',
      label: language === 'en' ? 'Locations' : 'Localisations'
    }
  ];

  return (
    <div className="relative bg-gradient-to-br from-green-50 via-white to-red-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23059669' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-red-100 rounded-full text-sm font-medium text-gray-700 mb-6">
              <MapPin className="h-4 w-4 mr-2 text-green-600" />
              {language === 'en' ? 'Real Estate in Cameroon' : 'Immobilier au Cameroun'}
            </div>

            {/* Main Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {language === 'en' ? (
                <>
                  Find Your <span className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange bg-clip-text text-transparent">Dream Property</span> in Cameroon
                </>
              ) : (
                <>
                  Trouvez Votre <span className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange bg-clip-text text-transparent">Propriété de Rêve</span> au Cameroun
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {language === 'en' 
                ? 'Discover premium real estate opportunities in Douala, Yaoundé, and across Cameroon. From luxury homes to investment properties.'
                : 'Découvrez des opportunités immobilières premium à Douala, Yaoundé et partout au Cameroun. Des maisons de luxe aux propriétés d\'investissement.'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="bg-gradient-to-r from-geocasa-blue to-geocasa-orange hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                {language === 'en' ? 'Browse Properties' : 'Parcourir les Biens'}
              </button>
              <button className="border-2 border-gray-300 hover:border-geocasa-blue text-gray-700 hover:text-geocasa-blue px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                {language === 'en' ? 'Contact Us' : 'Nous Contacter'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-geocasa-blue mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Search */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {language === 'en' ? 'Find Your Property' : 'Trouvez Votre Bien'}
              </h3>

              {/* Property Type Selector */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedType === type.id
                          ? 'border-geocasa-blue bg-blue-50 text-geocasa-blue'
                          : 'border-gray-200 hover:border-geocasa-blue-light text-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? 'Search by location (Douala, Yaoundé...)' : 'Rechercher par localisation (Douala, Yaoundé...)'}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-700"
                />
              </div>

              {/* Search Button */}
              <button className="w-full bg-gradient-to-r from-geocasa-blue to-geocasa-orange hover:from-geocasa-blue-dark hover:to-geocasa-orange-dark text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                {language === 'en' ? 'Search Properties' : 'Rechercher des Biens'}
              </button>

              {/* Popular Locations */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'en' ? 'Popular locations:' : 'Localisations populaires:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Douala', 'Yaoundé', 'Bafoussam', 'Bamenda'].map((location) => (
                    <button
                      key={location}
                      className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-geocasa-blue rounded-full text-sm transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;