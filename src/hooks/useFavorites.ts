import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  const fetchFavorites = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      if (!supabase) throw new Error('Supabase not configured');
      const { data, error } = await supabase
        .from('user_favorites')
        .select('property_id')
        .eq('user_id', userProfile.id);

      if (error) throw error;

      setFavorites(data?.map(f => f.property_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!userProfile) return;

    const isFavorite = favorites.includes(propertyId);

    try {
      if (!supabase) throw new Error('Supabase not configured');
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userProfile.id,
            property_id: propertyId
          });

        if (error) throw error;

        setFavorites(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getFavoriteProperties = async () => {
    if (!userProfile) return [];

    try {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          property_id,
          properties (
            *,
            property_images (*)
          )
        `)
        .eq('user_id', userProfile.id);

      if (error) throw error;

      return data?.map(f => f.properties).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
      return [];
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchFavorites();
    }
  }, [userProfile]);

  return {
    favorites,
    loading,
    toggleFavorite,
    getFavoriteProperties,
    isFavorite: (propertyId: string) => favorites.includes(propertyId)
  };
};