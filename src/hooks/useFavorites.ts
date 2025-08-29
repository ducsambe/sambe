import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  const fetchFavorites = async () => {
    if (!userProfile) return;

    if (!isSupabaseConfigured()) {
      // Mock favorites for development
      const mockFavorites = JSON.parse(localStorage.getItem('geocasa_mock_favorites') || '[]');
      const userFavorites = mockFavorites.filter((f: any) => f.user_id === userProfile.id);
      setFavorites(userFavorites.map((f: any) => f.property_id));
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
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

    if (!isSupabaseConfigured()) {
      // Mock favorites management
      const mockFavorites = JSON.parse(localStorage.getItem('geocasa_mock_favorites') || '[]');
      
      if (isFavorite) {
        const updated = mockFavorites.filter((f: any) => 
          !(f.user_id === userProfile.id && f.property_id === propertyId)
        );
        localStorage.setItem('geocasa_mock_favorites', JSON.stringify(updated));
        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        const newFavorite = {
          id: `fav-${Date.now()}`,
          user_id: userProfile.id,
          property_id: propertyId,
          created_at: new Date().toISOString()
        };
        mockFavorites.push(newFavorite);
        localStorage.setItem('geocasa_mock_favorites', JSON.stringify(mockFavorites));
        setFavorites(prev => [...prev, propertyId]);
      }
      return;
    }
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userProfile.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
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

    if (!isSupabaseConfigured()) {
      // Mock favorite properties
      const mockFavorites = JSON.parse(localStorage.getItem('geocasa_mock_favorites') || '[]');
      const userFavorites = mockFavorites.filter((f: any) => f.user_id === userProfile.id);
      // Return mock properties that are favorited
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          property_id,
          properties (
            *
          )
        `)
        .eq('user_id', userProfile.id);

      if (error) throw error;

      return data?.map(f => ({
        ...f.properties,
        property_images: f.properties?.images?.map(url => ({ image_url: url })) || []
      })).filter(Boolean) || [];
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