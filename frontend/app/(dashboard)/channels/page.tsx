import { ChannelTable } from "@/components/channels/ChannelTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { BarChart3, Users } from "lucide-react";

export default async function ChannelsPage() {
    // Fetch stats for key channels
    const channelNames = ["CheMed123", "DoctorsET", "EAHCI", "lobelia4cosmetics", "yenehealth"];
    const channels = await Promise.all(
        channelNames.map(name => api.getChannelActivity(name))
    );

    // Filter out nulls/errors
    const validChannels = channels.filter(c => c && c.channel_name);

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Channel Performance</h2>
                    <p className="text-zinc-500 mt-1">Cross-channel analytics and engagement metrics.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Channels</CardTitle>
                        <Users className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{validChannels.length}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Top Performer</CardTitle>
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">DoctorsET</div>
                        <p className="text-xs text-zinc-500">Highest Avg Views</p>
                    </CardContent>
                </Card>
            </div>

            <ChannelTable channels={validChannels} />
        </div>
    );
}
