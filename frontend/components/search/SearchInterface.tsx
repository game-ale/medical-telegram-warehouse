"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

interface Message {
    message_id: number;
    channel_name: string;
    message_date: string;
    message_text: string;
    view_count: number;
}

export function SearchInterface() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setHasSearched(true);

        // We need to call the API via a server action or client-side fetch wrapper.
        // Since we are in a client component, we can use the relative path proxy if set up,
        // or effectively just use the api.searchMessages logic but adopted for client.
        // Wait, api.ts handles client/server logic. Let's try calling it directly.
        // Issue: api.ts functions are async.

        const data = await api.searchMessages(query);
        setResults(data.data || []);
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col items-center space-y-4 text-center py-8">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-500 text-transparent bg-clip-text">
                    Search Intelligence
                </h1>
                <p className="text-zinc-400 max-w-xl">
                    Deep dive into millions of medical telegram messages to find trends, product mentions, and public sentiment.
                </p>
            </div>

            <div className="bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-sm">
                <form onSubmit={handleSearch} className="flex gap-2 p-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        <Input
                            placeholder="Search for keywords (e.g., 'vaccine', 'price')..."
                            className="pl-12 h-12 bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500 text-lg rounded-xl transition-all"
                            value={query}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading || !query.trim()} className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 font-medium text-base">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                        Search
                    </Button>
                </form>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <Table className="table-fixed w-full">
                        <TableHeader className="bg-zinc-950/50">
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-400 pl-6 h-12 w-[120px]">Date</TableHead>
                                <TableHead className="text-zinc-400 h-12 w-[180px]">Channel</TableHead>
                                <TableHead className="text-zinc-400 h-12">Message content</TableHead>
                                <TableHead className="text-right text-zinc-400 pr-6 h-12 w-[100px]">Views</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.length > 0 ? (
                                results.map((msg) => (
                                    <TableRow key={`${msg.channel_name}-${msg.message_id}`} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
                                        <TableCell className="text-zinc-500 whitespace-nowrap pl-6 py-4 font-mono text-xs">
                                            {new Date(msg.message_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="h-6 w-6 shrink-0 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                                    {msg.channel_name[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-indigo-300 font-medium text-xs truncate">@{msg.channel_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-300 py-4">
                                            <div className="line-clamp-2 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-200 transition-colors pr-4" title={msg.message_text}>
                                                {msg.message_text}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-500 pr-6 py-4 font-mono text-xs">
                                            {msg.view_count?.toLocaleString() || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-64 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                                                    <p className="animate-pulse">Searching Telegram archives...</p>
                                                </>
                                            ) : hasSearched ? (
                                                <>
                                                    <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-2">
                                                        <Search className="h-8 w-8 text-zinc-600" />
                                                    </div>
                                                    <p className="text-lg text-zinc-400">No matches found for "<span className="text-white">{query}</span>"</p>
                                                    <p className="text-sm">Try checking your spelling or using different keywords.</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-16 w-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-2">
                                                        <Search className="h-8 w-8 text-zinc-600" />
                                                    </div>
                                                    <p className="text-lg text-zinc-400">Enter a keyword to explore medical insights.</p>
                                                    <p className="text-sm max-w-md mx-auto">
                                                        Try searching for product names like <span className="text-indigo-400">"Enfagrow"</span>,
                                                        locations like <span className="text-indigo-400">"Bole"</span>, or medical terms.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
