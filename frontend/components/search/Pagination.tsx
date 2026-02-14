"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between py-8">
            <p className="text-xs text-muted-foreground font-medium tracking-tight">
                Showing page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="bg-background border-border hover:bg-muted text-muted-foreground h-8 px-3 text-xs"
                >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                </Button>

                <div className="flex items-center gap-1 mx-2">
                    {pages.map((p) => (
                        <Button
                            key={p}
                            variant={p === currentPage ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => onPageChange(p)}
                            className={`h-8 w-8 p-0 text-xs font-bold transition-all ${p === currentPage
                                ? "bg-indigo-600 text-white dark:text-zinc-100 border-indigo-600 shadow-lg shadow-indigo-500/20"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {p}
                        </Button>
                    ))}
                    {totalPages > 5 && <span className="text-muted-foreground/30 mx-1">...</span>}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="bg-background border-border hover:bg-muted text-muted-foreground h-8 px-3 text-xs"
                >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
            </div>
        </div>
    );
}
