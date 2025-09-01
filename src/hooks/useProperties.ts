import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, mockProperties } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Property = Database['public']['Tables']['properties']['Row'];

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data when Supabase is not configured
      console.log('Using mock properties - Supabase not configured');
      
      // Get stored mock properties from localStorage
      const storedMockProperties = JSON.parse(localStorage.getItem('geocasa_mock_properties') || '[]');
      const allMockProperties = [...mockProperties, ...storedMockProperties];
      
      // Transform mock data to match expected format
      const transformedProperties = allMockProperties.map(property => ({
        ...property,
        // Ensure images is always an array
        images: Array.isArray(property.images) ? property.images : []
      }));
      
      setProperties(transformedProperties);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProperties(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const getPropertyById = async (id: string) => {
    try {
      if (!isSupabaseConfigured()) {
        const storedMockProperties = JSON.parse(localStorage.getItem('geocasa_mock_properties') || '[]');
        const allMockProperties = [...mockProperties, ...storedMockProperties];
        // REMOVED THE DUPLICATE DECLARATION HERE
        const property = allMockProperties.find(p => p.id === id);
        if (!property) throw new Error('Propriété non trouvée');
        return {
          ...property,
          images: Array.isArray(property.images) ? property.images : []
        };
      }
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Propriété non trouvée');
    }
  };

  const getPropertiesByType = (type: string) => {
    if (type === 'all') return properties;
    return properties.filter(property => property.type === type);
  };

  const searchProperties = (query: string) => {
    if (!query.trim()) return properties;
    
    const searchTerm = query.toLowerCase();
    return properties.filter(property => 
      property.title.toLowerCase().includes(searchTerm) ||
      property.location?.toLowerCase().includes(searchTerm) ||
      property.description?.toLowerCase().includes(searchTerm)
    );
  };

  const filterProperties = (filters: {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    status?: string;
  }) => {
    return properties.filter(property => {
      if (filters.type && filters.type !== 'all' && 
          property.type !== filters.type) {
        return false;
      }
      if (filters.minPrice && property.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false;
      }
      if (filters.location && property.location !== filters.location) {
        return false;
      }
      if (filters.status && property.status !== filters.status) {
        return false;
      }
      return true;
    });
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    getPropertyById,
    getPropertiesByType,
    searchProperties,
    filterProperties
  };
};