"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { History, Loader2, Search, X } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
    onSearch: (query: string) => void;
    loading: boolean;
}

export function SearchInput({ onSearch, loading }: SearchInputProps) {
    const [value, setValue] = useState("");
    const [recentSearches, setRecentSearches] = useState(["Insulin shortage", "Amoxicillin prices", "Vaccine stock", "Bole pharmacies"]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    const removeRecent = (text: string) => {
        setRecentSearches(recentSearches.filter(s => s !== text));
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors duration-300" />
                <Input
                    placeholder="Search market intelligence (e.g. shortages, price fluctuations, new arrivals)..."
                    className="h-16 pl-14 pr-32 bg-background border-border text-lg text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-0 rounded-2xl shadow-2xl transition-all duration-300 group-hover:border-border/80"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <Button
                    type="submit"
                    disabled={loading || !value.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white dark:text-zinc-100 font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 border-none"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search Market"}
                </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-zinc-600 mr-2">
                    <History className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Context</span>
                </div>
                {recentSearches.map((search) => (
                    <div
                        key={search}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/20 border border-border hover:border-border/80 cursor-pointer group transition-all"
                        onClick={() => { setValue(search); onSearch(search); }}
                    >
                        <span className="text-xs text-muted-foreground group-hover:text-foreground">{search}</span>
                        <X
                            className="h-3 w-3 text-zinc-600 hover:text-red-400 transition-colors"
                            onClick={(e) => { e.stopPropagation(); removeRecent(search); }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
