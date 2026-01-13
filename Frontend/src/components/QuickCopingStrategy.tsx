import React from 'react';
import { Heart, Wind, Target, CheckCircle2 } from 'lucide-react';

interface QuickCopingStrategyProps {
    state: string;
}

export const QuickCopingStrategy: React.FC<QuickCopingStrategyProps> = ({ state }) => {
    const getStrategy = () => {
        // Unified palette adaptation: #E7F0FA #7BA4D0 #2E5E99 #0D2440
        switch (state) {
            case 'Stress':
            case 'Anxiety':
                return {
                    title: 'Strategic Grounding',
                    icon: Wind,
                    color: 'from-brand-primary to-brand-dark',
                    bgColor: 'bg-white',
                    iconBg: 'bg-brand-light',
                    iconColor: 'text-brand-primary',
                    steps: [
                        'Breathe in for 4 seconds',
                        'Hold for 4 seconds',
                        'Breathe out for 4 seconds',
                        'Identify 3 things you can see',
                        'Notice your current heartbeat'
                    ],
                    description: 'This anchors your nervous system to the present moment.'
                };
            case 'Depression':
            case 'Critical Distress':
                return {
                    title: 'Momentum Protocol',
                    icon: Target,
                    color: 'from-brand-dark to-brand-primary',
                    bgColor: 'bg-brand-dark',
                    iconBg: 'bg-white/10',
                    iconColor: 'text-white',
                    steps: [
                        'Stand up and take a deep breath',
                        'Drink a glass of water slowly',
                        'Open a window for fresh air',
                        'Identify one small task completed',
                        'Acknowledge your strength ✨'
                    ],
                    description: 'Small, intentional actions disrupt negative cycles.'
                };
            default: // Normal / Positive
                return {
                    title: 'Gratitude Reflection',
                    icon: Heart,
                    color: 'from-brand-medium to-brand-primary',
                    bgColor: 'bg-brand-light',
                    iconBg: 'bg-white',
                    iconColor: 'text-brand-primary',
                    steps: [
                        'Name 3 things you\'re grateful for',
                        'Recall a recent moment of peace',
                        'Acknowledge a personal win today',
                        'Notice one positive trait in yourself',
                        'Savor this state of balance'
                    ],
                    description: 'Strengthens resilient neural pathways and wellbeing.'
                };
        }
    };

    const strategy = getStrategy();
    const Icon = strategy.icon;
    const isDark = strategy.bgColor === 'bg-brand-dark';

    return (
        <div className={`${strategy.bgColor} p-6 rounded-[2rem] shadow-xl border border-brand-light hover:shadow-2xl transition-all duration-300 relative overflow-hidden group font-sans`}>
            {/* Animated Background Glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${strategy.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`${strategy.iconBg} p-3 rounded-xl ${strategy.iconColor} shadow-sm`}>
                    <Icon size={24} className="animate-pulse-slow" />
                </div>
                <div className="flex-1">
                    <h3 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-brand-light/50' : 'text-brand-medium'}`}>Relief Protocol</h3>
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-brand-dark'}`}>
                        {strategy.title}
                    </p>
                </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 mb-4 relative z-10">
                {strategy.steps.map((step, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200"
                    >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${strategy.color} flex items-center justify-center shadow-sm`}>
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                        <p className={`text-sm leading-relaxed flex-1 font-bold ${isDark ? 'text-brand-light/70' : 'text-brand-dark/80'}`}>
                            {step}
                        </p>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className={`${strategy.iconBg} px-4 py-3 rounded-xl relative z-10 border border-brand-medium/10`}>
                <p className={`text-[10px] leading-relaxed italic font-bold ${isDark ? 'text-brand-light/50' : 'text-brand-medium'}`}>
                    💡 {strategy.description}
                </p>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
        </div>
    );
};

export default QuickCopingStrategy;
