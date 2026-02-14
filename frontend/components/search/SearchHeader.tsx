"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search as SearchIcon } from "lucide-react";

export function SearchHeader() {
    return (
        <header className="h-16 border-b border-zinc-800 bg-background/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <SearchIcon className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-foreground italic">PharmaIntel Ethiopia</span>
                </div>

                <div className="h-4 w-px bg-zinc-800" />

                <h1 className="text-sm font-semibold text-muted-foreground">Search Market Intelligence</h1>
            </div>

            <div className="flex items-center gap-4">
                <ModeToggle />
                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/5 relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-500 border border-black" />
                </Button>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right flex flex-col -space-y-0.5">
                        <span className="text-xs font-bold text-zinc-200">Dr. Amani</span>
                        <span className="text-[10px] text-zinc-500 font-medium">Chief Analyst</span>
                    </div>
                    <Avatar className="h-8 w-8 ring-2 ring-zinc-800 ring-offset-2 ring-offset-black">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">DA</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
