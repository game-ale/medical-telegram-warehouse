import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Product {
    keyword: string;
    frequency: number;
}

export function TrendingProductsWidget({ products }: { products: Product[] }) {
    // Limit to top 5
    const topProducts = products.slice(0, 5);
    const maxFreq = Math.max(...topProducts.map(p => p.frequency), 1);

    return (
        <Card className="col-span-3 border-border bg-card shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Top 5 Trending Products</CardTitle>
                        <CardDescription>Most frequently mentioned keywords this month.</CardDescription>
                    </div>
                    <Link href="/trends" className="text-xs text-indigo-400 hover:text-indigo-300">View All</Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-5">
                    {topProducts.map((product) => (
                        <div key={product.keyword} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground capitalize">{product.keyword}</span>
                                </div>
                                <span className="text-muted-foreground text-xs">{product.frequency} mentions</span>
                            </div>
                            <Progress
                                value={(product.frequency / maxFreq) * 100}
                                className="h-1.5 bg-muted"
                                indicatorColor="bg-sky-500"
                            />
                        </div>
                    ))}
                    {topProducts.length === 0 && (
                        <div className="text-center text-muted-foreground text-sm py-4">No trending data available.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
