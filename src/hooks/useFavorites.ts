import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  // Initialize favorites when user profile is available
  useEffect(() => {
    if (userProfile) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [userProfile]);

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
    
    // Optimistic update - update UI immediately
    if (isFavorite) {
      setFavorites(prev => prev.filter(id => id !== propertyId));
      toast.success('Retiré des favoris');
    } else {
      setFavorites(prev => [...prev, propertyId]);
      toast.success('Ajouté aux favoris');
    }

    if (!isSupabaseConfigured()) {
      // Mock favorites management
      const mockFavorites = JSON.parse(localStorage.getItem('geocasa_mock_favorites') || '[]');
      
      if (isFavorite) {
        const updated = mockFavorites.filter((f: any) => 
          !(f.user_id === userProfile.id && f.property_id === propertyId)
        );
        localStorage.setItem('geocasa_mock_favorites', JSON.stringify(updated));
      } else {
        const newFavorite = {
          id: `fav-${Date.now()}`,
          user_id: userProfile.id,
          property_id: propertyId,
          created_at: new Date().toISOString()
        };
        mockFavorites.push(newFavorite);
        localStorage.setItem('geocasa_mock_favorites', JSON.stringify(mockFavorites));
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
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userProfile.id,
            property_id: propertyId
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert optimistic update on error
      if (isFavorite) {
        setFavorites(prev => [...prev, propertyId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
      toast.error('Erreur lors de la mise à jour des favoris');
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
        images: f.properties?.images || []
      })).filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
      return [];
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    getFavoriteProperties,
    isFavorite: (propertyId: string) => favorites.includes(propertyId)
  };
};