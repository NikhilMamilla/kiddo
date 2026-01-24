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
    const trendColor = lastIntensity > firstIntensity ? 'text-brand-dark' : lastIntensity < firstIntensity ? 'text-brand-primary' : 'text-brand-medium';

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-brand-light shadow-xl">
                    <p className="text-xs font-bold text-brand-medium mb-1">{payload[0].payload.time}</p>
                    <p className="text-2xl font-black text-brand-primary">
                        {payload[0].value.toFixed(1)}
                    </p>
                    <p className="text-[9px] text-brand-medium mt-1 uppercase tracking-wider font-bold">Intensity Level</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-brand-light p-6 rounded-3xl shadow-xl border border-brand-medium/10 relative overflow-hidden group font-sans">
            {/* Subtle Gradient Layers */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-brand-light shadow-sm">
                        <Activity size={18} className="text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-brand-dark">Response Intensity Over Time</h3>
                        <p className="text-[9px] text-brand-primary uppercase tracking-widest font-black mt-0.5">Session Timeline</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-brand-light`}>
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
                                <stop offset="0%" stopColor="#2E5E99" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#2E5E99" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#7BA4D0" strokeOpacity={0.1} />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#7BA4D0', fontSize: 9, fontWeight: 900 }}
                        />
                        <YAxis
                            domain={[0, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#7BA4D0', fontSize: 10, fontWeight: 900 }}
                            ticks={[0, 1, 2, 3, 4, 5]}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="intensity"
                            stroke="#2E5E99"
                            strokeWidth={3}
                            fill="url(#intensityGradient)"
                        />

                        <Line
                            type="monotone"
                            dataKey="intensity"
                            stroke="#2E5E99"
                            strokeWidth={3}
                            dot={{ fill: '#2E5E99', strokeWidth: 3, r: 5, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0, fill: '#0D2440' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stats Footer */}
            <div className="mt-4 pt-4 border-t border-brand-medium/10 grid grid-cols-3 gap-4 relative z-10">
                <div className="text-center">
                    <p className="text-[10px] text-brand-medium uppercase tracking-wider font-bold mb-1">
                        Exchanges
                    </p>
                    <p className="text-lg font-black text-brand-dark">{data.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-brand-medium uppercase tracking-wider font-bold mb-1">
                        Average
                    </p>
                    <p className="text-lg font-black text-brand-primary">
                        {(data.reduce((sum, d) => sum + d.intensity, 0) / data.length).toFixed(1)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-brand-medium uppercase tracking-wider font-bold mb-1">
                        Peak
                    </p>
                    <p className="text-lg font-black text-brand-dark">
                        {Math.max(...data.map(d => d.intensity)).toFixed(1)}
                    </p>
                </div>
            </div>
        </div>
    );
};
