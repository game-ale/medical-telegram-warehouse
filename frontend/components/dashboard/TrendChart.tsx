"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { average: 400, today: 240 },
    { average: 300, today: 139 },
    { average: 200, today: 980 },
    { average: 278, today: 390 },
    { average: 189, today: 480 },
    { average: 239, today: 380 },
    { average: 349, today: 430 },
];

export function TrendChart() {
    return (
        <Card className="col-span-4 border-zinc-800 bg-zinc-900/50">
            <CardHeader>
                <CardTitle>Keyword Trends</CardTitle>
                <CardDescription>
                    Daily keyword frequency analysis.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                            itemStyle={{ color: '#e4e4e7' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="average"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="today"
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
