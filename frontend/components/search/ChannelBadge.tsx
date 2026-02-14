"use client";

import { Badge } from "@/components/ui/badge";
import { Facebook, Globe, MessageCircle, Triangle, Users } from "lucide-react";

export type ChannelType = "telegram" | "tiktok" | "facebook" | "addis_media" | "doctors_online" | "general";

interface ChannelBadgeProps {
    type: ChannelType;
}

export function ChannelBadge({ type }: ChannelBadgeProps) {
    const config = {
        telegram: { label: "Telegram", icon: MessageCircle, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
        tiktok: { label: "TikTok Ethiopia", icon: Triangle, color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
        facebook: { label: "Facebook", icon: Facebook, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
        addis_media: { label: "Addis Media", icon: Globe, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        doctors_online: { label: "Doctors Online", icon: Users, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
        general: { label: "General", icon: MessageCircle, color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    };

    const { label, icon: Icon, color } = config[type] || config.general;

    return (
        <Badge variant="outline" className={`${color} flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-[10px] uppercase tracking-wider transition-all hover:brightness-110`}>
            <Icon className="h-3 w-3" />
            {label}
        </Badge>
    );
}
