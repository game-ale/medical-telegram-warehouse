"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ActivityPoint {
    date: string;
    count: number;
}

export function ActivityChart({ data }: { data: ActivityPoint[] }) {
    // If no data, show a placeholder or empty state
    if (!data || data.length === 0) {
        return (
            <Card className="col-span-4 border-border bg-card shadow-sm">
                <CardHeader>
                    <CardTitle>Daily Posting Activity</CardTitle>
                    <CardDescription>Telegram post volume over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No activity data available.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-4 border-border bg-card shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Daily Posting Activity</CardTitle>
                        <CardDescription>
                            Telegram post volume across monitored channels.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(str) => {
                                const date = new Date(str);
                                return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                            }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                            labelStyle={{ color: 'hsl(var(--muted-foreground))', fontWeight: 'bold' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
