import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { GitBranch, Play, Settings } from "lucide-react";

export default async function PipelinesPage() {
    const pipelines = await api.getPipelines();

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Pipelines</h2>
                    <p className="text-zinc-500 mt-1">Manage and monitor your data workflows.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {pipelines.map((pipeline: any) => (
                    <Card key={pipeline.name} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-xl text-zinc-100 flex items-center gap-2">
                                    <GitBranch className="h-5 w-5 text-indigo-400" />
                                    {pipeline.name}
                                </CardTitle>
                                <CardDescription className="text-zinc-400">{pipeline.description || "No description provided."}</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-emerald-950/30 text-emerald-400 border-emerald-900">
                                Active
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mt-4">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    <Play className="mr-2 h-4 w-4" />
                                    Launch Run
                                </Button>
                                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configure
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
