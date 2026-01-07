import React from 'react';
import { Phone, Anchor, Sun, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface ResourceHubProps {
    state: string;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ state }) => {
    const getResources = () => {
        switch (state) {
            case 'Anxiety':
            case 'Stress':
                return {
                    title: "Focus & Grounding",
                    icon: Anchor,
                    color: "text-indigo-600",
                    accent: "indigo",
                    items: [
                        { label: "5-4-3-2-1 Technique", action: "Visual, tactile, and auditory grounding." },
                        { label: "Physiological Sigh", action: "Rapid recovery for the nervous system." },
                        { label: "Box Breathing", action: "Standard stress reduction breathing." }
                    ]
                };
            case 'Depression':
                return {
                    title: "Safety & Support",
                    icon: Shield,
                    color: "text-sky-600",
                    accent: "sky",
                    items: [
                        { label: "Crisis Text Line", action: "Immediate text support (HOME to 741741)." },
                        { label: "988 Lifeline", action: "24/7 confidential connection." },
                        { label: "Community Peer Support", action: "Safe spaces for shared experiences." }
                    ]
                };
            case 'Critical Distress':
                return {
                    title: "Crisis Resources",
                    icon: Phone,
                    color: "text-rose-600",
                    accent: "rose",
                    items: [
                        { label: "Emergency Services", action: "Call 911 for immediate intervention." },
                        { label: "988 Support", action: "Direct access to crisis counselors." },
                        { label: "Local Crisis Center", action: "Physical safe havens in your area." }
                    ]
                };
            default: // Normal
                return {
                    title: "Daily Wellness",
                    icon: Sun,
                    color: "text-emerald-600",
                    accent: "emerald",
                    items: [
                        { label: "Gratitude Journal", action: "Cultivate a positive neural pathway." },
                        { label: "Mindfulness Practice", action: "10 minutes of sensory presence." },
                        { label: "Wellness Learning", action: "Expand your mental health toolkit." }
                    ]
                };
        }
    };

    const content = getResources();
    const Icon = content.icon;

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-indigo-50/50 flex flex-col h-full relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${content.accent}-50 rounded-full blur-3xl group-hover:bg-${content.accent}-100/50 transition-colors duration-500`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 bg-${content.accent}-50 rounded-xl ${content.color} shadow-sm`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Toolkit</h2>
                        <h3 className={`text-lg font-display font-bold ${content.color}`}>{content.title}</h3>
                    </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-300">
                    <ExternalLink size={14} />
                </div>
            </div>

            {/* Items Grid */}
            <div className="space-y-3 flex-1 relative z-10">
                {content.items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-${content.accent}-100 hover:shadow-md transition-all duration-300 group/item cursor-pointer`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 p-1 rounded-md bg-${content.accent}-100/50 ${content.color} group-hover/item:scale-110 transition-transform shadow-xs`}>
                                <ArrowRight size={10} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-800 mb-0.5 tracking-tight">{item.label}</h4>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed opacity-80">
                                    {item.action}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Footer */}
            <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-center relative z-10">
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2">
                    Explore Full Hub <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};

export default ResourceHub;
