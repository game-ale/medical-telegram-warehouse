"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Camera, Database, Globe, Search } from "lucide-react";

export function PipelineDAG() {
    return (
        <Card className="col-span-4 lg:col-span-3 bg-zinc-900 border-zinc-800">
            <CardHeader>
                <CardTitle className="text-zinc-200">Pipeline Architecture</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between py-12 px-6 overflow-x-auto">

                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 mb-2 shadow-lg">
                        <Globe className="h-6 w-6 text-cyan-400" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">Scrape</span>
                </div>

                <ArrowRight className="h-5 w-5 text-zinc-700" />

                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 mb-2 shadow-lg">
                        <Database className="h-6 w-6 text-green-400" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">Load</span>
                </div>

                <ArrowRight className="h-5 w-5 text-zinc-700" />

                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-xl bg-zinc-800 border-zinc-700 border mb-2 shadow-lg relative">
                        <div className="absolute -top-1 -right-1 h-2 w-2 bg-indigo-500 rounded-full animate-ping"></div>
                        <Search className="h-6 w-6 text-indigo-400" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400 font-bold">dbt Transform</span>
                </div>

                <ArrowRight className="h-5 w-5 text-zinc-700" />

                <div className="flex flex-col items-center">
                    <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 mb-2 shadow-lg">
                        <Camera className="h-6 w-6 text-amber-400" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500">YOLO</span>
                </div>

            </CardContent>
        </Card>
    );
}
