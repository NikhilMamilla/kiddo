import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, db, googleProvider } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signup: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password).then(() => { });
    };

    const signInWithGoogle = async () => {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Sync to Firestore in the background
        const syncToFirestore = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || '',
                    lastLogin: new Date().toISOString(),
                }, { merge: true });
            } catch (error) {
                console.error("AuthContext: Background sync failed", error);
            }
        };
        syncToFirestore();
    };

    const signup = async (email: string, password: string, name?: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 1. Immediately update the profile in Firebase Auth if a name is provided
        // We do this first so the currentUser object has the name when we redirect
        if (name) {
            try {
                await updateProfile(user, { displayName: name });
                // Force a state update with the name so Dashboards see it immediately
                setCurrentUser({ ...user, displayName: name } as any);
            } catch (error) {
                console.error("AuthContext: Failed to update displayName", error);
            }
        }

        // 2. Sync to Firestore in the background
        const syncToFirestore = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                await setDoc(docRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: name || '',
                    createdAt: new Date().toISOString(),
                }, { merge: true });
            } catch (error) {
                console.error("AuthContext: Background sync failed", error);
            }
        };

        // Fire and forget Firestore sync
        syncToFirestore();

        return;
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        loading,
        login,
        signInWithGoogle,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
                    <div className="relative flex flex-col items-center">
                        {/* Premium Breathing Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-24 h-24 bg-brand-primary/5 rounded-[2.5rem] flex items-center justify-center relative mb-8"
                        >
                            <div className="absolute inset-0 bg-brand-primary opacity-10 rounded-[2.5rem] blur-2xl animate-pulse"></div>
                            <Heart className="w-10 h-10 text-brand-primary fill-brand-primary" />
                        </motion.div>

                        <div className="flex flex-col items-center">
                            <h2 className="text-xl font-black text-brand-dark tracking-tighter mb-1">KIDDOO</h2>
                            <p className="text-brand-medium text-[8px] font-bold uppercase tracking-[0.5em] opacity-40 ml-1">Secure Environment</p>
                        </div>

                        {/* Minimalist Progress Line */}
                        <div className="w-32 h-[1px] bg-brand-light mt-8 relative overflow-hidden">
                            <motion.div
                                animate={{ x: [-128, 128] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"
                            />
                        </div>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
