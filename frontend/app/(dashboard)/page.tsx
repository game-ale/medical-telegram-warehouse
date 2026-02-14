import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { BusinessStats } from "@/components/dashboard/BusinessStats";
import { RecentChannelsWidget } from "@/components/dashboard/RecentChannelsWidget";
import { TrendingProductsWidget } from "@/components/dashboard/TrendingProductsWidget";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Bell, Calendar } from "lucide-react";

export default async function DashboardPage() {
    // Fetch all required data in parallel
    const summary = await api.getBusinessSummary();
    const activity = await api.getDailyActivity();
    const topProducts = await api.getTopProducts(5);
    const topChannels = await api.getTopChannels(5);

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <span>Dashboard</span>
                        <span>/</span>
                        <span className="text-foreground">Overview</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground text-transparent bg-clip-text">EthioMedIntel</h2>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted hidden sm:flex">
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 Days
                    </Button>
                    <Button variant="outline" size="icon" className="border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500"></span>
                    </Button>
                </div>
            </div>

            <BusinessStats {...(summary || {
                total_posts: 0,
                active_channels: 0,
                products_mentioned: 0,
                visual_content_rate: 0,
                total_posts_growth: 0,
                active_channels_growth: 0,
                products_growth: 0,
                visual_rate_growth: 0
            })} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <ActivityChart data={activity?.daily || []} />
                <TrendingProductsWidget products={topProducts} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-7">
                    <RecentChannelsWidget channels={topChannels} />
                </div>
            </div>
        </div>
    );
}
