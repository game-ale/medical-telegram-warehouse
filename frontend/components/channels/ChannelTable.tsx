"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

interface ChannelStats {
    channel_name: string;
    total_messages: number;
    avg_views: number;
    last_post_date: string;
}

export function ChannelTable({ channels }: { channels: ChannelStats[] }) {
    const getEngagement = (views: number) => {
        if (views > 5000) return { label: "High", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
        if (views > 1000) return { label: "Medium", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
        return { label: "Low", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };
    };

    const getTrend = (name: string) => {
        // Mock trend for visual purposes until API supports it
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        if (hash % 3 === 0) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
        if (hash % 3 === 1) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-zinc-500" />;
    };

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                        <TableHead className="text-zinc-400 pl-6">Channel Name</TableHead>
                        <TableHead className="text-zinc-400">Engagement</TableHead>
                        <TableHead className="text-zinc-400">Messages</TableHead>
                        <TableHead className="text-zinc-400">Avg Views</TableHead>
                        <TableHead className="text-zinc-400">Trend</TableHead>
                        <TableHead className="text-zinc-400">Last Active</TableHead>
                        <TableHead className="text-right text-zinc-400 pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {channels.map((channel) => {
                        const engagement = getEngagement(channel.avg_views);
                        return (
                            <TableRow key={channel.channel_name} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                <TableCell className="pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-zinc-800">
                                            <AvatarImage src={`https://t.me/i/userpic/320/${channel.channel_name}.jpg`} />
                                            <AvatarFallback className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-xs font-medium text-zinc-400">
                                                {channel.channel_name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-zinc-200 text-sm">@{channel.channel_name}</p>
                                            <p className="text-xs text-zinc-500">Telegram Channel</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${engagement.color}`}>
                                        {engagement.label}
                                    </span>
                                </TableCell>
                                <TableCell className="text-zinc-400 font-mono text-xs">{channel.total_messages.toLocaleString()}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-zinc-300 text-sm">
                                        <Eye className="mr-2 h-3 w-3 text-zinc-500" />
                                        {Math.round(channel.avg_views).toLocaleString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getTrend(channel.channel_name)}
                                </TableCell>
                                <TableCell className="text-zinc-500 text-xs">
                                    {new Date(channel.last_post_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Link href={`https://t.me/${channel.channel_name}`} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
