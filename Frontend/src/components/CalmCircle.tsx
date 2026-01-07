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
            // Cleanup if needed, though simpler with just state updates
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/90 backdrop-blur-md animate-in fade-in duration-500">
            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
                <X size={32} />
            </button>

            <div className="relative flex flex-col items-center justify-center">
                {/* Outer Glow */}
                <div className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out blur-3xl opacity-30
          ${stage === 'inhale' ? 'w-96 h-96 bg-cyan-400' :
                        stage === 'hold' ? 'w-96 h-96 bg-indigo-400 scale-105' :
                            'w-64 h-64 bg-purple-500'}`}
                />

                {/* The Breathing Circle */}
                <div className={`relative flex items-center justify-center rounded-full border-4 border-white/20 shadow-[0_0_100px_rgba(255,255,255,0.1)] transition-all ease-in-out
          ${stage === 'inhale' ? 'w-80 h-80 duration-[4000ms] scale-110 bg-cyan-500/20 border-cyan-200/50' :
                        stage === 'hold' ? 'w-80 h-80 duration-500 scale-110 bg-indigo-500/20 border-indigo-200/50' :
                            'w-80 h-80 duration-[8000ms] scale-75 bg-purple-500/20 border-purple-200/50'}`}
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

                <p className="mt-12 text-indigo-200/60 font-medium tracking-wide uppercase text-sm animate-pulse">
                    Follow the rhythm • 4-7-8 Technique
                </p>
            </div>
        </div>
    );
};

export default CalmCircle;
