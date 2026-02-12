import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface VisualStat {
    channel_name: string;
    image_category: string;
    count: number;
}

export function CategoryChart({ data }: { data: VisualStat[] }) {
    // Transform data for the chart: Group by category
    const chartData = data.reduce((acc: any[], curr) => {
        const existing = acc.find(item => item.name === curr.image_category);
        if (existing) {
            existing.value += curr.count;
        } else {
            acc.push({ name: curr.image_category, value: curr.count });
        }
        return acc;
    }, []);

    const COLORS = {
        'product_display': '#6366f1', // Indigo
        'promotional': '#10b981',     // Emerald
        'lifestyle': '#a855f7',       // Purple
        'other': '#71717a'            // Zinc
    };

    return (
        <Card className="col-span-full border-zinc-800 bg-zinc-900/50">
            <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>
                    Analysis of visual content types across all channels.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.replace('_', ' ')}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#27272a' }}
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                            itemStyle={{ color: '#e4e4e7' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#6366f1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
