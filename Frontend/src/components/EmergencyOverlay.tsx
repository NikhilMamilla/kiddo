import React from 'react';
import { AlertTriangle, Phone, Shield, X } from 'lucide-react';

interface EmergencyOverlayProps {
    onDismiss: () => void;
    sosData?: any;
}

export const EmergencyOverlay: React.FC<EmergencyOverlayProps> = ({ onDismiss, sosData }) => {
    // Brand Palette: #E7F0FA #7BA4D0 #2E5E99 #0D2440
    // Using Brand Dark (#0D2440) for high-alert mode to maintain palette while being serious.

    return (
        <div className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center p-6 text-white text-center font-sans">
            {/* Background Pulse Animation */}
            <div className="absolute inset-0 bg-brand-primary/10 animate-pulse opacity-50" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5" />

            <div className="relative z-10 max-w-2xl w-full animate-fade-in-up">
                <div className="flex justify-center mb-8">
                    <div className="p-6 bg-white rounded-full shadow-[0_0_60px_rgba(46,94,153,0.3)] animate-bounce-slow">
                        <AlertTriangle className="text-brand-dark" size={64} />
                    </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                    Emergency Protocol
                </h1>
                <p className="text-lg md:text-xl font-bold text-brand-light mb-12 tracking-wide border-b-2 border-brand-primary/30 pb-6 inline-block">
                    PROCEEDING WITH AUTONOMOUS SUPPORT. STAY CALM.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-brand-primary/20 shadow-xl text-left">
                        <div className="flex items-center gap-3 mb-4 text-brand-light">
                            <Phone size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Action Sequence</span>
                        </div>
                        <div className="space-y-3">
                            {sosData?.contacts_notified?.map((contact: string, i: number) => (
                                <div key={i} className="text-lg font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                    {contact}
                                </div>
                            )) || (
                                    <>
                                        <div className="text-lg font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                            Emergency Contact Notified
                                        </div>
                                        <div className="text-lg font-bold flex items-center gap-2">
                                            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                                            Local Support Dispatched
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-brand-primary/20 shadow-xl text-left">
                        <div className="flex items-center gap-3 mb-4 text-brand-light">
                            <Shield size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Safety Guidelines</span>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start text-brand-light/90">
                                <span className="font-black text-brand-primary">1.</span>
                                <span className="text-sm font-bold leading-snug">Deep breathing initiated. Stay on this secure screen.</span>
                            </li>
                            <li className="flex gap-3 items-start text-brand-light/90">
                                <span className="font-black text-brand-primary">2.</span>
                                <span className="text-sm font-bold leading-snug">Encrypted location data synced with responders.</span>
                            </li>
                            <li className="flex gap-3 items-start text-brand-light/90">
                                <span className="font-black text-brand-primary">3.</span>
                                <span className="text-sm font-bold leading-snug">Maintaining active session for constant support.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-brand-primary/20 p-4 rounded-2xl mb-8 border border-brand-primary/30 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-light/60 mb-1">Session Override Note</p>
                    <p className="text-sm font-bold italic text-white">"{sosData?.message || 'Emergency response sequence initiated'}"</p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={onDismiss}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-brand-medium transition-all shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-3"
                    >
                        <X size={24} />
                        Dismiss Alert Sequence
                    </button>
                    <p className="text-[10px] font-black text-brand-medium uppercase tracking-widest opacity-50">
                        System Stability Verified
                    </p>
                </div>
            </div>
        </div>
    );
};
