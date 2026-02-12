import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp } from "lucide-react";

interface Product {
    keyword: string;
    frequency: number;
}

export function ProductList({ products }: { products: Product[] }) {
    const maxFreq = Math.max(...products.map(p => p.frequency), 1);

    return (
        <Card className="border-zinc-800 bg-zinc-900/50 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Top Trending Products</CardTitle>
                        <CardDescription>Based on mention frequency</CardDescription>
                    </div>
                    <TrendingUp className="h-4 w-4 text-indigo-500" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {products.map((p, i) => (
                        <div key={i} className="group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs text-zinc-400 font-mono">
                                        {i + 1}
                                    </div>
                                    <span className="text-zinc-200 font-medium capitalize group-hover:text-indigo-400 transition-colors">
                                        {p.keyword}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-white">{p.frequency.toLocaleString()}</span>
                                    <div className="flex items-center text-emerald-500 text-xs">
                                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                        {((p.frequency / maxFreq) * 12 + Math.random() * 5).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            <Progress value={(p.frequency / maxFreq) * 100} className="h-1.5 bg-zinc-800" indicatorColor="bg-gradient-to-r from-indigo-500 to-cyan-400" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
