import React, { useState } from 'react';
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
import { Heart, AlertTriangle, Menu, History, Fingerprint, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Home: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello. I'm here to listen and support you. Type a message and I will analyze your health state.",
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
    const navigate = useNavigate();

    const handleSOS = async () => {
        try {
            const result = await triggerSOS();
            setSosData(result);
            setIsEmergencyActive(true);

            // Save SOS log if logged in
            if (currentUser) {
                try {
                    const sosRef = collection(db, 'users', currentUser.uid, 'sosLogs');
                    await addDoc(sosRef, {
                        timestamp: new Date().toISOString(),
                        type: 'Manual Trigger',
                        message: result.message || 'Manual SOS Triggered'
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
            const [analysisResult, groqText] = await Promise.all([
                analyzeMessage(content, reviewMode ? 'review' : 'user', history),
                generateGroqResponse(content)
            ]);

            setAnalysisResult(analysisResult);

            // Usage to avoid unused variable warnings
            if (metrics || bdi || assistantResponse) {
                console.log('Contextual data received:', { metrics, bdi, assistantResponse });
            }

            const assistantMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: groqText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, assistantMsg]);

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
                            message: analysisResult.autonomous_action.message || 'Autonomous SOS Triggered',
                            analysisResult: analysisResult.classified_state
                        });
                    } catch (dbError) {
                        console.error("Error saving SOS log to Firestore:", dbError);
                    }
                }
            }
        } catch (err) {
            console.error('Analysis failed:', err);
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
                            <h1 className="text-lg font-bold text-brand-dark leading-none tracking-tight">Supportive Space</h1>
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
                            className="bg-brand-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 border border-brand-dark hover:bg-brand-primary transition-all shadow-sm active:scale-95"
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
            </header>

            <main className="max-w-[1600px] mx-auto p-6 h-[calc(100vh-84px)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
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
                    <section className={`lg:col-span-7 xl:col-span-8 h-full overflow-y-auto no-scrollbar pr-1 ${mobileTab === 'dashboard' ? 'block' : 'hidden lg:block'}`}>
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
