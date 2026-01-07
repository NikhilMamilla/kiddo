import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, LabelList } from 'recharts';
import { Hash } from 'lucide-react';

interface KeywordContributionChartProps {
    contributions: Record<string, number>;
}

export const KeywordContributionChart: React.FC<KeywordContributionChartProps> = ({ contributions }) => {
    const data = Object.entries(contributions)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({
            name,
            value,
            displayName: name.length > 10 ? name.substring(0, 10) + '...' : name
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 categories

    if (data.length === 0) return null;

    // Color palette for different categories
    const categoryColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-indigo-400/20 shadow-2xl">
                    <p className="text-xs font-bold text-slate-300 mb-1">{payload[0].payload.name}</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {payload[0].value}
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider">Keywords Matched</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 p-6 rounded-3xl shadow-lg border border-blue-100/50 relative overflow-hidden group">
            {/* Subtle Glow */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl group-hover:bg-blue-300/20 transition-all duration-700" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-blue-100 rounded-xl border border-blue-200/50">
                    <Hash size={18} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Keyword Triggers</h3>
                    <p className="text-[9px] text-blue-600 uppercase tracking-widest font-bold mt-0.5">Category Matches</p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-48 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            {categoryColors.map((color, index) => (
                                <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                </linearGradient>
                            ))}
                        </defs>

                        <XAxis
                            dataKey="displayName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                        />
                        <YAxis hide domain={[0, 'dataMax + 2']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />

                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={categoryColors[index % categoryColors.length]}
                                    fillOpacity={0.8}
                                />
                            ))}
                            <LabelList
                                dataKey="value"
                                position="top"
                                style={{ fill: '#1e293b', fontSize: 12, fontWeight: 800 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Footer Note */}
            <div className="mt-2 pt-3 border-t border-blue-100/50 relative z-10">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-bold text-center">
                    Top {data.length} Detected Categories
                </p>
            </div>
        </div>
    );
};

export default KeywordContributionChart;
