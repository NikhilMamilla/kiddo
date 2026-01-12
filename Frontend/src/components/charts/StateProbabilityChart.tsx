import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface StateProbabilityChartProps {
    probabilities: Record<string, number>;
    dominantState: string;
}

export const StateProbabilityChart: React.FC<StateProbabilityChartProps> = ({ probabilities, dominantState }) => {
    if (!probabilities || Object.keys(probabilities).length === 0) {
        return (
            <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-2xl border border-brand-primary/20 h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-brand-light/50">Waiting for analysis data...</p>
                    <p className="text-xs text-brand-medium mt-2">Enable Review Mode before sending messages</p>
                </div>
            </div>
        );
    }

    const data = Object.entries(probabilities).map(([name, value]) => ({
        name,
        value,
        displayName: name === "Critical Distress" ? "Critical" : name
    }));

    // Strictly using the 4-color palette for chart fills
    const COLORS = {
        primary: "#2E5E99",
        medium: "#7BA4D0",
        dark: "#0D2440",
        light: "#E7F0FA"
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-brand-dark/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-brand-primary/20 shadow-2xl">
                    <p className="text-xs font-bold text-brand-light/70 mb-1">{payload[0].payload.name}</p>
                    <p className="text-2xl font-black text-brand-primary">
                        {payload[0].value}%
                    </p>
                    <p className="text-[9px] text-brand-medium mt-1 uppercase tracking-wider font-bold">Confidence Score</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-brand-dark text-white p-6 rounded-3xl shadow-2xl border border-brand-primary/20 relative overflow-hidden group font-sans">
            {/* Subtle Gradient Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-700" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-brand-primary/20 rounded-xl border border-brand-primary/30">
                    <TrendingUp size={18} className="text-brand-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">Confidence Distribution</h3>
                    <p className="text-[9px] text-brand-medium uppercase tracking-widest font-black mt-0.5">Neural Analysis</p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-56 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 0, right: 60, top: 0, bottom: 0 }}>
                        <XAxis type="number" hide domain={[0, 100]} />
                        <YAxis
                            dataKey="displayName"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tick={{ fill: '#7BA4D0', fontSize: 11, fontWeight: 900 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.name === dominantState ? COLORS.primary : COLORS.medium}
                                    fillOpacity={entry.name === dominantState ? 1 : 0.2}
                                    stroke={entry.name === dominantState ? COLORS.primary : 'transparent'}
                                    strokeWidth={entry.name === dominantState ? 2 : 0}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend - Dominant State */}
            <div className="mt-4 pt-4 border-t border-brand-primary/10 flex items-center justify-between relative z-10">
                <span className="text-xs text-brand-medium uppercase tracking-wider font-bold">Dominant State:</span>
                <span className="text-sm font-black text-white px-3 py-1.5 rounded-lg bg-brand-primary/20 border border-brand-primary/30">
                    {dominantState}
                </span>
            </div>
        </div>
    );
};
