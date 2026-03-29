import React, { useEffect, useState, createContext, useContext } from 'react';
import { supabase, User } from './supabase';
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{
    error?: string;
  }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({}),
  logout: () => {},
  refreshUser: async () => {}
});
export function AuthProvider({
  children


}: {children: ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('wf_user_id');
    if (stored) {
      supabase.from('users').select('*').eq('id', stored).single().then(({
        data
      }) => {
        if (data) setUser(data as User);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (username: string, password: string) => {
    const {
      data,
      error
    } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
    if (error || !data) return {
      error: 'Invalid username or password'
    };
    setUser(data as User);
    localStorage.setItem('wf_user_id', data.id);
    return {};
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('wf_user_id');
  };
  const refreshUser = async () => {
    if (!user) return;
    const {
      data
    } = await supabase.from('users').select('*').eq('id', user.id).single();
    if (data) setUser(data as User);
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout,
    refreshUser
  }}>
      {children}
    </AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);