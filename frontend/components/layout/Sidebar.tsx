"use client";

import { cn } from "@/lib/utils";
import { Activity, Clock, FileBarChart, FileText, GitGraph, Image, LayoutDashboard, Search, Settings, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-zinc-100",
    },
    {
        label: "Pipelines",
        icon: GitGraph,
        href: "/pipelines",
        color: "text-zinc-400",
    },
    {
        label: "Runs",
        icon: Activity,
        href: "/runs",
        color: "text-zinc-400",
    },
    {
        label: "Schedules",
        icon: Clock,
        href: "/schedules",
        color: "text-zinc-400",
    },
    {
        label: "Logs",
        icon: FileText,
        href: "/logs",
        color: "text-zinc-400",
    },
    {
        label: "Product Trends",
        icon: TrendingUp,
        href: "/trends",
        color: "text-zinc-400",
    },
    {
        label: "Channels",
        icon: Users,
        href: "/channels",
        color: "text-zinc-400",
    },
    {
        label: "Visual Content",
        icon: Image,
        href: "/visuals",
        color: "text-zinc-400",
    },
    {
        label: "Search",
        icon: Search,
        href: "/search",
        color: "text-zinc-400",
    },
    {
        label: "Reports",
        icon: FileBarChart,
        href: "/reports",
        color: "text-zinc-400",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-zinc-400",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-950 border-r border-zinc-900">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-10">
                    <Activity className="h-6 w-6 text-indigo-500 mr-2" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 text-transparent bg-clip-text">
                        PulseOps
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-900 rounded-md transition-all duration-200",
                                pathname === route.href
                                    ? "bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20"
                                    : "text-zinc-500 hover:text-white"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-4 w-4 mr-3", pathname === route.href ? "text-indigo-400" : route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


            <div className="px-3 py-2 border-t border-zinc-900 mt-auto">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-900 cursor-pointer transition-colors">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        DA
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">Dr. Amani</p>
                        <p className="text-xs text-zinc-500 truncate">Analyst</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
