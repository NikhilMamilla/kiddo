import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface StateProbabilityChartProps {
    probabilities: Record<string, number>;
    dominantState: string;
}

export const StateProbabilityChart: React.FC<StateProbabilityChartProps> = ({ probabilities, dominantState }) => {
    // Check if probabilities exist and have data
    if (!probabilities || Object.keys(probabilities).length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-indigo-500/20 h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-slate-400">Waiting for analysis data...</p>
                    <p className="text-xs text-slate-500 mt-2">Enable Review Mode before sending messages</p>
                </div>
            </div>
        );
    }

    const data = Object.entries(probabilities).map(([name, value]) => ({
        name,
        value,
        displayName: name === "Critical Distress" ? "Critical" : name
    }));

    // Premium gradient colors for each state
    const COLORS: Record<string, { fill: string; glow: string }> = {
        "Normal": {
            fill: "url(#normalGradient)",
            glow: "#10b981"
        },
        "Stress": {
            fill: "url(#stressGradient)",
            glow: "#f59e0b"
        },
        "Anxiety": {
            fill: "url(#anxietyGradient)",
            glow: "#3b82f6"
        },
        "Depression": {
            fill: "url(#depressionGradient)",
            glow: "#8b5cf6"
        },
        "Critical Distress": {
            fill: "url(#criticalGradient)",
            glow: "#ef4444"
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/10 shadow-2xl">
                    <p className="text-xs font-bold text-slate-300 mb-1">{payload[0].payload.name}</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {payload[0].value}%
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">Confidence Score</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-indigo-500/20 relative overflow-hidden group">
            {/* Animated Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
                    <TrendingUp size={18} className="text-indigo-300" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">Confidence Distribution</h3>
                    <p className="text-[9px] text-indigo-300 uppercase tracking-widest font-bold mt-0.5">State Analysis</p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-56 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 60, top: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="normalGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="stressGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="anxietyGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="depressionGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                            </linearGradient>
                            <linearGradient id="criticalGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#dc2626" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                            dataKey="displayName"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.name === dominantState ? COLORS[entry.name].fill : '#334155'}
                                    fillOpacity={entry.name === dominantState ? 1 : 0.3}
                                    stroke={entry.name === dominantState ? COLORS[entry.name].glow : 'transparent'}
                                    strokeWidth={entry.name === dominantState ? 2 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend - Dominant State */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Dominant State:</span>
                <span className="text-sm font-black text-white px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
                    {dominantState}
                </span>
            </div>
        </div>
    );
};

