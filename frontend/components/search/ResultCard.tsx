"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { ChannelBadge, ChannelType } from "./ChannelBadge";
import { MetricStat } from "./MetricStat";

interface ResultCardProps {
    title: string;
    summary: string;
    channel: ChannelType;
    source: string;
    timestamp: string;
    views: number | string;
    status: "Urgent" | "Shortage" | "Alert" | "Neutral";
    onClick?: () => void;
}

export function ResultCard({
    title,
    summary,
    channel,
    source,
    timestamp,
    views,
    status,
    onClick
}: ResultCardProps) {
    const statusVariant = {
        Urgent: "danger",
        Shortage: "warning",
        Alert: "warning",
        Neutral: "default",
    } as const;

    // Format date and time
    const dateObj = new Date(timestamp);
    const dateStr = dateObj.toLocaleDateString();
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <Card
            className="group relative bg-card border-border hover:bg-accent/5 hover:border-accent transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
            onClick={onClick}
        >
            {/* Left Accent Border */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5 ${status === 'Urgent' ? 'bg-red-500' :
                status === 'Shortage' || status === 'Alert' ? 'bg-amber-500' : 'bg-transparent'
                }`} />

            <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                            <ChannelBadge type={channel} />
                            <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">{source}</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-foreground transition-colors">
                            {title}
                        </h3>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <MetricStat label="STATUS" value={status} variant={statusVariant[status]} />
                        <MetricStat label="VIEWS" value={views} icon="views" />
                    </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 pr-6 group-hover:text-foreground transition-colors">
                    {summary}
                </p>

                <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium">
                            <Clock className="h-3 w-3" />
                            {timeStr}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-indigo-400 text-xs font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View Details
                        <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
