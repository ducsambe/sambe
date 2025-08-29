import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, mockUsers } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('geocasa_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({ id: userData.id, email: userData.email });
        setUserProfile(userData);
      } catch (error) {
        localStorage.removeItem('geocasa_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        
        // Mock user creation for development
        console.log('Using mock user creation - Supabase not configured');
        
        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const userExists = existingUsers.find((u: any) => u.email === email);
        
        if (userExists) {
          return { success: false, error: 'Un compte avec cet email existe déjà' };
        }
        
        // Create new mock user
        const newUser = {
          id: `mock-user-${Date.now()}`,
          username: email.split('@')[0],
          email,
          password_hash: password,
          first_name: userData?.full_name?.split(' ')[0] || null,
          last_name: userData?.full_name?.split(' ').slice(1).join(' ') || null,
          phone: userData?.phone_number || null,
          address: null,
          profile_image_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage
        existingUsers.push(newUser);
        localStorage.setItem('geocasa_mock_users', JSON.stringify(existingUsers));
        localStorage.setItem('geocasa_user', JSON.stringify(newUser));
        
        setUser({ id: newUser.id, email: newUser.email });
        setUserProfile(newUser);
        
        return { success: true, data: newUser };
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { success: false, error: 'Un compte avec cet email existe déjà' };
      }

      // Create new user
      const newUser = {
        username: email.split('@')[0],
        email,
        password_hash: password,
        first_name: userData?.full_name?.split(' ')[0] || null,
        last_name: userData?.full_name?.split(' ').slice(1).join(' ') || null,
        phone: userData?.phone_number || null,
        address: null,
        profile_image_url: null,
        is_active: true
      };

      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select('*')
        .single();

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }

      // Store user session
      localStorage.setItem('geocasa_user', JSON.stringify(data));
      setUser({ id: data.id, email: data.email });
      setUserProfile(data);

      return { success: true, data };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!isSupabaseConfigured()) {
        
        // Mock authentication for development
        console.log('Using mock authentication - Supabase not configured');
        
        // Get stored mock users or use defaults
        const storedUsers = JSON.parse(localStorage.getItem('geocasa_mock_users') || '[]');
        const allMockUsers = [...mockUsers, ...storedUsers];
        
        // Find user by email or phone
        const mockUser = allMockUsers.find(u => 
          u.email === email || u.phone === email
        );
        
        if (!mockUser || mockUser.password_hash !== password) {
          return { success: false, error: 'Email ou mot de passe incorrect' };
        }
        
        // Store user session
        localStorage.setItem('geocasa_user', JSON.stringify(mockUser));
        setUser({ id: mockUser.id, email: mockUser.email });
        setUserProfile(mockUser);
        
        return { success: true, data: mockUser };
      }

      // Find user by email or phone
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${email},phone.eq.${email}`)
        .maybeSingle();

      if (error || !data) {
        console.error('Login error:', error);
        return { success: false, error: 'Email ou numéro de téléphone ou mot de passe incorrect' };
      }

      // Check password (plain text comparison as requested)
      if (data.password_hash !== password) {
        return { success: false, error: 'Email ou numéro de téléphone ou mot de passe incorrect' };
      }

      // Store user session
      localStorage.setItem('geocasa_user', JSON.stringify(data));
      setUser({ id: data.id, email: data.email });
      setUserProfile(data);

      return { success: true, data };
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as Error).message 
        : 'Erreur lors de la connexion';
      console.error('Login error:', errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('geocasa_user');
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!userProfile) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      if (!supabase) throw new Error('Supabase not configured');

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userProfile.id)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update stored session
      localStorage.setItem('geocasa_user', JSON.stringify(data));
      setUserProfile(data);

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour' 
      };
    }
  };

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};