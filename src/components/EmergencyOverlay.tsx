import React from 'react';
import { AlertTriangle, Phone, Shield, X, Activity } from 'lucide-react';

interface EmergencyOverlayProps {
    onDismiss: () => void;
    sosData?: any;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ onDismiss, sosData }) => {
    // Brand Colors: Dark Blue (#0D2440), Primary Blue (#2E5E99)
    // Emergency Colors: Red (#DC2626)
    // Strategy: Use Brand Dark as base, Red as the "Active State"

    return (
        <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center p-4 md:p-6 text-white text-center font-sans overflow-y-auto">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-brand-dark pointer-events-none" />
            <div className="absolute inset-0 bg-red-600/5 animate-pulse pointer-events-none" />

            <div className="relative z-10 max-w-md w-full animate-fade-in-up flex flex-col h-full md:h-auto justify-center">

                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 shrink-0">
                    <div className="p-5 bg-red-600 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.6)] mb-6 relative animate-bounce-slow">
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping opacity-20"></div>
                        <AlertTriangle className="text-white fill-white/20" size={48} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white drop-shadow-lg mb-2">
                        Emergency
                    </h1>
                    <p className="text-red-200 text-xs md:text-sm font-bold tracking-[0.2em] uppercase border px-3 py-1 rounded-full border-red-500/50 bg-red-900/30 backdrop-blur-sm">
                        Protocol Activated
                    </p>
                </div>

                {/* Content Cards */}
                <div className="space-y-4 w-full mb-8 shrink-0">
                    {/* Action Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-xl border-l-4 border-red-600 text-left relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Phone size={80} className="text-brand-dark" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-brand-light rounded-lg">
                                <Activity size={16} className="text-brand-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-medium">Action Sequence</span>
                        </div>
                        <div className="space-y-2">
                            {sosData?.contacts_notified?.map((contact: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-brand-dark font-bold text-sm">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    {contact}
                                </div>
                            )) || (
                                    <>
                                        <div className="flex items-center gap-3 text-brand-dark font-bold text-sm">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                                            <span>Emergency Contacts Notified</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-brand-dark font-bold text-sm">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
                                            <span>Location Sharing Active</span>
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {/* Safety Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-xl border-l-4 border-brand-primary text-left relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield size={80} className="text-brand-dark" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-brand-light rounded-lg">
                                <Shield size={16} className="text-brand-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-medium">Safety Guidelines</span>
                        </div>
                        <ul className="space-y-3">
                            <li className="flex gap-3 items-start">
                                <span className="font-black text-brand-primary text-sm mt-0.5">01</span>
                                <span className="text-sm font-medium text-brand-dark leading-snug">Remain calm. Take deep breaths.</span>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="font-black text-brand-primary text-sm mt-0.5">02</span>
                                <span className="text-sm font-medium text-brand-dark leading-snug">Stay on this screen for support.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Dismiss Button */}
                <button
                    onClick={onDismiss}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl text-base font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 shrink-0"
                >
                    <X size={20} />
                    <span>Dismiss Alert</span>
                </button>

                <p className="mt-4 text-[10px] text-brand-light/40 uppercase tracking-widest font-medium">
                    Automated Support System Active
                </p>
            </div>
        </div>
    );
};
