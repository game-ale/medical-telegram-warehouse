"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";

export function ReportCard() {
    return (
        <Card className="col-span-3 border-zinc-800 bg-zinc-900/50">
            <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                    Download latest analysis.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {[
                    { name: "Monthly Executive Summary", date: "Feb 2026", size: "2.4 MB" },
                    { name: "Keyword Trend Analysis", date: "Jan 2026", size: "1.1 MB" },
                    { name: "Channel Performance Audit", date: "Jan 2026", size: "4.5 MB" }
                ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40 hover:bg-zinc-800/50 transition-colors group cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400 group-hover:text-indigo-300">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-200">{report.name}</p>
                                <p className="text-xs text-zinc-500">{report.date} • {report.size}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
