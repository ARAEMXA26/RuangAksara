"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext({
  user: null as any,
  login: async (email?: string, password?: string): Promise<any> => {},
  register: async (name?: string, email?: string, password?: string, role?: string): Promise<any> => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth not initialized. Falling back to localStorage.");
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
        setLoading(true);
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
            // Fallback for admin or un-synced user
            const isAdmin = firebaseUser.email === "budi@university.ac.id" || firebaseUser.email === "budi.pustakawan@university.ac.id";
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || (isAdmin ? "Budi Pustakawan" : "User"),
              role: isAdmin ? "pustakawan" : "mahasiswa",
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          const isAdmin = firebaseUser.email === "budi@university.ac.id" || firebaseUser.email === "budi.pustakawan@university.ac.id";
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || (isAdmin ? "Budi Pustakawan" : "User"),
            role: isAdmin ? "pustakawan" : "mahasiswa",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email?: string, password?: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    if (!email || !password) throw new Error("Email and password required");
    
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name?: string, email?: string, password?: string, role?: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    if (!email || !password || !name) throw new Error("Missing required fields");

    setLoading(true);
    try {
      // 1. Create in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      try {
        // Update Firebase Profile Name
        await updateProfile(firebaseUser, { displayName: name });

        // 2. Save to Database via API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name,
            role: role || "mahasiswa",
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Database registration failed");
        }
        
        return firebaseUser;
      } catch (error) {
        // 3. Rollback System: If database fails, delete the Firebase user to prevent orphan data
        console.error("Registration failed during DB sync, rolling back Firebase User...", error);
        try {
          await firebaseUser.delete();
        } catch (deleteError) {
          console.error("Critical Error: Failed to rollback Firebase User", deleteError);
        }
        throw error; // Rethrow to show in UI
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
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
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
