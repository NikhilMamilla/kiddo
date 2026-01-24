import React, { useState, useEffect, useRef } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import DashboardGrid from '../components/DashboardGrid';
import CalmCircle from '../components/CalmCircle';
import { EmergencyOverlay } from '../components/EmergencyOverlay';
import { HistoryModal } from '../components/HistoryModal';
import { analyzeMessage, triggerSOS } from '../services/analysisService';
import type { AnalysisResponse } from '../services/analysisService';
import type { PredictionHistoryItem } from '../types/history';
import { generateGroqResponse } from '../services/groqService';
import type { Message } from '../types/chat';
import type { TypingMetrics } from '../types/metrics';
import type { BDIResult } from '../types/bdi';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, AlertTriangle, Menu, History, Fingerprint, LogOut, LayoutDashboard, LogIn, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, limit, doc, getDoc } from 'firebase/firestore';

const Home: React.FC = () => {
    const hydrationRef = useRef(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // If brand new user with no history, set initial greeting
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I am KIDDOO, and I'm so glad you're here. My only goal is to support you and make sure you feel heard. How are you feeling in this moment?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
    const [reviewMode, setReviewMode] = useState(false);
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [showCalmCircle, setShowCalmCircle] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [sosData, setSosData] = useState<any>(null);
    const [mobileTab, setMobileTab] = useState<'chat' | 'dashboard'>('chat');
    const { currentUser, logout } = useAuth();
    // const navigate = useNavigate();
    const dashboardScrollRef = useRef<HTMLElement>(null);

    // Auto-scroll to top when switching to dashboard tab
    useEffect(() => {
        if (mobileTab === 'dashboard') {
            setTimeout(() => {
                if (dashboardScrollRef.current) {
                    dashboardScrollRef.current.scrollTop = 0;
                }
                window.scrollTo(0, 0);
            }, 100);
        }
    }, [mobileTab]);

    // HYDRATION: Fetch history on mount/re-login
    useEffect(() => {
        if (!currentUser) {
            setHistory([]);
            return;
        }



        const historyRef = collection(db, 'users', currentUser.uid, 'history');
        const historyQuery = query(historyRef, orderBy('timestamp', 'desc'), limit(50));

        const unsubscribe = onSnapshot(historyQuery, (snapshot) => {
            const historyData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as any)).reverse();

            // 1. Update History state for Analytics (always update this to keep charts live)
            setHistory(historyData.map(item => ({
                message: item.message,
                timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                classified_state: item.classified_state,
                intensity_score: item.intensity_score || 0,
                sentiment_label: item.sentiment_label,
                sos_triggered: item.sos_triggered
            })));

            // 2. Hydrate Chat Messages & Analysis ONLY ONCE (on initial mount)
            if (!hydrationRef.current && snapshot.metadata.fromCache === false) {
                const lastItem = historyData[historyData.length - 1];

                if (lastItem) {
                    // Only hydrate messages if the user hasn't sent anything yet
                    setMessages(prev => {
                        if (prev.length <= 1) { // Only if still on initial greeting
                            return [
                                {
                                    id: 'initial',
                                    role: 'assistant',
                                    content: `Welcome back! I am KIDDOO. I've been thinking about our last chat where we spoke about "${lastItem.message.slice(0, 30)}...". How have you been since then? I'm here to listen.`,
                                    timestamp: new Date(lastItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                            ];
                        }
                        return prev;
                    });

                    // Only hydrate analysis if not already set by a new message
                    setAnalysisResult(prev => {
                        if (prev === null) {
                            return {
                                classified_state: lastItem.classified_state,
                                intensity_score: lastItem.intensity_score || 0,
                                sentiment_analysis: { label: lastItem.sentiment_label, score: 0.5 },
                                autonomous_action: { sos_triggered: lastItem.sos_triggered, message: "" }
                            } as any;
                        }
                        return prev;
                    });
                }
                hydrationRef.current = true;
            }
        }, (error) => {
            console.error("Hydration failed:", error);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleSOS = async () => {
        try {
            // Get latest contacts
            let contacts = [];
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                contacts = userDoc.data()?.emergencyContacts || [];
            }

            const result = await triggerSOS(contacts);
            setSosData(result);
            setIsEmergencyActive(true);

            // Save SOS log if logged in
            if (currentUser) {
                try {
                    const sosRef = collection(db, 'users', currentUser.uid, 'sosLogs');
                    await addDoc(sosRef, {
                        timestamp: new Date().toISOString(),
                        type: 'Manual Trigger',
                        message: result.message || 'Manual SOS Triggered',
                        contacts_notified: result.contacts_notified || []
                    });
                } catch (dbError) {
                    console.error("Error saving SOS log to Firestore:", dbError);
                }
            }
        } catch (err: any) {
            console.error('SOS Trigger Failed:', err);
            setIsEmergencyActive(true);
        }
    };

    const handleSendMessage = async (content: string, metrics?: TypingMetrics, bdi?: BDIResult, assistantResponse?: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);


        try {
            // 1. Get AI Response Immediately (Fast)
            const groqText = await generateGroqResponse(content);

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: groqText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMsg]);

            // Auto-switch to Insights on mobile after 5 seconds
            setTimeout(() => {
                setMobileTab('dashboard');
            }, 5000);

            // 2. Run Analysis in Background (Does not block UI)
            // Fetch contacts for analysis payload
            let emergencyContacts = [];
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                emergencyContacts = userDoc.data()?.emergencyContacts || [];
            }

            analyzeMessage(content, reviewMode ? 'review' : 'user', history, emergencyContacts)
                .then(async (analysisResult) => {
                    if (!analysisResult) return; // Safety check

                    setAnalysisResult(analysisResult);

                    // Save to Firestore if logged in
                    if (currentUser) {
                        try {
                            const historyRef = collection(db, 'users', currentUser.uid, 'history');
                            await addDoc(historyRef, {
                                message: content,
                                response: groqText,
                                timestamp: new Date().toISOString(),
                                classified_state: analysisResult.classified_state,
                                sentiment_label: analysisResult.sentiment_analysis?.label || 'N/A'
                            });
                        } catch (dbError) {
                            console.error("Error saving interaction to Firestore:", dbError);
                        }
                    }

                    const historyItem: PredictionHistoryItem = {
                        message: content,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        classified_state: analysisResult.classified_state,
                        intensity_score: analysisResult.intensity_score || 0,
                        sentiment_label: analysisResult.sentiment_analysis?.label || 'N/A',
                        sos_triggered: analysisResult.autonomous_action.sos_triggered
                    };
                    setHistory(prev => [...prev, historyItem]);

                    if (analysisResult.autonomous_action.sos_triggered) {
                        setSosData(analysisResult.autonomous_action);
                        setIsEmergencyActive(true);

                        // Save SOS log if logged in
                        if (currentUser) {
                            try {
                                const sosRef = collection(db, 'users', currentUser.uid, 'sosLogs');
                                await addDoc(sosRef, {
                                    timestamp: new Date().toISOString(),
                                    type: 'Autonomous Trigger',
                                    message: analysisResult.autonomous_action.message,
                                    contacts_notified: ["Parent", "Emergency Services"] // Mock data
                                });
                            } catch (error) {
                                console.error("Error logging auto-SOS:", error);
                            }
                        }
                    }
                })
                .catch(err => console.error("Background analysis failed:", err));

            // Usage to avoid unused variable warnings
            if (metrics || bdi || assistantResponse) {
                console.log('Contextual data received:', { metrics, bdi, assistantResponse });
            }
        } catch (error) {
            console.error("Error in message handling:", error);
        }
    };


    return (
        <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-medium/30 selection:text-brand-dark">
            {/* TOP NAVIGATION BAR */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-medium px-6 py-4">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                            <Heart className="text-white fill-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-brand-dark leading-none tracking-tight">KIDDOO</h1>
                            <p className="text-[10px] uppercase font-bold text-brand-primary tracking-widest mt-0.5 font-sans">Autonomous Support Agent</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowHistory(true)}
                            className="hidden md:flex items-center gap-2 text-brand-medium hover:text-brand-primary transition-colors"
                        >
                            <History size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">History</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Desktop Controls */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${reviewMode
                                ? 'bg-brand-light border-brand-primary shadow-lg shadow-brand-primary/10'
                                : 'bg-white border-brand-light hover:border-brand-medium'
                                }`}>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-medium">Review Mode</span>
                                    {reviewMode && (
                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-primary animate-pulse">● ACTIVE</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setReviewMode(!reviewMode)}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 relative ${reviewMode ? 'bg-brand-primary shadow-lg shadow-brand-primary/30' : 'bg-brand-medium/30'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${reviewMode ? 'right-0.5' : 'left-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            <button
                                onClick={handleSOS}
                                className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 active:scale-95 animate-pulse"
                            >
                                <AlertTriangle size={16} />
                                <span>Emergency SOS</span>
                            </button>

                            <div className="h-8 w-px bg-brand-medium/20 mx-1"></div>

                            {currentUser ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 text-brand-medium hover:text-brand-primary transition-colors px-3 py-2 rounded-lg hover:bg-brand-light"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span className="hidden xl:inline text-xs font-bold uppercase tracking-widest">Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center gap-2 text-brand-medium hover:text-brand-dark transition-colors px-3 py-2 rounded-lg hover:bg-brand-light"
                                    >
                                        <LogOut size={18} />
                                        <span className="hidden xl:inline text-xs font-bold uppercase tracking-widest">Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 bg-brand-primary text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                                >
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white z-[51] shadow-2xl p-6 flex flex-col lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-xl text-brand-dark">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-brand-medium hover:bg-brand-light rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-medium">Controls</h3>
                                    <div className="flex items-center justify-between bg-brand-light/30 p-4 rounded-xl">
                                        <span className="font-bold text-brand-dark text-sm">Review Mode</span>
                                        <button
                                            onClick={() => setReviewMode(!reviewMode)}
                                            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${reviewMode ? 'bg-brand-primary' : 'bg-brand-medium/30'}`}
                                        >
                                            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${reviewMode ? 'right-0.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            handleSOS();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full bg-red-600 text-white border border-red-600 px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                                    >
                                        <AlertTriangle size={18} />
                                        <span>Emergency SOS</span>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-medium mb-2">Navigation</h3>
                                    {currentUser ? (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-brand-light text-brand-dark transition-colors font-bold"
                                            >
                                                <LayoutDashboard size={20} className="text-brand-primary" />
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-brand-light text-brand-dark transition-colors font-bold"
                                            >
                                                <LogOut size={20} className="text-brand-primary" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-brand-light text-brand-dark transition-colors font-bold"
                                        >
                                            <LogIn size={20} className="text-brand-primary" />
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="max-w-[1600px] mx-auto px-4 py-6 pb-24 lg:p-6 h-[calc(100vh-84px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-full">
                    {/* CHAT SECTION */}
                    <section className={`lg:col-span-5 xl:col-span-4 flex flex-col h-full bg-white rounded-3xl shadow-xl border border-brand-light overflow-hidden ${mobileTab === 'chat' ? 'block' : 'hidden lg:flex'}`}>
                        <div className="p-4 border-b border-brand-light bg-brand-light/20">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-medium">Live Session</h2>
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            <ChatInterface
                                messages={messages}
                                onSendMessage={handleSendMessage}
                            />
                        </div>
                    </section>

                    {/* ANALYTICS SECTION */}
                    <section
                        ref={dashboardScrollRef}
                        className={`lg:col-span-7 xl:col-span-8 h-full overflow-y-auto no-scrollbar pr-1 ${mobileTab === 'dashboard' ? 'block' : 'hidden lg:block'}`}
                    >
                        {reviewMode && (
                            <div className="mb-4 p-4 bg-brand-dark rounded-2xl shadow-lg text-white animate-fade-in border border-brand-primary/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-brand-primary rounded-full animate-pulse" />
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-widest text-brand-light">Reviewer Intelligence Mode Active</h3>
                                            <p className="text-xs text-brand-light/70 mt-0.5 font-bold">Advanced health analytics & decision logic visible below</p>
                                        </div>
                                    </div>
                                    <Fingerprint size={24} className="text-white/50" />
                                </div>
                            </div>
                        )}

                        <DashboardGrid
                            analysisResult={analysisResult}
                            history={history}
                            reviewMode={reviewMode}
                            onShowCalmCircle={() => setShowCalmCircle(true)}
                        />
                    </section>
                </div>
            </main>

            {/* MOBILE BOTTOM NAVIGATION */}
            <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-brand-light p-4 flex justify-around items-center z-50 pb-safe">
                <button
                    onClick={() => setMobileTab('chat')}
                    className={`flex flex-col items-center gap-1 ${mobileTab === 'chat' ? 'text-brand-primary' : 'text-brand-medium'}`}
                >
                    <div className={`p-2 rounded-full ${mobileTab === 'chat' ? 'bg-brand-light' : ''}`}>
                        <Menu size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Chat</span>
                </button>
                <button
                    onClick={() => setMobileTab('dashboard')}
                    className={`flex flex-col items-center gap-1 ${mobileTab === 'dashboard' ? 'text-brand-primary' : 'text-brand-medium'}`}
                >
                    <div className={`p-2 rounded-full ${mobileTab === 'dashboard' ? 'bg-brand-light' : ''}`}>
                        <Heart size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Insights</span>
                </button>
            </nav>

            {/* OVERLAYS */}
            {isEmergencyActive && (
                <EmergencyOverlay
                    sosData={sosData}
                    onDismiss={() => setIsEmergencyActive(false)}
                />
            )}

            <HistoryModal
                isOpen={showHistory}
                history={history}
                onClose={() => setShowHistory(false)}
            />

            {showCalmCircle && (
                <CalmCircle onClose={() => setShowCalmCircle(false)} />
            )}
        </div>
    );
};

export default Home;
