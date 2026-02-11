import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Calendar, Clock, Power } from "lucide-react";

export default async function SchedulesPage() {
    const schedules = await api.getSchedules();

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Schedules</h2>
                    <p className="text-zinc-500 mt-1">Automated execution triggers.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schedules.map((schedule: any) => (
                    <Card key={schedule.name} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg text-zinc-200">{schedule.name}</CardTitle>
                            <Badge variant="outline" className={schedule.scheduleState?.status === 'RUNNING' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/30' : 'text-zinc-500'}>
                                {schedule.scheduleState?.status === 'RUNNING' ? 'Active' : 'Paused'}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm text-zinc-400">
                                    <Clock className="mr-2 h-4 w-4 text-indigo-400" />
                                    Cron: <span className="ml-2 font-mono text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded">{schedule.cronSchedule}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-400">
                                    <Calendar className="mr-2 h-4 w-4 text-pink-400" />
                                    Target: <span className="ml-2 text-zinc-200">{schedule.pipelineName}</span>
                                </div>
                                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">Next run in 12 hours</span>
                                    {/* Toggle would go here */}
                                    <Power className={`h-4 w-4 ${schedule.scheduleState?.status === 'RUNNING' ? 'text-emerald-500' : 'text-zinc-600'}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
