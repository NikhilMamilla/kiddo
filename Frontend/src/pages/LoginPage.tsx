import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            setSuccess('Logged in successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);
        } catch (err: any) {
            console.error(err);
            setError('Failed to log in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await signInWithGoogle();
            setSuccess('Logged in with Google! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);
        } catch (err: any) {
            console.error(err);
            setError('Failed to sign in with Google.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-light flex flex-col sm:justify-center py-4 sm:py-12 px-6 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="z-10 w-full mb-4 sm:absolute sm:top-8 sm:left-8 sm:w-auto sm:mb-0"
            >
                <Link to="/" className="flex items-center text-brand-medium hover:text-brand-primary transition-colors group">
                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all mr-2">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm">Home</span>
                </Link>
            </motion.div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-brand-primary/20">
                        <LogIn className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-brand-medium font-medium">
                        Sign in to your KIDDOO Agent dashboard
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 shadow-2xl shadow-brand-medium/10 rounded-3xl sm:rounded-[2rem] border border-brand-light">
                    <div className="space-y-6">
                        {/* Google Sign In */}
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            type="button"
                            className="w-full flex items-center justify-center py-3 px-4 border border-brand-light rounded-xl shadow-sm text-sm font-bold text-brand-dark bg-white hover:bg-brand-light/50 hover:border-brand-medium/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-brand-light"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-brand-medium/50 font-bold uppercase tracking-wider text-[10px]">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center text-xs font-bold uppercase tracking-wide">
                                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl flex items-center text-xs font-bold uppercase tracking-wide">
                                    <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {success}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-brand-dark mb-1 ml-1 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-brand-medium group-focus-within:text-brand-primary transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-brand-light rounded-xl leading-5 bg-brand-light/10 placeholder-brand-medium/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all font-medium text-brand-dark"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold text-brand-dark mb-1 ml-1 uppercase tracking-wide">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-brand-medium group-focus-within:text-brand-primary transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-brand-light rounded-xl leading-5 bg-brand-light/10 placeholder-brand-medium/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary sm:text-sm transition-all font-medium text-brand-dark"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-primary/25 text-sm font-bold text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all duration-200 transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <div className="flex items-center">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Sign In
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-brand-medium font-medium">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-bold text-brand-primary hover:text-brand-dark transition-colors inline-flex items-center group"
                            >
                                Create one
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-brand-primary ml-1"></span>
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
