import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { PipelineDAG } from "@/components/dashboard/PipelineDAG";
import { ReportCard } from "@/components/dashboard/ReportCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { TriggerButton } from "@/components/dashboard/TriggerButton";
import { api } from "@/lib/api";

export default async function DashboardPage() {
    const stats = await api.getStats();

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Dashboard</h2>
                        <span className="inline-flex items-center rounded-md bg-emerald-400/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live
                        </span>
                    </div>
                    <p className="text-zinc-500 mt-1">Monitor your data pipeline performance and health.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <TriggerButton />
                </div>
            </div>

            <DashboardStats {...stats} />


            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ActivityChart />
                <ReportCard />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <TrendChart />
                <PipelineDAG />
            </div>
        </div>
    );
}
