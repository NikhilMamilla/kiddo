import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CalmCircleProps {
    onClose: () => void;
}

const CalmCircle: React.FC<CalmCircleProps> = ({ onClose }) => {
    const [stage, setStage] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [text, setText] = useState('Breathe In');

    useEffect(() => {
        const cycle = async () => {
            // Inhale: 4 seconds
            setStage('inhale');
            setText('Breathe In');
            await new Promise(r => setTimeout(r, 4000));

            // Hold: 7 seconds
            setStage('hold');
            setText('Hold');
            await new Promise(r => setTimeout(r, 7000));

            // Exhale: 8 seconds
            setStage('exhale');
            setText('Breathe Out');
            await new Promise(r => setTimeout(r, 8000));

            // Loop
            cycle();
        };

        cycle();

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Brand Palette: #E7F0FA #7BA4D0 #2E5E99 #0D2440

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/95 backdrop-blur-md animate-in fade-in duration-500 font-sans">
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>

            <div className="relative flex flex-col items-center justify-center">
                {/* Outer Glow */}
                <div className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out blur-3xl opacity-30
          ${stage === 'inhale' ? 'w-96 h-96 bg-brand-primary' :
                        stage === 'hold' ? 'w-96 h-96 bg-brand-medium scale-105' :
                            'w-64 h-64 bg-brand-light'}`}
                />

                {/* The Breathing Circle */}
                <div className={`relative flex items-center justify-center rounded-full border-4 border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-all ease-in-out
          ${stage === 'inhale' ? 'w-80 h-80 duration-[4000ms] scale-110 bg-brand-primary/20 border-brand-primary/50' :
                        stage === 'hold' ? 'w-80 h-80 duration-500 scale-110 bg-brand-medium/20 border-brand-medium/50' :
                            'w-80 h-80 duration-[8000ms] scale-75 bg-brand-light/10 border-brand-light/50'}`}
                >
                    {/* Inner Text */}
                    <div className="text-center transition-all duration-500">
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 transition-all duration-500">
                            {text}
                        </h2>
                        <div className="flex gap-2 justify-center opacity-50">
                            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${stage === 'inhale' ? 'bg-white' : 'bg-white/20'}`} />
                            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${stage === 'hold' ? 'bg-white' : 'bg-white/20'}`} />
                            <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${stage === 'exhale' ? 'bg-white' : 'bg-white/20'}`} />
                        </div>
                    </div>
                </div>

                <p className="mt-12 text-brand-light/60 font-black tracking-widest uppercase text-xs animate-pulse">
                    Follow the rhythm • 4-7-8 Technique
                </p>
            </div>
        </div>
    );
};

export default CalmCircle;
