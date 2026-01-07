import React from 'react';
import { Heart, Wind, Sparkles, Target, CheckCircle2 } from 'lucide-react';

interface QuickCopingStrategyProps {
    state: string;
}

export const QuickCopingStrategy: React.FC<QuickCopingStrategyProps> = ({ state }) => {
    const getStrategy = () => {
        switch (state) {
            case 'Stress':
                return {
                    title: 'Box Breathing',
                    icon: Wind,
                    color: 'from-amber-400 to-orange-500',
                    bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    steps: [
                        'Breathe in for 4 seconds',
                        'Hold for 4 seconds',
                        'Breathe out for 4 seconds',
                        'Hold for 4 seconds',
                        'Repeat 4 times'
                    ],
                    description: 'This calms your nervous system and reduces stress hormones.'
                };
            case 'Anxiety':
                return {
                    title: '5-4-3-2-1 Grounding',
                    icon: Sparkles,
                    color: 'from-blue-400 to-indigo-500',
                    bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    steps: [
                        'Name 5 things you can see',
                        'Name 4 things you can touch',
                        'Name 3 things you can hear',
                        'Name 2 things you can smell',
                        'Name 1 thing you can taste'
                    ],
                    description: 'Anchors you to the present moment and reduces panic.'
                };
            case 'Depression':
                return {
                    title: 'One Small Step',
                    icon: Target,
                    color: 'from-purple-400 to-pink-500',
                    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
                    iconBg: 'bg-purple-100',
                    iconColor: 'text-purple-600',
                    steps: [
                        'Stand up and stretch',
                        'Drink a glass of water',
                        'Open a window for fresh air',
                        'Write down one thing you did today',
                        'Celebrate this small win ✨'
                    ],
                    description: 'Small actions create momentum and break the cycle.'
                };
            default: // Normal
                return {
                    title: 'Gratitude Practice',
                    icon: Heart,
                    color: 'from-emerald-400 to-teal-500',
                    bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    steps: [
                        'Name 3 things you\'re grateful for today',
                        'Think of someone who made you smile',
                        'Acknowledge something you did well',
                        'Notice one beautiful thing around you',
                        'Take a moment to appreciate yourself'
                    ],
                    description: 'Strengthens positive neural pathways and wellbeing.'
                };
        }
    };

    const strategy = getStrategy();
    const Icon = strategy.icon;

    return (
        <div className={`${strategy.bgColor} p-6 rounded-2xl shadow-soft border border-white/60 hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}>
            {/* Animated Background Glow */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${strategy.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500`} />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className={`${strategy.iconBg} p-3 rounded-xl ${strategy.iconColor} shadow-sm`}>
                    <Icon size={24} className="animate-pulse-slow" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Quick Relief</h3>
                    <p className={`text-lg font-display font-bold bg-gradient-to-r ${strategy.color} bg-clip-text text-transparent`}>
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
                        <p className="text-sm text-slate-700 leading-relaxed flex-1 font-medium">
                            {step}
                        </p>
                    </div>
                ))}
            </div>

            {/* Description */}
            <div className={`${strategy.iconBg} px-4 py-3 rounded-xl relative z-10`}>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                    💡 {strategy.description}
                </p>
            </div>

            {/* Decorative Element */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        </div>
    );
};

export default QuickCopingStrategy;
