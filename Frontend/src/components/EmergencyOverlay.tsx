import React from 'react';
import { AlertTriangle, Phone, Shield, X } from 'lucide-react';

interface EmergencyOverlayProps {
    onDismiss: () => void;
    sosData?: any;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ onDismiss, sosData }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
            {/* Background Pulse Animation */}
            <div className="absolute inset-0 bg-red-700 animate-pulse opacity-50" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />

            <div className="relative z-10 max-w-2xl w-full animate-fade-in-up">
                <div className="flex justify-center mb-8">
                    <div className="p-6 bg-white rounded-full shadow-[0_0_60px_rgba(255,255,255,0.3)] animate-bounce-slow">
                        <AlertTriangle className="text-red-600" size={64} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                    Emergency Protocol
                </h1>
                <p className="text-lg md:text-xl font-bold text-red-100 mb-12 tracking-wide border-b-2 border-red-400/30 pb-6 inline-block">
                    HELP IS ON THE WAY. STAY CALM.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-red-900/40 backdrop-blur-md p-6 rounded-3xl border border-red-400/30 shadow-xl text-left">
                        <div className="flex items-center gap-3 mb-4 text-red-100">
                            <Phone size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Contacts Notified</span>
                        </div>
                        <div className="space-y-3">
                            {sosData?.contacts_notified?.map((contact: string, i: number) => (
                                <div key={i} className="text-lg font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    {contact}
                                </div>
                            )) || (
                                    <>
                                        <div className="text-lg font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            Emergency Contact 1
                                        </div>
                                        <div className="text-lg font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            Local Emergency Services
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    <div className="bg-red-900/40 backdrop-blur-md p-6 rounded-3xl border border-red-400/30 shadow-xl text-left">
                        <div className="flex items-center gap-3 mb-4 text-red-100">
                            <Shield size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Instructions</span>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <span className="font-black text-red-200">1.</span>
                                <span className="text-sm font-medium leading-snug">Breathe deeply. Stay on this screen.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="font-black text-red-200">2.</span>
                                <span className="text-sm font-medium leading-snug">Your location is being shared with responders.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="font-black text-red-200">3.</span>
                                <span className="text-sm font-medium leading-snug">If safe, find a trusted person nearby.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/10 p-4 rounded-2xl mb-8 border border-white/20 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-200 mb-1">System Status</p>
                    <p className="text-sm font-bold italic text-white">"{sosData?.message || 'Emergency response sequence initiated'}"</p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onDismiss}
                        className="w-full py-4 bg-white text-red-600 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                        <X size={24} />
                        Dismiss & View Support
                    </button>
                    <p className="text-[10px] font-bold text-red-200/50 uppercase tracking-widest">
                        System Simulation Mode
                    </p>
                </div>
            </div>
        </div>
    );
};

