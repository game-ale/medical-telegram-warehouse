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
        color: "text-foreground",
    },
    {
        label: "Pipelines",
        icon: GitGraph,
        href: "/pipelines",
        color: "text-muted-foreground",
    },
    {
        label: "Runs",
        icon: Activity,
        href: "/runs",
        color: "text-muted-foreground",
    },
    {
        label: "Schedules",
        icon: Clock,
        href: "/schedules",
        color: "text-muted-foreground",
    },
    {
        label: "Logs",
        icon: FileText,
        href: "/logs",
        color: "text-muted-foreground",
    },
    {
        label: "Product Trends",
        icon: TrendingUp,
        href: "/trends",
        color: "text-muted-foreground",
    },
    {
        label: "Channels",
        icon: Users,
        href: "/channels",
        color: "text-muted-foreground",
    },
    {
        label: "Visual Content",
        icon: Image,
        href: "/visuals",
        color: "text-muted-foreground",
    },
    {
        label: "Search",
        icon: Search,
        href: "/search",
        color: "text-muted-foreground",
    },
    {
        label: "Reports",
        icon: FileBarChart,
        href: "/reports",
        color: "text-muted-foreground",
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
        <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar border-r border-sidebar-border">
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
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-sidebar-accent rounded-md transition-all duration-200",
                                pathname === route.href
                                    ? "bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-500/20"
                                    : "text-muted-foreground hover:text-foreground"
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


            <div className="px-3 py-2 border-t border-sidebar-border mt-auto">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        DA
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">Dr. Amani</p>
                        <p className="text-xs text-muted-foreground truncate">Analyst</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
