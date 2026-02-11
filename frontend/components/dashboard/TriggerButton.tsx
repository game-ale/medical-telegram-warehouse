"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TriggerButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleTrigger = async () => {
        setIsLoading(true);
        try {
            await fetch('/api/trigger', { method: 'POST' });
            // Simulating delay for UX
            await new Promise(r => setTimeout(r, 1000));
            router.refresh();
        } catch (e) {
            console.error("Failed to trigger pipeline");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleTrigger}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Play className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Starting..." : "Trigger New Run"}
        </Button>
    );
}
