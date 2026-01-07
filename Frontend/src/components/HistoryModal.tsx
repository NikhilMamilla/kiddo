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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative animate-scale-up">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-display font-bold text-slate-800">Session History</h2>
                        <p className="text-xs text-slate-500 font-medium">Record of analyzing states.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            <Clock size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-sm font-medium">No history recorded yet.</p>
                        </div>
                    ) : (
                        history.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm text-slate-500 border border-slate-100">
                                        {item.timestamp}
                                    </span>
                                    {item.sos_triggered && (
                                        <span className="flex items-center gap-1 text-red-600 text-[10px] font-black uppercase tracking-widest">
                                            <AlertCircle size={12} /> SOS
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 italic mb-3">"{item.message}"</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${(item.intensity_score || 0) > 3 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        Intensity: {item.intensity_score?.toFixed(1) ?? 'N/A'}
                                    </span>
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase">
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

