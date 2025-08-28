import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your-project-id') || 
          supabaseKey.includes('your-anon-key')) {
        
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
          email,
          password,
          full_name: userData?.full_name || null,
          phone_number: userData?.phone_number || null,
          address: null,
          city: null,
          country: 'Cameroun',
          avatar_url: null,
          role: 'client' as const,
          is_verified: true,
          two_fa_enabled: false,
          notifications_enabled: true,
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
        email,
        password,
        full_name: userData?.full_name || null,
        phone_number: userData?.phone_number || null,
        address: null,
        city: null,
        country: 'Cameroun',
        avatar_url: null,
        role: 'client' as const,
        is_verified: true, // Auto-verify since no email confirmation
        two_fa_enabled: false,
        notifications_enabled: true
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
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl.includes('your-project-id') || 
          supabaseKey.includes('your-anon-key')) {
        
        // Mock authentication for development
        console.log('Using mock authentication - Supabase not configured');
        
        // Mock user data for demo
        const mockUsers = [
          {
            id: 'mock-user-1',
            email: 'user@geocasa.com',
            password: 'user123',
            full_name: 'Demo User',
            phone_number: '+237670123456',
            role: 'client',
            is_verified: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            address: null,
            city: 'Douala',
            country: 'Cameroun',
            avatar_url: null,
            two_fa_enabled: false,
            notifications_enabled: true
          }
        ];
        
        // Find user by email or phone
        const mockUser = mockUsers.find(u => 
          u.email === email || u.phone_number === email
        );
        
        if (!mockUser || mockUser.password !== password) {
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
        .or(`email.eq.${email},phone_number.eq.${email}`)
        .single();

      if (error || !data) {
        console.error('Login error:', error);
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Check password (plain text comparison as requested)
      if (data.password !== password) {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }

      // Store user session
      localStorage.setItem('geocasa_user', JSON.stringify(data));
      setUser({ id: data.id, email: data.email });
      setUserProfile(data);

      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de la connexion' 
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