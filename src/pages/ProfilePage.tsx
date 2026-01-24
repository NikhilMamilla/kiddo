import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import {
    Camera,
    User,
    Phone,
    Save,
    Trash2,
    Plus,
    AlertTriangle,
    Loader2,
    Activity,
    LogOut,
    ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
}

interface UserProfile {
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    emergencyContacts: EmergencyContact[];
}

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        displayName: '',
        email: '',
        phoneNumber: '',
        photoURL: '',
        emergencyContacts: []
    });

    const [newContact, setNewContact] = useState<EmergencyContact>({ name: '', phone: '', relation: '' });
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!currentUser) return;
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile({ ...docSnap.data() as UserProfile, email: currentUser.email || '' });
                } else {
                    // Init basic data if doc missing
                    setProfile(prev => ({ ...prev, displayName: currentUser.displayName || '', email: currentUser.email || '' }));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !currentUser) return;
        const file = e.target.files[0];
        setSaving(true);

        try {
            const storageRef = ref(storage, `avatars/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await updateDoc(doc(db, 'users', currentUser.uid), {
                photoURL: downloadURL
            });
            setProfile(prev => ({ ...prev, photoURL: downloadURL }));
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Failed to upload image.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!currentUser) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                displayName: profile.displayName,
                phoneNumber: profile.phoneNumber
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const addContact = async () => {
        if (!currentUser || !newContact.name || !newContact.phone) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                emergencyContacts: arrayUnion(newContact)
            });
            setProfile(prev => ({
                ...prev,
                emergencyContacts: [...prev.emergencyContacts, newContact]
            }));
            setNewContact({ name: '', phone: '', relation: '' });
            setShowContactForm(false);
        } catch (error) {
            console.error("Error adding contact:", error);
            alert("Failed to add contact.");
        } finally {
            setSaving(false);
        }
    };

    const removeContact = async (contact: EmergencyContact) => {
        if (!currentUser) return;
        if (!window.confirm(`Remove ${contact.name} from emergency contacts?`)) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                emergencyContacts: arrayRemove(contact)
            });
            setProfile(prev => ({
                ...prev,
                emergencyContacts: prev.emergencyContacts.filter(c => c.phone !== contact.phone)
            }));
        } catch (error) {
            console.error("Error removing contact:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-medium/30 pb-20">
            {/* Header */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-light sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 hover:bg-brand-light rounded-full transition-colors text-brand-medium hover:text-brand-dark">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <Link to="/dashboard" className="flex items-center">
                        <Activity className="w-8 h-8 text-brand-primary mr-3" />
                        <span className="font-bold text-xl text-brand-dark">KIDDOO Profile</span>
                    </Link>
                </div>
                <button onClick={logout} className="p-2 text-brand-medium hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                    <LogOut className="w-6 h-6" />
                </button>
            </header>

            <main className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
                {/* 1. Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-8 border border-brand-light shadow-xl shadow-brand-medium/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="relative group cursor-pointer mb-6" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-brand-light">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-brand-light flex items-center justify-center text-brand-medium">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                            <Camera className="text-white w-8 h-8" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <h1 className="text-2xl font-black text-brand-dark mb-1">{profile.displayName || "Update Your Name"}</h1>
                    <p className="text-brand-medium font-bold text-sm tracking-wide">{profile.email}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 2. Personal Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-brand-light shadow-xl shadow-brand-medium/5"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-brand-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-brand-dark">Personal Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-brand-medium uppercase tracking-wider mb-2">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-medium/50" />
                                    <input
                                        type="text"
                                        value={profile.displayName}
                                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-brand-light/30 border border-brand-light rounded-xl font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-medium uppercase tracking-wider mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-medium/50" />
                                    <input
                                        type="tel"
                                        value={profile.phoneNumber}
                                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-brand-light/30 border border-brand-light rounded-xl font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <p className="text-[10px] text-brand-medium mt-2 ml-1">* Used for account verification only.</p>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* 3. Emergency Contacts */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[2.5rem] p-8 border border-brand-light shadow-xl shadow-brand-medium/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-brand-dark">Emergency SOS</h2>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 relative z-10">
                            <p className="text-xs text-red-800 font-medium leading-relaxed">
                                Contacts listed below will receive an <span className="font-bold">Immediate SMS Alert</span> containing your location when you trigger an SOS.
                            </p>
                        </div>

                        <div className="space-y-4 mb-6 relative z-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {profile.emergencyContacts?.map((contact, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-brand-light/20 border border-brand-light rounded-2xl group hover:border-brand-medium/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-brand-dark">{contact.name}</p>
                                            <p className="text-xs text-brand-medium font-mono">{contact.phone}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeContact(contact)}
                                        className="p-2 text-brand-medium hover:bg-red-50 hover:text-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {(!profile.emergencyContacts || profile.emergencyContacts.length === 0) && (
                                <div className="text-center py-8 text-brand-medium text-sm font-medium border-2 border-dashed border-brand-light rounded-2xl">
                                    No emergency contacts added yet.
                                </div>
                            )}
                        </div>

                        {showContactForm ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-brand-light/30 rounded-2xl p-4 border border-brand-light space-y-3"
                            >
                                <input
                                    type="text"
                                    placeholder="Contact Name"
                                    value={newContact.name}
                                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-brand-light text-sm font-bold focus:outline-none focus:border-brand-primary"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone (e.g. +1...)"
                                    value={newContact.phone}
                                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-brand-light text-sm font-bold focus:outline-none focus:border-brand-primary"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowContactForm(false)}
                                        className="flex-1 py-3 text-brand-medium text-xs font-bold hover:bg-brand-light rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={addContact}
                                        disabled={!newContact.name || !newContact.phone}
                                        className="flex-1 py-3 bg-brand-dark text-white text-xs font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                                    >
                                        Add Contact
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <button
                                onClick={() => setShowContactForm(true)}
                                className="w-full py-4 border-2 border-dashed border-brand-medium/30 text-brand-medium rounded-xl font-bold flex items-center justify-center gap-2 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Emergency Contact</span>
                            </button>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
