"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { ChevronDown, Loader2, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ChannelType } from "./ChannelBadge";
import { FilterSidebar } from "./FilterSidebar";
import { MessageDetailDialog } from "./MessageDetailDialog";
import { Pagination } from "./Pagination";
import { ResultCard } from "./ResultCard";
import { SearchHeader } from "./SearchHeader";
import { SearchInput } from "./SearchInput";

type SortOption = "Newest" | "Oldest" | "Most Impact";

export default function SearchMarketIntelligence() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("Newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSearch = async (val: string) => {
        setQuery(val);
        setLoading(true);
        setHasSearched(true);
        setCurrentPage(1);

        try {
            const data = await api.searchMessages(val);
            // Enhance data with mock fields for the prototype
            const enhancedData = (data.data || []).map((item: any) => ({
                ...item,
                title: item.message_text.split('\n')[0].substring(0, 60) || "Pharma Intelligence Update",
                summary: item.message_text.length > 200 ? item.message_text.substring(0, 200) + "..." : item.message_text,
                channel: "telegram" as ChannelType, // Default to telegram for now
                source: item.channel_name,
                timestamp: item.message_date,
                views: item.view_count || 0,
                status: (["Urgent", "Shortage", "Alert", "Neutral"] as const)[Math.floor(Math.random() * 4)],
            }));
            setResults(enhancedData);
        } catch (e) {
            console.error(e);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / 5) || 1;

    // Simulated pagination for the prototype
    const paginatedResults = useMemo(() => {
        const start = (currentPage - 1) * 5;
        return results.slice(start, start + 5);
    }, [results, currentPage]);

    return (
        <div className="h-full flex flex-col -m-8 bg-background">
            <SearchHeader />

            <div className="flex flex-1 overflow-hidden">
                <FilterSidebar />

                <main className="flex-1 overflow-y-auto px-10 py-10 scrollbar-hide bg-muted/10">
                    <div className="max-w-4xl mx-auto space-y-12 pb-20">
                        {/* Search Section */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Market Intelligence Search</h2>
                            <SearchInput onSearch={handleSearch} loading={loading} />
                        </div>

                        {/* Results Summary & Sorting */}
                        {hasSearched && (
                            <div className="flex items-center justify-between py-4 border-b border-border">
                                <p className="text-sm text-muted-foreground">
                                    Found <span className="text-foreground font-bold">{totalResults}</span> intelligence results for "<span className="text-indigo-600 dark:text-indigo-400">{query}</span>"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sort Intelligence</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 gap-2 bg-background border border-border text-xs text-foreground hover:bg-muted px-3">
                                                    {sortBy}
                                                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-popover border-border text-popover-foreground">
                                                <DropdownMenuItem onClick={() => setSortBy("Newest")} className="text-xs hover:bg-accent focus:bg-accent cursor-pointer">Newest</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSortBy("Oldest")} className="text-xs hover:bg-accent focus:bg-accent cursor-pointer">Oldest</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSortBy("Most Impact")} className="text-xs hover:bg-accent focus:bg-accent cursor-pointer">Most Impact</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/5 border border-border">
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Results List */}
                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-48 rounded-2xl bg-muted/20 border border-border animate-pulse flex flex-col p-6 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-5 w-24 bg-muted rounded-md" />
                                                <div className="h-5 w-32 bg-muted rounded-md" />
                                            </div>
                                            <div className="h-8 w-full bg-muted rounded-md" />
                                            <div className="h-12 w-full bg-muted rounded-md" />
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center justify-center py-20 text-indigo-400 gap-4">
                                        <Loader2 className="h-10 w-10 animate-spin" />
                                        <span className="text-sm font-medium animate-pulse tracking-widest uppercase">Analyzing Pulse Archives...</span>
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                <>
                                    <div className="space-y-4">
                                        {paginatedResults.map((result, idx) => (
                                            <ResultCard
                                                key={idx}
                                                title={result.title}
                                                summary={result.summary}
                                                channel={result.channel}
                                                source={result.source}
                                                timestamp={result.message_date}
                                                views={result.view_count}
                                                status={result.status}
                                                onClick={() => {
                                                    setSelectedMessage(result);
                                                    setDialogOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            ) : hasSearched ? (
                                <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                                    <div className="h-20 w-20 rounded-full bg-background border border-border flex items-center justify-center shadow-2xl">
                                        <SearchIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-foreground">No Intelligence Matches</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                                            We couldn't find any message logs matching "<span className="text-indigo-400 font-semibold">{query}</span>".
                                            Try broadening your search terms or adjusting the pulse filters.
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => setHasSearched(false)}
                                        className="bg-background border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                                    >
                                        Back to Discovery
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-40 text-center space-y-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
                                        <div className="relative h-24 w-24 rounded-3xl bg-background border border-border/50 flex items-center justify-center shadow-inner overflow-hidden">
                                            <SearchIcon className="h-10 w-10 text-indigo-500/50" />
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold text-foreground tracking-tight">Predictive Search Active</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed font-medium">
                                            Enter a pharma keyword above to begin cross-channel market intelligence mapping.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 py-6">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Monitoring 12 Live Channels</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div >

            <MessageDetailDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                message={selectedMessage}
            />
        </div >
    );
}
