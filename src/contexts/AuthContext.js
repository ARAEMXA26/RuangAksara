"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase auth is not initialized (missing .env.local), skip observer
    if (!auth) {
      console.warn("Firebase Auth not initialized. Falling back to localStorage.");
      // Fallback to localStorage for development without Firebase
      const storedUser = localStorage.getItem("ruangaksara_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage", e);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await fetch(`/api/auth/me?uid=${firebaseUser.uid}`);
          if (res.ok) {
            const data = await res.json();
            setUser({
              ...data.user,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || "User",
              role: "mahasiswa",
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "User",
            role: "mahasiswa",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    // Save to localStorage as backup
    localStorage.setItem("ruangaksara_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      localStorage.removeItem("ruangaksara_user");
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
      localStorage.removeItem("ruangaksara_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
