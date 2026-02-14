import { TrendChart } from "@/components/dashboard/TrendChart";
import { ProductList } from "@/components/trends/ProductList";
import { api } from "@/lib/api";

export default async function TrendsPage() {
    const topProducts = await api.getTopProducts();

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Product Trends</h2>
                    <p className="text-zinc-500 mt-1">Analyze identifying keyword frequency and medical product popularity.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <TrendChart />
                </div>
                <div className="col-span-3">
                    <ProductList products={topProducts} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">Rising Stars ✨</h3>
                    <p className="text-zinc-400 text-sm">Products with &gt;50% growth in mentions this week.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Amoxicillin', 'Disposable Masks', 'Surgical Gloves'].map(tag => (
                            <span key={tag} className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs border border-indigo-500/20">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">Declining Interest 📉</h3>
                    <p className="text-zinc-400 text-sm">Keywords dropping in frequency.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Chloroquine', 'Hand Sanitizer'].map(tag => (
                            <span key={tag} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">{tag}</span>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">New Arrivals 🆕</h3>
                    <p className="text-zinc-400 text-sm">First time mentions in the last 24h.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {['Vitamin C 1000mg', 'Pulse Oximeter'].map(tag => (
                            <span key={tag} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
