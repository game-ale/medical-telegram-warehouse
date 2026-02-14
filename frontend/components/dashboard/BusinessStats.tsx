import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, BarChart3, FileText, ImageIcon, Megaphone } from "lucide-react";

interface BusinessStatsProps {
    total_posts: number;
    active_channels: number;
    products_mentioned: number;
    visual_content_rate: number;
    total_posts_growth: number;
    active_channels_growth: number;
    products_growth: number;
    visual_rate_growth: number;
}

export function BusinessStats(props: BusinessStatsProps) {
    const cards = [
        {
            title: "Total Posts",
            value: props.total_posts.toLocaleString(),
            icon: FileText,
            change: props.total_posts_growth,
            color: "text-blue-500"
        },
        {
            title: "Active Channels",
            value: props.active_channels.toLocaleString(),
            icon: Megaphone,
            change: props.active_channels_growth,
            color: "text-purple-500"
        },
        {
            title: "Products Mentioned",
            value: props.products_mentioned.toLocaleString(),
            icon: BarChart3,
            change: props.products_growth,
            color: "text-emerald-500"
        },
        {
            title: "Visual Content Rate",
            value: `${props.visual_content_rate}%`,
            icon: ImageIcon,
            change: props.visual_rate_growth,
            color: "text-amber-500"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <Card key={card.title} className="bg-card border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{card.value}</div>
                        <div className="flex items-center text-xs mt-1">
                            {card.change >= 0 ? (
                                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                            ) : (
                                <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                            )}
                            <span className={card.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                                {Math.abs(card.change)}%
                            </span>
                            <span className="text-muted-foreground ml-1">vs last period</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
