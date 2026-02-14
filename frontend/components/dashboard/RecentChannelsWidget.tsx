"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import Link from "next/link";

interface ChannelStats {
    channel_name: string;
    total_messages: number;
    avg_views: number;
    last_post_date: string;
}

export function RecentChannelsWidget({ channels }: { channels: ChannelStats[] }) {
    // Sort by total messages desc and take top 5
    const topChannels = [...channels].sort((a, b) => b.total_messages - a.total_messages).slice(0, 5);

    const getEngagementColor = (views: number) => {
        if (views > 5000) return "bg-emerald-500";
        if (views > 1000) return "bg-amber-500";
        return "bg-zinc-500";
    };

    return (
        <Card className="col-span-4 border-border bg-card shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Most Active Channels</CardTitle>
                        <CardDescription>Top channels by message volume.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground pl-0">Channel Name</TableHead>
                            <TableHead className="text-muted-foreground text-center">Posts</TableHead>
                            <TableHead className="text-muted-foreground">Engagement</TableHead>
                            <TableHead className="text-right text-muted-foreground pr-0">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topChannels.map((channel) => (
                            <TableRow key={channel.channel_name} className="border-b border-border hover:bg-muted/50">
                                <TableCell className="pl-0 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border border-border">
                                            <AvatarImage src={`https://t.me/i/userpic/320/${channel.channel_name}.jpg`} />
                                            <AvatarFallback className="bg-muted text-xs text-muted-foreground">
                                                {channel.channel_name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">@{channel.channel_name}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center text-foreground/80 font-mono text-xs">
                                    {channel.total_messages.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-1.5 w-8 rounded-full ${getEngagementColor(channel.avg_views)}`}></div>
                                        <span className="text-xs text-muted-foreground">
                                            {channel.avg_views > 5000 ? 'High' : channel.avg_views > 1000 ? 'Med' : 'Low'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-0">
                                    <Link href={`https://t.me/${channel.channel_name}`} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-indigo-600">
                                            <Eye className="h-3.5 w-3.5" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
