import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Home, Building, TreePine, TrendingUp, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyCard from './PropertyCard';
import PropertyModal from './PropertyModal';

const CategoriesPage: React.FC = () => {
  const { properties, loading } = useProperties();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { language } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    location: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  });

  const propertyTypes = [
    { 
      id: 'all', 
      label: language === 'en' ? 'All Properties' : 'Tous les Biens',
      icon: Home,
      count: properties.length
    },
    { 
      id: 'terrain', 
      label: language === 'en' ? 'Land' : 'Terrains',
      icon: TreePine,
      count: properties.filter(p => p.property_type === 'terrain' || p.type === 'terrain').length
    },
    { 
      id: 'maison', 
      label: language === 'en' ? 'Houses' : 'Maisons',
      icon: Home,
      count: properties.filter(p => p.property_type === 'maison' || p.type === 'maison').length
    },
    { 
      id: 'appartement', 
      label: language === 'en' ? 'Apartments' : 'Appartements',
      icon: Building,
      count: properties.filter(p => p.property_type === 'appartement' || p.type === 'appartement').length
    },
    { 
      id: 'lot', 
      label: language === 'en' ? 'Lots' : 'Lots',
      icon: TrendingUp,
      count: properties.filter(p => p.property_type === 'lot' || p.type === 'lot').length
    }
  ];

  const locations = [
    { id: 'all', label: language === 'en' ? 'All Locations' : 'Toutes les Localisations' },
    { id: 'douala', label: 'Douala' },
    { id: 'yaounde', label: 'Yaoundé' },
    { id: 'bafoussam', label: 'Bafoussam' },
    { id: 'bamenda', label: 'Bamenda' },
    { id: 'garoua', label: 'Garoua' },
    { id: 'maroua', label: 'Maroua' }
  ];

  const priceRanges = [
    { id: 'all', label: language === 'en' ? 'All Prices' : 'Tous les Prix' },
    { id: '0-10000000', label: language === 'en' ? 'Under 10M XAF' : 'Moins de 10M FCFA' },
    { id: '10000000-25000000', label: '10M - 25M FCFA' },
    { id: '25000000-50000000', label: '25M - 50M FCFA' },
    { id: '50000000-100000000', label: '50M - 100M FCFA' },
    { id: '100000000+', label: language === 'en' ? 'Over 100M XAF' : 'Plus de 100M FCFA' }
  ];

  const sortOptions = [
    { id: 'newest', label: language === 'en' ? 'Newest First' : 'Plus Récents' },
    { id: 'oldest', label: language === 'en' ? 'Oldest First' : 'Plus Anciens' },
    { id: 'price-low', label: language === 'en' ? 'Price: Low to High' : 'Prix: Croissant' },
    { id: 'price-high', label: language === 'en' ? 'Price: High to Low' : 'Prix: Décroissant' },
    { id: 'area-large', label: language === 'en' ? 'Area: Large to Small' : 'Surface: Décroissante' },
    { id: 'area-small', label: language === 'en' ? 'Area: Small to Large' : 'Surface: Croissante' }
  ];

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location?.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(property => 
        property.property_type === filters.type || property.type === filters.type
      );
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(property => 
        property.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(property => {
        const price = property.price || 0;
        if (max) {
          return price >= parseInt(min) && price <= parseInt(max);
        } else {
          return price >= parseInt(min);
        }
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'area-large':
        filtered.sort((a, b) => (b.area_sqm || 0) - (a.area_sqm || 0));
        break;
      case 'area-small':
        filtered.sort((a, b) => (a.area_sqm || 0) - (b.area_sqm || 0));
        break;
    }

    return filtered;
  }, [properties, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      location: 'all',
      priceRange: 'all',
      sortBy: 'newest'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-red-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {language === 'en' ? 'Browse Properties' : 'Parcourir les Biens'}
            </h1>
            <p className="text-xl text-green-100 mb-8">
              {language === 'en' 
                ? 'Find your perfect property from our extensive collection'
                : 'Trouvez votre propriété parfaite dans notre vaste collection'
              }
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder={language === 'en' ? 'Search properties...' : 'Rechercher des propriétés...'}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-lg shadow-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => handleFilterChange('type', type.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    filters.type === type.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{type.label}</span>
                  <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                    {type.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              {language === 'en' ? 'Filters' : 'Filtres'}
            </button>

            {/* Desktop Filters */}
            <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {language === 'en' ? 'Clear All' : 'Tout Effacer'}
              </button>
            </div>

            {/* View Mode and Results */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {filteredProperties.length} {language === 'en' ? 'properties found' : 'propriétés trouvées'}
              </span>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:text-green-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Home className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No properties found' : 'Aucune propriété trouvée'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Try adjusting your filters to see more results'
                : 'Essayez d\'ajuster vos filtres pour voir plus de résultats'
              }
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {language === 'en' ? 'Clear Filters' : 'Effacer les Filtres'}
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={(id) => {
                  const prop = properties.find(p => p.id === id);
                  if (prop) setSelectedProperty(prop);
                }}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(property.id)}
                viewMode={viewMode}
              />
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
          isFavorite={isFavorite(selectedProperty.id)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
