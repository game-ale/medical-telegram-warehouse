"use client";

import { cn } from "@/lib/utils";
import { Activity, Clock, FileText, GitGraph, LayoutDashboard, Settings } from "lucide-react";
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
                                    ? "bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-800"
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
            <div className="px-3 py-2">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-900">
                    <h4 className="text-xs font-semibold text-zinc-400 mb-2">System Status</h4>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-zinc-300">Operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
