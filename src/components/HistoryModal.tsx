import React from 'react';
import type { PredictionHistoryItem } from '../types/history';
import { X, Clock, AlertCircle } from 'lucide-react';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: PredictionHistoryItem[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative animate-scale-up border border-brand-light">

                {/* Header */}
                <div className="p-6 border-b border-brand-light flex items-center justify-between bg-brand-light/20">
                    <div>
                        <h2 className="text-xl font-bold text-brand-dark">Session History</h2>
                        <p className="text-xs text-brand-medium font-bold uppercase tracking-widest">Interaction Archive</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-brand-light hover:bg-brand-medium/20 rounded-full transition-colors text-brand-primary"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-brand-medium/40">
                            <Clock size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-sm font-black uppercase tracking-widest">No history recorded.</p>
                        </div>
                    ) : (
                        history.map((item, idx) => (
                            <div key={idx} className="bg-brand-light/10 rounded-2xl p-4 border border-brand-light hover:border-brand-medium/30 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm text-brand-primary border border-brand-light">
                                        {item.timestamp}
                                    </span>
                                    {item.sos_triggered && (
                                        <span className="flex items-center gap-1 text-brand-dark text-[10px] font-black uppercase tracking-widest">
                                            <AlertCircle size={12} className="text-brand-primary" /> ALERT TRIGGERED
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-brand-dark font-medium italic mb-3">"{item.message}"</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${(item.intensity_score || 0) > 3 ? 'bg-brand-dark text-white' : 'bg-brand-primary text-white'
                                        }`}>
                                        Intensity: {item.intensity_score?.toFixed(1) ?? 'N/A'}
                                    </span>
                                    <span className="px-2 py-1 bg-brand-medium text-white rounded-md text-[10px] font-black uppercase">
                                        State: {item.classified_state}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
