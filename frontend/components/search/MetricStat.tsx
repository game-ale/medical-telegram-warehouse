"use client";

import { AlertCircle, Eye, TrendingUp } from "lucide-react";

interface MetricStatProps {
    label: string;
    value: string | number;
    icon?: "views" | "impact" | "status";
    variant?: "default" | "warning" | "success" | "danger";
}

export function MetricStat({ label, value, icon, variant = "default" }: MetricStatProps) {
    const iconMap = {
        views: Eye,
        impact: TrendingUp,
        status: AlertCircle,
    };

    const variantMap = {
        default: "text-zinc-500 bg-zinc-500/5 border-zinc-500/10",
        warning: "text-amber-500 bg-amber-500/5 border-amber-500/10",
        success: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
        danger: "text-red-500 bg-red-500/5 border-red-500/10",
    };

    const Icon = icon ? iconMap[icon] : null;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${variantMap[variant]}`}>
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <div className="flex flex-col -space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest opacity-60 font-semibold">{label}</span>
                <span className="text-xs font-bold leading-tight tracking-tight">{value}</span>
            </div>
        </div>
    );
}
