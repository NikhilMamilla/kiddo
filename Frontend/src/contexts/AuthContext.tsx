import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
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
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-4 text-brand-medium text-xs font-black uppercase tracking-[0.2em] animate-pulse">Initializing Security...</p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
