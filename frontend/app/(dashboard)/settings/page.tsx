import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Settings</h2>
                    <p className="text-zinc-500 mt-1">Configure system parameters and connections.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-200">Connection Settings</CardTitle>
                        <CardDescription className="text-zinc-500">Manage connections to Dagster and FastAPI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">Dagster GraphQL URL</label>
                            <div className="flex w-full items-center space-x-2">
                                <div className="flex-1 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-300">
                                    http://127.0.0.1:3000/graphql
                                </div>
                                <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-950/30">Connected</Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-400">FastAPI Endpoint</label>
                            <div className="flex w-full items-center space-x-2">
                                <div className="flex-1 rounded-md border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-300">
                                    http://127.0.0.1:8000/api
                                </div>
                                <Badge variant="outline" className="text-emerald-400 border-emerald-900 bg-emerald-950/30">Connected</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-zinc-200">Dashboard Preferences</CardTitle>
                        <CardDescription className="text-zinc-500">Customize your viewing experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium text-zinc-200">Auto-Refresh</label>
                                <p className="text-sm text-zinc-500">Automatically reload data every 30s.</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-indigo-600 relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-zinc-800 p-4">
                            <div className="space-y-0.5">
                                <label className="text-base font-medium text-zinc-200">Notifications</label>
                                <p className="text-sm text-zinc-500">Alert on pipeline failure.</p>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-indigo-600 relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button className="bg-white text-black hover:bg-zinc-200">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
