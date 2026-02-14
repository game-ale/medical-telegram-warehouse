import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText, HardDrive } from "lucide-react";

export default function ReportsPage() {
    const reports = [
        {
            category: "Executive Summaries",
            items: [
                { name: "Monthly Performance Report", date: "Feb 1, 2026", size: "2.4 MB", type: "PDF" },
                { name: "Weekly Executive Brief", date: "Feb 8, 2026", size: "1.1 MB", type: "PDF" },
            ]
        },
        {
            category: "Data Exports",
            items: [
                { name: "Full Raw Message Export", date: "Daily", size: "450 MB", type: "CSV" },
                { name: "Processed YOLO Detections", date: "Daily", size: "125 MB", type: "JSON" },
            ]
        },
        {
            category: "Audit Logs",
            items: [
                { name: "System Access Log", date: "Live", size: "56 KB", type: "TXT" },
                { name: "Pipeline Error Log", date: "Live", size: "12 KB", type: "TXT" },
            ]
        }
    ];

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Reports Center</h2>
                    <p className="text-zinc-500 mt-1">Access generated insights, data exports, and audit logs.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reports.map((section, idx) => (
                    <Card key={idx} className="bg-zinc-900/50 border-zinc-800 h-full">
                        <CardHeader>
                            <CardTitle className="text-zinc-200 flex items-center gap-2">
                                {section.category === "Executive Summaries" && <FileText className="h-4 w-4 text-indigo-500" />}
                                {section.category === "Data Exports" && <HardDrive className="h-4 w-4 text-emerald-500" />}
                                {section.category === "Audit Logs" && <Calendar className="h-4 w-4 text-amber-500" />}
                                {section.category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/20 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200 group cursor-pointer">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{item.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className="px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-800">{item.type}</span>
                                            <span>{item.date} • {item.size}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
