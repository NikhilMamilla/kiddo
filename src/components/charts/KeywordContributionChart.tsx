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

    // Use shades from the 4-color palette
    const categoryColors = ['#0D2440', '#2E5E99', '#7BA4D0', '#2E5E99', '#0D2440'];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-brand-dark/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-brand-primary/20 shadow-2xl">
                    <p className="text-xs font-bold text-brand-light/70 mb-1">{payload[0].payload.name}</p>
                    <p className="text-2xl font-black text-brand-primary">
                        {payload[0].value}
                    </p>
                    <p className="text-[9px] text-brand-medium mt-1 uppercase tracking-wider font-bold">Matches Detected</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-brand-light relative overflow-hidden group font-sans">
            {/* Subtle Glow */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-brand-light rounded-full blur-3xl group-hover:bg-brand-light/50 transition-all duration-700" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-brand-light rounded-xl border border-brand-medium/20 shadow-sm">
                    <Hash size={18} className="text-brand-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-brand-dark">Keyword Triggers</h3>
                    <p className="text-[9px] text-brand-primary uppercase tracking-widest font-black mt-0.5">Category Intensity</p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-48 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <XAxis
                            dataKey="displayName"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#7BA4D0', fontSize: 10, fontWeight: 900 }}
                        />
                        <YAxis hide domain={[0, 'dataMax + 2']} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(46, 94, 153, 0.05)' }} />

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
                                style={{ fill: '#0D2440', fontSize: 12, fontWeight: 900 }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Footer Note */}
            <div className="mt-2 pt-3 border-t border-brand-light relative z-10">
                <p className="text-[9px] text-brand-medium uppercase tracking-wider font-bold text-center">
                    Prioritized Category Concentration
                </p>
            </div>
        </div>
    );
};

export default KeywordContributionChart;
