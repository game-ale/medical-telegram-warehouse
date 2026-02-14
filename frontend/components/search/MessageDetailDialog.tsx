"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, Clock, ExternalLink, Eye, TrendingUp } from "lucide-react";
import { ChannelBadge, ChannelType } from "./ChannelBadge";

interface MessageDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: {
        title: string;
        summary: string;
        message_text: string;
        channel: ChannelType;
        source: string;
        timestamp: string;
        views: number | string;
        status: "Urgent" | "Shortage" | "Alert" | "Neutral";
        message_id?: string;
    } | null;
}

export function MessageDetailDialog({ open, onOpenChange, message }: MessageDetailDialogProps) {
    if (!message) return null;

    // Safe access with fallbacks
    const views = message.views || 0;
    const viewsFormatted = typeof views === 'number' ? views.toLocaleString() : String(views);

    const dateObj = new Date(message.timestamp);
    const dateStr = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusConfig = {
        Urgent: {
            color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
            icon: AlertCircle,
            gradient: "from-red-500/20 to-transparent"
        },
        Shortage: {
            color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
            icon: TrendingUp,
            gradient: "from-amber-500/20 to-transparent"
        },
        Alert: {
            color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            icon: AlertCircle,
            gradient: "from-orange-500/20 to-transparent"
        },
        Neutral: {
            color: "bg-muted text-muted-foreground border-border",
            icon: TrendingUp,
            gradient: "from-muted/50 to-transparent"
        },
    };

    const StatusIcon = statusConfig[message.status].icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-card border-border shadow-2xl p-0">
                {/* Gradient Header Background */}
                <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-br ${statusConfig[message.status].gradient} opacity-50 blur-3xl`} />

                <div className="relative overflow-y-auto max-h-[85vh] scrollbar-hide">
                    {/* Header Section */}
                    <DialogHeader className="px-8 pt-8 pb-6 space-y-4">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1 space-y-3">
                                {/* Channel Badge */}
                                <div className="flex items-center gap-3">
                                    <ChannelBadge type={message.channel} />
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        @{message.source}
                                    </span>
                                </div>

                                {/* Title */}
                                <DialogTitle className="text-3xl font-bold text-foreground leading-tight tracking-tight">
                                    {message.title}
                                </DialogTitle>

                                {/* Metadata Pills */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">{dateStr}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">{timeStr}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-foreground">{viewsFormatted} views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="shrink-0">
                                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${statusConfig[message.status].color} shadow-sm`}>
                                    <StatusIcon className="h-4 w-4" />
                                    <span className="text-sm font-bold uppercase tracking-wider">{message.status}</span>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <Separator className="mx-8" />

                    {/* Content Section */}
                    <div className="px-8 py-6 space-y-6">
                        {/* Full Message Card */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Full Intelligence Report
                                </h3>
                            </div>

                            <div className="relative group">
                                {/* Gradient Border Effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border backdrop-blur-sm">
                                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">
                                        {message.message_text}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/0 border border-blue-500/10">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                    Channel
                                </div>
                                <div className="text-sm font-bold text-foreground capitalize">
                                    {message.channel}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/10">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                    Engagement
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {viewsFormatted}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/0 border border-purple-500/10">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                    Priority
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                    {message.status}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 bg-muted/20 border-t border-border">
                        <div className="flex items-center gap-3">
                            <Button
                                size="lg"
                                className="flex-1 gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                                onClick={() => window.open(`https://t.me/${message.source}`, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4" />
                                View on Telegram
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
