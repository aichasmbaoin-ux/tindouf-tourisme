import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsDirectorateAdmin: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_ADMIN_EMAIL = 'aichasmbaoin@gmail.com';
const DIRECTORATE_ADMIN_EMAIL = 'dta.tindouf@mta.gov.dz';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('tindouf_admin_session') === 'active';
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        if (user.email === MASTER_ADMIN_EMAIL || user.email === DIRECTORATE_ADMIN_EMAIL) {
          setIsAdmin(true);
          localStorage.setItem('tindouf_admin_session', 'active');
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists()) {
              setIsAdmin(true);
              localStorage.setItem('tindouf_admin_session', 'active');
            } else {
              setIsAdmin(localStorage.getItem('tindouf_admin_session') === 'active');
            }
          } catch (e) {
            console.warn('Error checking admin doc in Firestore:', e);
            setIsAdmin(localStorage.getItem('tindouf_admin_session') === 'active');
          }
        }
      } else {
        const localAdmin = localStorage.getItem('tindouf_admin_session') === 'active';
        setIsAdmin(localAdmin);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email === MASTER_ADMIN_EMAIL || result.user.email === DIRECTORATE_ADMIN_EMAIL) {
        setIsAdmin(true);
        localStorage.setItem('tindouf_admin_session', 'active');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const loginAsDirectorateAdmin = async (pass: string): Promise<boolean> => {
    // Verified Directorate Administrator access password
    if (pass === 'Tindouf37Tourisme' || pass === 'admin37' || pass === 'dta2026') {
      setIsAdmin(true);
      localStorage.setItem('tindouf_admin_session', 'active');
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setIsAdmin(false);
    localStorage.removeItem('tindouf_admin_session');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginWithGoogle,
        loginAsDirectorateAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
