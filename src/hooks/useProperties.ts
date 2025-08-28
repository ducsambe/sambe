import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Temporary type until Supabase is configured
type Property = any;

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!supabase) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          plots (*),
          reviews (*)
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
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (*),
          plots (*),
          reviews (
            *,
            users (full_name)
          )
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
      if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
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