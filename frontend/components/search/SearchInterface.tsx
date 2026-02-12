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
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search for keywords (e.g., 'vaccine', 'delivery')..."
                        className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={loading || !query.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                </Button>
            </form>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400 pl-6">Date</TableHead>
                            <TableHead className="text-zinc-400">Channel</TableHead>
                            <TableHead className="text-zinc-400 w-[50%]">Message snippet</TableHead>
                            <TableHead className="text-right text-zinc-400 pr-6">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.length > 0 ? (
                            results.map((msg) => (
                                <TableRow key={`${msg.channel_name}-${msg.message_id}`} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <TableCell className="text-zinc-400 whitespace-nowrap pl-6">
                                        {new Date(msg.message_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-indigo-400 font-medium">@{msg.channel_name}</TableCell>
                                    <TableCell className="text-zinc-300">
                                        <div className="line-clamp-2 text-sm" title={msg.message_text}>
                                            {msg.message_text}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-zinc-500 pr-6">
                                        {msg.view_count?.toLocaleString() || '-'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center text-zinc-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                                                <p>Searching Telegram archives...</p>
                                            </>
                                        ) : hasSearched ? (
                                            <>
                                                <Search className="h-8 w-8 text-zinc-700" />
                                                <p>No matches found for "{query}".</p>
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-8 w-8 text-zinc-800" />
                                                <p>Enter a keyword to explore medical insights.</p>
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
    );
}
