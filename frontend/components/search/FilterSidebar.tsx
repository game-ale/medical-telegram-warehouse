"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { useState } from "react";

export function FilterSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const channels = [
        { id: "telegram", label: "Telegram" },
        { id: "tiktok", label: "TikTok Ethiopia" },
        { id: "facebook", label: "Facebook" },
        { id: "addis_media", label: "Addis Media" },
        { id: "doctors_online", label: "Doctors Online" },
    ];

    const attachments = [
        { id: "images", label: "Images" },
        { id: "pdfs", label: "PDFs" },
        { id: "links", label: "Links" },
    ];

    if (collapsed) {
        return (
            <div className="w-12 flex flex-col items-center py-6 border-r border-border bg-background transition-all">
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} className="text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <aside className="w-64 flex flex-col min-h-screen border-r border-border bg-background py-6 px-5 transition-all sticky top-0">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filter Intelligence</h3>
                <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="text-muted-foreground hover:text-foreground h-7 w-7">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            <div className="space-y-8 flex-1">
                {/* Date Range Section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">Date Range</label>
                    <div className="space-y-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-9 bg-muted/20 border-border text-xs",
                                        !startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                    {startDate ? format(startDate, "PPP") : "Start Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    className="bg-zinc-950 text-zinc-300"
                                />
                            </PopoverContent>
                        </Popover>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-9 bg-muted/20 border-border text-xs",
                                        !endDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                    {endDate ? format(endDate, "PPP") : "End Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    className="bg-popover text-popover-foreground"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <Separator className="bg-zinc-900" />

                {/* Channels Section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">Pulse Channels</label>
                    <div className="space-y-3">
                        {channels.map((channel) => (
                            <div key={channel.id} className="flex items-center space-x-2.5 group">
                                <Checkbox id={channel.id} className="border-border bg-muted/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
                                <label
                                    htmlFor={channel.id}
                                    className="text-xs font-medium text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                                >
                                    {channel.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-zinc-900" />

                {/* Attachment Type Section */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 block">Intelligence Type</label>
                    <div className="space-y-3">
                        {attachments.map((type) => (
                            <div key={type.id} className="flex items-center space-x-2.5 group">
                                <Checkbox id={type.id} className="border-border bg-muted/20 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" />
                                <label
                                    htmlFor={type.id}
                                    className="text-xs font-medium text-muted-foreground group-hover:text-foreground cursor-pointer transition-colors"
                                >
                                    {type.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 group">
                    <FilterX className="mr-2 h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    Reset All Filters
                </Button>
            </div>
        </aside>
    );
}
