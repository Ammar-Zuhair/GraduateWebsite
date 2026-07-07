import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (authUser) => {
    if (!authUser) {
      setUser(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    // Check if admin by email
    const isAdmin = authUser.email === 'admin@university.edu' || authUser.user_metadata?.role === 'admin';
    const role = isAdmin ? 'admin' : 'student';
    
    setUserRole(role);

    if (!isAdmin) {
      // Fetch student name from DB
      const { data: studentData } = await supabase
        .from('students')
        .select('name_ar, name_en')
        .eq('user_id', authUser.id)
        .single();
      
      setUser({
        ...authUser,
        role,
        name: studentData?.name_ar || studentData?.name_en || authUser.email
      });
    } else {
      setUser({ ...authUser, role, name: 'Admin' });
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    
    const isAdmin = data.user?.email === 'admin@university.edu' || data.user?.user_metadata?.role === 'admin';
    const role = isAdmin ? 'admin' : 'student';
    return { success: true, role };
  };

  const registerStudent = async (email, password, studentData) => {
    const role = studentData.role || 'student';
    // 1. Sign up user with metadata options
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    });
    
    if (error) return { success: false, error: error.message };

    // 2. Insert into students table using the new user ID (only for students)
    if (data.user && role !== 'admin') {
      const { error: dbError } = await supabase.from('students').insert([
        {
          user_id: data.user.id,
          name_ar: studentData.name_ar || studentData.name || email,
          name_en: studentData.name_en || studentData.name || email,
          major: studentData.major || studentData.dept || 'it',
          bio_ar: studentData.bio_ar || studentData.bio || '',
          bio_en: studentData.bio_en || studentData.bio || '',
          profile_image: studentData.profile_image || studentData.image || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(studentData.name_en || email),
          cover_image: ''
        }
      ]);
      
      if (dbError) return { success: false, error: dbError.message };
    }

    return { success: true, role };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, registerStudent, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
