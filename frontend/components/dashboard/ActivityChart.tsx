"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
    { name: "Mon", total: 4 },
    { name: "Tue", total: 3 },
    { name: "Wed", total: 7 },
    { name: "Thu", total: 5 },
    { name: "Fri", total: 8 },
    { name: "Sat", total: 2 },
    { name: "Sun", total: 4 },
];

export function ActivityChart() {
    return (
        <Card className="col-span-4 bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-200">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#52525b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#27272a' }}
                            contentStyle={{ backgroundColor: '#18181b', borderRadius: '8px', border: '1px solid #27272a', color: '#fff' }}
                        />
                        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
