import { SearchInterface } from "@/components/search/SearchInterface";

export default function SearchPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Search</h2>
                    <p className="text-zinc-500 mt-1">Deep dive into millions of medical telegram messages.</p>
                </div>
            </div>

            <SearchInterface />
        </div>
    );
}
