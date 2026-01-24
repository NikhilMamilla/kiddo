import React from 'react';
import { Anchor, Sun, Shield, ArrowRight, ExternalLink } from 'lucide-react';

interface ResourceHubProps {
    state: string;
}

const ResourceHub: React.FC<ResourceHubProps> = ({ state }) => {
    const getResources = () => {
        // Strict 4-color palette mapping
        switch (state) {
            case 'Anxiety':
            case 'Stress':
                return {
                    title: "Focus & Grounding",
                    icon: Anchor,
                    color: "text-brand-primary",
                    accent: "brand-primary",
                    items: [
                        { label: "Box Breathing Technique", action: "Nervous system recovery protocol." },
                        { label: "Sensory Grounding", action: "Visual and tactile environmental anchoring." },
                        { label: "Mindful Presence", action: "Intentional focus in the current moment." }
                    ]
                };
            case 'Depression':
            case 'Critical Distress':
                return {
                    title: "Safety & Connection",
                    icon: Shield,
                    color: "text-brand-dark",
                    accent: "brand-dark",
                    items: [
                        { label: "Crisis Resource Line", action: "Confidential 24/7 text and call support." },
                        { label: "Professional Networks", action: "Verified clinical and peer assistance." },
                        { label: "Immediate Safe Spaces", action: "Local facilities for urgent stabilization." }
                    ]
                };
            default: // Normal
                return {
                    title: "Optimal Performance",
                    icon: Sun,
                    color: "text-brand-primary",
                    accent: "brand-primary",
                    items: [
                        { label: "Gratitude Journaling", action: "Strengthening positive cognitive pathways." },
                        { label: "Holistic Wellness", action: "Integrated physical and mental health habits." },
                        { label: "Resilience Training", action: "Proactive psychological maintenance toolkit." }
                    ]
                };
        }
    };

    const content = getResources();
    const Icon = content.icon;
    // const isDark = content.accent === 'brand-dark';

    return (
        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-brand-light flex flex-col h-full relative overflow-hidden group font-sans">
            {/* Background Glow */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-brand-light rounded-full blur-3xl group-hover:bg-brand-medium/10 transition-colors duration-500`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 bg-brand-light rounded-xl ${content.color} shadow-sm border border-brand-medium/10`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-medium">Knowledge Hub</h2>
                        <h3 className={`text-lg font-black ${content.color}`}>{content.title}</h3>
                    </div>
                </div>
                <div className="p-2 bg-brand-light rounded-lg text-brand-medium hover:text-brand-primary transition-colors cursor-pointer">
                    <ExternalLink size={14} />
                </div>
            </div>

            {/* Items Grid */}
            <div className="space-y-3 flex-1 relative z-10">
                {content.items.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded-2xl border border-brand-light bg-brand-light/20 hover:bg-white hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 group/item cursor-pointer`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 p-1 rounded-md bg-brand-primary/10 ${content.color} group-hover/item:scale-110 transition-transform`}>
                                <ArrowRight size={10} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-brand-dark mb-0.5 tracking-tight">{item.label}</h4>
                                <p className="text-[10px] text-brand-medium font-bold leading-relaxed opacity-80">
                                    {item.action}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Footer */}
            <div className="mt-6 pt-5 border-t border-brand-light flex items-center justify-center relative z-10">
                <button className="text-[10px] font-black uppercase tracking-widest text-brand-medium hover:text-brand-primary transition-colors flex items-center gap-2">
                    Explore Advanced Toolkit <ArrowRight size={12} />
                </button>
            </div>
        </div>
    );
};

export default ResourceHub;
