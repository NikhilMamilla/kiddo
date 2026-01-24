import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    AlertTriangle,
    LogOut,
    MessageSquare,
    Clock,
    Shield,
    Activity,
    Download,
    FileText,
    LayoutGrid,
    Search,
    Bell,
    User,
    Plus,
    X,
    Menu
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface HistoryItem {
    id: string;
    message: string;
    response: string;
    timestamp: string;
}

interface SOSLog {
    id: string;
    timestamp: string;
    type: string;
}

const Dashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const cached = localStorage.getItem('kiddoo_history_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [sosLogs, setSosLogs] = useState<SOSLog[]>(() => {
        const cached = localStorage.getItem('kiddoo_sos_cache');
        return cached ? JSON.parse(cached) : [];
    });
    // const [historyLoading, setHistoryLoading] = useState(true);
    // const [sosLoading, setSosLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setImgError(false);
    }, [currentUser?.photoURL]);

    useEffect(() => {
        if (!currentUser) {
            return;
        }


        // Optimistic finish: If Firestore is slow, don't leave the user hanging on "..."
        // Optimistic finish: If Firestore is slow, don't leave the user hanging on "..."
        const loadingFallback = setTimeout(() => {
        }, 1000); // 1s is the new "instant" threshold

        const historyRef = collection(db, 'users', currentUser.uid, 'history');
        const historyQuery = query(historyRef, orderBy('timestamp', 'desc'), limit(50));

        const sosRef = collection(db, 'users', currentUser.uid, 'sosLogs');
        const sosQuery = query(sosRef, orderBy('timestamp', 'desc'), limit(50));

        const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
            const historyData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as HistoryItem));
            setHistory(historyData);
            localStorage.setItem('kiddoo_history_cache', JSON.stringify(historyData));

        }, (error) => {
            console.error("Error listening to history:", error);

        });

        const unsubSos = onSnapshot(sosQuery, (snapshot) => {
            const sosData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as SOSLog));
            setSosLogs(sosData);
            localStorage.setItem('kiddoo_sos_cache', JSON.stringify(sosData));

        }, (error) => {
            console.error("Error listening to SOS logs:", error);

        });

        return () => {
            clearTimeout(loadingFallback);
            unsubHistory();
            unsubSos();
        };
    }, [currentUser]);

    const filteredHistory = useMemo(() => {
        return history.filter(h =>
            h.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.response.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [history, searchQuery]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const getExportData = () => {
        const combinedData: any[] = [];

        history.forEach(h => {
            combinedData.push({
                Type: 'Interaction',
                Date: new Date(h.timestamp).toLocaleString(),
                Details: h.message,
                Result: h.response
            });
        });

        sosLogs.forEach(s => {
            combinedData.push({
                Type: 'SOS Alert',
                Date: new Date(s.timestamp).toLocaleString(),
                Details: s.type || 'Emergency Triggered',
                Result: 'ALARM ACTIVE'
            });
        });

        return combinedData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    };

    const handleExportCSV = () => {
        const data = getExportData();
        if (data.length === 0) return alert("No data available to export.");
        exportToCSV(data, `health_full_data_${new Date().toLocaleDateString()}`);
    };

    const handleExportPDF = () => {
        const data = getExportData();
        if (data.length === 0) return alert("No data available to export.");
        exportToPDF(data, 'Complete Health Activity Report', `health_report_full_${new Date().toLocaleDateString()}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-medium/30 selection:text-brand-dark">
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
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-3/4 max-w-sm h-full bg-white z-[51] shadow-2xl p-6 flex flex-col lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <Link to="/" className="flex items-center">
                                    <Activity className="w-8 h-8 text-brand-primary mr-3" />
                                    <span className="font-bold text-xl text-brand-dark">KIDDOO</span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-brand-medium hover:bg-brand-light rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="space-y-2 flex-grow">
                                <button
                                    onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                    <span>Overview</span>
                                </button>
                                <button
                                    onClick={() => { setActiveTab('history'); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                                >
                                    <History className="w-5 h-5" />
                                    <span>Usage History</span>
                                </button>
                                <button
                                    onClick={() => { setActiveTab('alerts'); setIsMobileMenuOpen(false); }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                                >
                                    <Bell className="w-5 h-5" />
                                    <span>SOS Alerts</span>
                                </button>
                            </nav>

                            <div className="mt-auto">
                                <div className="bg-brand-dark rounded-2xl p-5 text-white relative overflow-hidden group mb-4">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl group-hover:bg-brand-primary/30 transition-all"></div>
                                    <h4 className="text-sm text-brand-light font-bold mb-1 relative z-10 tracking-wide">LIVE SECURITY</h4>
                                    <p className="text-[10px] text-brand-light/70 relative z-10 mb-4 font-bold uppercase tracking-tighter">
                                        Status: <span className="text-brand-primary">{sosLogs.length > 0 ? "ALERT LOGGED" : "MONITORING"}</span>
                                    </p>
                                    <div className="w-full py-2 bg-white/10 text-brand-light rounded-lg text-[10px] font-black text-center border border-white/10 uppercase tracking-[0.2em]">
                                        v1.0.5 STABLE
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 text-brand-medium hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all font-semibold"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Log out</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-brand-medium hidden lg:flex flex-col z-50">
                <div className="p-6">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-brand-dark">KIDDOO</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span>Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                    >
                        <History className="w-5 h-5" />
                        <span>Usage History</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('alerts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'alerts' ? 'bg-brand-light text-brand-primary font-bold shadow-sm' : 'text-brand-medium hover:bg-brand-light hover:text-brand-primary'}`}
                    >
                        <Bell className="w-5 h-5" />
                        <span>SOS Alerts</span>
                    </button>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-brand-dark rounded-2xl p-5 text-white relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-primary/20 rounded-full blur-2xl group-hover:bg-brand-primary/30 transition-all"></div>
                        <h4 className="text-sm text-brand-light font-bold mb-1 relative z-10 tracking-wide">LIVE SECURITY</h4>
                        <p className="text-[10px] text-brand-light/70 relative z-10 mb-4 font-bold uppercase tracking-tighter">
                            Status: <span className="text-brand-primary">{sosLogs.length > 0 ? "ALERT LOGGED" : "MONITORING"}</span>
                        </p>
                        <div className="w-full py-2 bg-white/10 text-brand-light rounded-lg text-[10px] font-black text-center border border-white/10 uppercase tracking-[0.2em]">
                            v1.0.5 STABLE
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 mt-4 text-brand-medium hover:text-brand-primary hover:bg-brand-light rounded-xl transition-all font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-light sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="mr-4 p-2 -ml-2 text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link to="/" className="flex items-center">
                            <Activity className="w-8 h-8 text-brand-primary mr-3" />
                            <span className="font-bold text-lg text-brand-dark">KIDDOO</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center bg-brand-light rounded-xl px-3 py-2 w-96 border border-brand-medium/30">
                        <Search className="w-4 h-4 text-brand-medium mr-2" />
                        <input
                            type="text"
                            placeholder="Search your health interactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none text-sm focus:outline-none w-full text-brand-dark placeholder-brand-medium"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`p-2 rounded-lg transition-colors ${showNotifications ? 'bg-brand-light text-brand-primary' : 'text-brand-medium hover:text-brand-primary'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {sosLogs.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-dark rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="fixed top-20 left-4 right-4 md:absolute md:top-auto md:left-auto md:right-0 md:mt-2 md:w-80 bg-white rounded-2xl shadow-2xl border border-brand-medium overflow-hidden z-[100]"
                                    >
                                        <div className="p-4 border-b border-brand-light flex items-center justify-between bg-brand-light/50">
                                            <h4 className="font-bold text-brand-dark text-sm">Notifications</h4>
                                            <button onClick={() => setShowNotifications(false)}><X className="w-4 h-4 text-brand-medium" /></button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {sosLogs.length > 0 ? sosLogs.map(log => (
                                                <div key={log.id} className="p-4 hover:bg-brand-light transition-colors border-b border-brand-light">
                                                    <p className="text-xs font-bold text-brand-primary mb-1">Emergency Triggered</p>
                                                    <p className="text-[10px] text-brand-medium">{new Date(log.timestamp).toLocaleString()}</p>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-brand-medium text-sm">No new notifications</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link to="/profile" className="h-10 w-10 bg-brand-light rounded-full border border-brand-medium flex items-center justify-center text-brand-primary overflow-hidden font-bold text-lg hover:ring-2 hover:ring-brand-primary/20 transition-all">
                            {currentUser?.photoURL && !imgError ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span>
                                    {currentUser?.displayName
                                        ? currentUser.displayName.charAt(0).toUpperCase()
                                        : (currentUser?.email?.charAt(0).toUpperCase() || <User className="w-5 h-5" />)
                                    }
                                </span>
                            )}
                        </Link>
                    </div>
                </header>

                <main className="p-6 lg:p-10 max-w-7xl mx-auto">
                    {/* Welcome Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
                    >
                        <div>
                            <span className="text-brand-primary font-extrabold text-xs uppercase tracking-widest mb-2 block">System Online</span>
                            <h1 className="text-3xl font-black text-brand-dark leading-tight tracking-tight">
                                Hello, {currentUser?.displayName?.split(' ')[0] || 'User'}
                            </h1>
                            <p className="text-brand-medium mt-2 flex items-center font-medium">
                                <span className="w-2 h-2 bg-brand-primary rounded-full mr-2 shadow-glow shadow-brand-primary/50"></span>
                                Live Data Connection Established
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-brand-medium rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-light transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                            >
                                <Download className="w-4 h-4" />
                                <span>Export CSV</span>
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 active:scale-95 uppercase tracking-wider"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Get Report</span>
                            </button>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                {/* Stats Cluster */}
                                <motion.div variants={itemVariants} className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white p-6 rounded-[2rem] border border-brand-light shadow-xl shadow-brand-medium/10 relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-light rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                                        <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                                            <MessageSquare className="w-6 h-6 text-brand-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-brand-medium uppercase tracking-wider">Interactions</h3>
                                            <div className="text-4xl font-black text-brand-dark leading-none">
                                                {history.length}
                                            </div>
                                            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-tighter pt-2">Total Queries Answered</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-brand-light shadow-xl shadow-brand-medium/10 relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-light rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                                        <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                                            <AlertTriangle className="w-6 h-6 text-brand-dark" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-brand-medium uppercase tracking-wider">SOS Lifecycle</h3>
                                            <div className="text-4xl font-black text-brand-dark leading-none">
                                                {sosLogs.length}
                                            </div>
                                            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-tighter pt-2">Active Monitor</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-[2rem] border border-brand-light shadow-xl shadow-brand-medium/10 relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-light rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
                                        <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center mb-6">
                                            <Shield className="w-6 h-6 text-brand-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-brand-medium uppercase tracking-wider">System Check</h3>
                                            <div className="text-2xl font-black text-brand-primary leading-none py-1">
                                                SECURE
                                            </div>
                                            <p className="text-[10px] text-brand-medium font-bold uppercase tracking-tighter pt-2">End-to-End Encrypted</p>
                                        </div>
                                    </div>

                                    <Link to="/" className="bg-brand-primary p-6 rounded-[2rem] text-white shadow-2xl shadow-brand-primary/30 relative flex flex-col justify-center items-center text-center group active:scale-95 transition-transform overflow-hidden">
                                        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-lg text-brand-white/9 text-white uppercase mb-1 relative z-10">New Interaction</h3>
                                        <p className="text-brand-white/70 text-xs relative z-10">Consult with Agent</p>
                                    </Link>
                                </motion.div>

                                {/* Recent Activity Table */}
                                <motion.div variants={itemVariants} className="lg:col-span-8 bg-white rounded-[2.5rem] border border-brand-light shadow-2xl shadow-brand-medium/10 overflow-hidden">
                                    <div className="p-8 border-b border-brand-light flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-6 bg-brand-primary rounded-full"></div>
                                            <h2 className="text-xl font-black text-brand-dark">Recent Interactions</h2>
                                        </div>
                                        <button onClick={() => setActiveTab('history')} className="text-xs font-bold text-brand-primary hover:underline uppercase tracking-widest">VIEW ALL</button>
                                    </div>

                                    <div className="divide-y divide-brand-light">
                                        {filteredHistory.length > 0 ? filteredHistory.slice(0, 5).map((item) => (
                                            <div key={item.id} className="p-8 hover:bg-brand-light/30 transition-all group flex items-start gap-4">
                                                <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center shrink-0 text-brand-medium group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                    <MessageSquare className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm font-bold text-brand-dark truncate">Agent Consultation</p>
                                                        <div className="flex items-center text-[10px] font-bold text-brand-primary bg-brand-light px-2 py-1 rounded-md">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-brand-medium font-semibold mb-1 line-clamp-1 italic">"{item.message}"</p>
                                                    <p className="text-sm text-brand-dark font-medium line-clamp-2 leading-relaxed">{item.response}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="p-20 text-center">
                                                <History className="w-12 h-12 text-brand-light mx-auto mb-4" />
                                                <p className="text-brand-medium font-bold">It's quiet here.</p>
                                                <p className="text-brand-medium/50 text-xs font-bold mt-2">I'm ready to listen whenever you're ready to share.</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Side Cards */}
                                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
                                    <div className="bg-white rounded-[2.5rem] border border-brand-light shadow-2xl shadow-brand-medium/10 overflow-hidden">
                                        <div className="p-8 border-b border-brand-light flex items-center justify-between">
                                            <h2 className="text-xl font-black text-brand-dark">SOS Alerts</h2>
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-ping"></span>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {sosLogs.length > 0 ? sosLogs.slice(0, 3).map((log) => (
                                                <div key={log.id} className="p-4 bg-brand-light/50 rounded-2xl flex items-center justify-between border border-brand-medium/20">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-sm"><AlertTriangle className="w-5 h-5" /></div>
                                                        <div>
                                                            <p className="text-xs font-bold text-brand-dark uppercase tracking-tight">Emergency</p>
                                                            <p className="text-[10px] text-brand-primary font-bold">{new Date(log.timestamp).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-12 text-center text-brand-medium">
                                                    <Shield className="w-12 h-12 text-brand-light mx-auto mb-4" />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">Safety Status: Secure</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[2.5rem] border border-brand-light shadow-2xl shadow-brand-medium/10 p-8 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                                        <h3 className="text-lg font-black text-brand-dark mb-2 relative z-10">KIDDOO Agent Snapshot</h3>
                                        <p className="text-sm text-brand-medium mb-6 relative z-10 leading-relaxed font-bold">
                                            Your safety agent is active. {sosLogs.length > 0 ? "Emergency alerts have been detected recently. Please check the 'Alerts' tab for details." : "No emergency triggers detected in current session."}
                                        </p>
                                        <div className="flex items-center gap-2 relative z-10">
                                            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                            <span className="text-[10px] font-black uppercase text-brand-primary tracking-widest">Agent Monitoring Active</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 'history' && (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[2.5rem] border border-brand-light shadow-2xl shadow-brand-medium/10 p-8"
                            >
                                <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-3">
                                    <History className="w-8 h-8 text-brand-primary" />
                                    Full Interaction History
                                </h2>
                                <div className="space-y-4">
                                    {filteredHistory.map(item => (
                                        <div key={item.id} className="p-6 bg-brand-light/30 rounded-2xl border border-brand-light">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-bold bg-white text-brand-primary border border-brand-light px-2 py-1 rounded shadow-sm">
                                                    ID: {item.id.slice(0, 8)}
                                                </span>
                                                <span className="text-xs text-brand-medium font-bold">{new Date(item.timestamp).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm font-black text-brand-dark mb-2 underline decoration-brand-medium underline-offset-4 uppercase tracking-wider">Question:</p>
                                            <p className="text-sm text-brand-dark font-medium mb-4">{item.message}</p>
                                            <p className="text-sm font-black text-brand-primary mb-2 underline decoration-brand-medium underline-offset-4 uppercase tracking-wider">Agent Response:</p>
                                            <p className="text-sm text-brand-dark font-medium leading-relaxed">{item.response}</p>
                                        </div>
                                    ))}
                                    {filteredHistory.length === 0 && <p className="text-center py-20 text-brand-medium font-bold">No interactions found for your search.</p>}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'alerts' && (
                            <motion.div
                                key="alerts"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[2.5rem] border border-brand-light shadow-2xl shadow-brand-medium/10 p-8"
                            >
                                <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-brand-dark" />
                                    Emergency Alert Ledger
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {sosLogs.map(log => (
                                        <div key={log.id} className="p-6 bg-brand-light/50 rounded-2xl border border-brand-primary/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-black text-brand-dark uppercase tracking-tight">SOS Triggered</p>
                                                <p className="text-xs text-brand-primary font-bold mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                            <Shield className="w-10 h-10 text-brand-medium/20" />
                                        </div>
                                    ))}
                                    {sosLogs.length === 0 && (
                                        <div className="col-span-2 py-20 text-center text-brand-medium font-bold">
                                            <Shield className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                            No emergency alerts found. You are doing great!
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
