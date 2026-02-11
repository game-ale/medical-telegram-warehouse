"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogEntry } from "@/lib/types";
import { format } from "date-fns";

interface LogViewerProps {
    logs: LogEntry[];
    className?: string;
}

export default function LogViewer({ logs, className }: LogViewerProps) {
    return (
        <div className={`rounded-md border border-zinc-800 bg-black font-mono text-sm ${className}`}>
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    <span className="ml-2 text-xs text-zinc-500 text-muted-foreground">terminal Output</span>
                </div>
                <Badge variant="outline" className="text-xs text-zinc-500 border-zinc-700">
                    Live
                </Badge>
            </div>
            <ScrollArea className="h-[500px] p-4">
                {logs.length === 0 ? (
                    <div className="text-zinc-500 text-center italic mt-20">Waiting for logs...</div>
                ) : (
                    <div className="space-y-1">
                        {logs.map((log) => (
                            <div key={log.id} className="flex gap-3 hover:bg-zinc-900/30 p-0.5 rounded">
                                <span className="text-zinc-600 shrink-0 select-none">
                                    {format(new Date(log.timestamp), 'HH:mm:ss')}
                                </span>
                                <div className="flex-1 break-all">
                                    {log.step && (
                                        <span className="mr-2 text-blue-400 font-bold">
                                            [{log.step}]
                                        </span>
                                    )}
                                    <span className={
                                        log.level === 'error' ? 'text-red-400' :
                                            log.level === 'warn' ? 'text-yellow-400' :
                                                'text-zinc-300'
                                    }>
                                        {log.message}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
