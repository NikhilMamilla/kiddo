import React from 'react';
import { Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import type { PredictionHistoryItem } from '../../types/history';
import { Activity } from 'lucide-react';

interface IntensityTimelineProps {
    history: PredictionHistoryItem[];
}

export const IntensityTimeline: React.FC<IntensityTimelineProps> = ({ history }) => {
    if (history.length < 2) return null;

    const data = history.map((item, index) => ({
        time: item.timestamp,
        intensity: item.intensity_score,
        index: index + 1
    }));

    // Determine trend
    const firstIntensity = data[0].intensity;
    const lastIntensity = data[data.length - 1].intensity;
    const trend = lastIntensity > firstIntensity ? '↗ Increasing' : lastIntensity < firstIntensity ? '↘ Decreasing' : '→ Stable';
    const trendColor = lastIntensity > firstIntensity ? 'text-red-600' : lastIntensity < firstIntensity ? 'text-emerald-600' : 'text-slate-600';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-indigo-200 shadow-xl">
                    <p className="text-xs font-bold text-slate-600 mb-1">{payload[0].payload.time}</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {payload[0].value.toFixed(1)}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-wider">Intensity Score</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/30 p-6 rounded-3xl shadow-lg border border-indigo-100/50 relative overflow-hidden group">
            {/* Animated Gradient Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full blur-3xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl border border-indigo-200/50">
                        <Activity size={18} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Emotional Journey</h3>
                        <p className="text-[9px] text-indigo-600 uppercase tracking-widest font-bold mt-0.5">Session Timeline</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-indigo-200/50`}>
                    <span className={`text-xs font-black ${trendColor} uppercase tracking-wide`}>
                        {trend}
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-56 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ left: -20, right: 30, top: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" strokeOpacity={0.5} />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }}
                        />
                        <YAxis
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                            ticks={[0, 1, 2, 3, 4, 5]}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="intensity"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            fill="url(#intensityGradient)"
                        />

                        <Line
                            type="monotone"
                            dataKey="intensity"
                            stroke="url(#lineGradient)"
                            strokeWidth={3}
                            dot={{ fill: '#6366f1', strokeWidth: 3, r: 5, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0, fill: '#8b5cf6' }}
                        />

                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Footer */}
            <div className="mt-4 pt-4 border-t border-indigo-100/50 grid grid-cols-3 gap-4 relative z-10">
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Messages
                    </p>
                    <p className="text-lg font-black text-indigo-600">{data.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Average
                    </p>
                    <p className="text-lg font-black text-purple-600">
                        {(data.reduce((sum, d) => sum + d.intensity, 0) / data.length).toFixed(1)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Peak
                    </p>
                    <p className="text-lg font-black text-pink-600">
                        {Math.max(...data.map(d => d.intensity)).toFixed(1)}
                    </p>
                </div>
            </div>
        </div>
    );
};

