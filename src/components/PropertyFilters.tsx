import React from 'react';
import { Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';

interface PropertyFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onToggle
}) => {
  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      type: '',
      minPrice: 0,
      maxPrice: 0,
      location: '',
      status: ''
    });
  };

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-emerald-700 transition-colors"
      >
        <Filter className="h-4 w-4" />
        Filtres
        {isOpen && <X className="h-4 w-4" />}
      </button>

      {/* Filters Container */}
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 ${
        isOpen ? 'block' : 'hidden md:block'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filtres de recherche</h3>
            <button
              onClick={resetFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                placeholder="Mots-clés..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bien
              </label>
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Tous les types</option>
                <option value="terrain">Terrain</option>
                <option value="maison">Maison</option>
                <option value="lot">Lot</option>
              </select>
            </div>

            {/* Prix minimum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix minimum
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Prix maximum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix maximum
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value) || 0)}
                placeholder="1000000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                placeholder="Ville ou région"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tri par
              </label>
              <select
                value={filters.sortBy || 'date_desc'}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              >
                <option value="date_desc">Plus récent</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="area_asc">Surface croissante</option>
                <option value="area_desc">Surface décroissante</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;