import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { format } from "date-fns";

export default async function RunsPage() {
    const runs = await api.getRecentRuns();

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Run History</h2>
                    <p className="text-zinc-500 mt-1">Audit log of all pipeline executions.</p>
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900">
                            <TableHead className="text-zinc-400">Run ID</TableHead>
                            <TableHead className="text-zinc-400">Pipeline</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400">Start Time</TableHead>
                            <TableHead className="text-zinc-400">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {runs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    No runs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            runs.map((run) => (
                                <TableRow key={run.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="font-mono text-xs text-zinc-500">{run.id.slice(0, 8)}</TableCell>
                                    <TableCell className="font-medium text-zinc-200">{run.pipelineName}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                            ${run.status === 'SUCCESS' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900' : ''}
                            ${run.status === 'FAILURE' ? 'bg-red-950/30 text-red-400 border-red-900' : ''}
                            ${run.status === 'STARTING' || run.status === 'RUNNING' ? 'bg-blue-950/30 text-blue-400 border-blue-900 animate-pulse' : ''}
                        `}
                                        >
                                            {run.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-400">
                                        {run.startTime !== 'N/A' ? format(new Date(run.startTime), 'MMM d, yyyy HH:mm:ss') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-zinc-400">
                                        {run.duration || '2m 15s'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
