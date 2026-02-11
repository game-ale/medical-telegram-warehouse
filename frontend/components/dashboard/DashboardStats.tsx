import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface StatsProps {
    totalRuns: number;
    successRate: number;
    avgDuration: string;
    lastRunStatus: string;
    lastRunTime: string;
}

export function DashboardStats({ totalRuns, successRate, avgDuration, lastRunStatus, lastRunTime }: StatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Runs</CardTitle>
                    <Activity className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{totalRuns}</div>
                    <p className="text-xs text-zinc-500">Lifetime executions</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Success Rate</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap" title={`${successRate}%`}>{successRate}%</div>
                    <p className="text-xs text-zinc-500">Reliability score</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Avg Duration</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{avgDuration}</div>
                    <p className="text-xs text-zinc-500">Per pipeline run</p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Last Run</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lastRunStatus === 'failure' ? 'text-red-500' : 'text-zinc-500'}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white capitalize">{lastRunStatus}</div>
                    <p className="text-xs text-zinc-500">{lastRunTime}</p>
                </CardContent>
            </Card>
        </div>
    );
}
