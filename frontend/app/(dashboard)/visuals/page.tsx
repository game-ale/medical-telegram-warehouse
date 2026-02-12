import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryChart } from "@/components/visuals/CategoryChart";
import { api } from "@/lib/api";
import { Image as ImageIcon, Layers, PieChart } from "lucide-react";

export default async function VisualsPage() {
    const visualStats = await api.getVisualContentStats();

    // Calculate totals
    const totalImages = visualStats.reduce((acc: number, curr: any) => acc + curr.count, 0);
    const topCategory = visualStats.sort((a: any, b: any) => b.count - a.count)[0]?.image_category || 'N/A';

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 text-transparent bg-clip-text">Visual Content</h2>
                    <p className="text-zinc-500 mt-1">AI-powered analysis of channel imagery (YOLOv8).</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Processed Images</CardTitle>
                        <ImageIcon className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalImages}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Dominant Category</CardTitle>
                        <Layers className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white capitalize">{topCategory.replace('_', ' ')}</div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Detection Model</CardTitle>
                        <PieChart className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">YOLOv8</div>
                        <p className="text-xs text-zinc-500">Object Detection</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <CategoryChart data={visualStats} />
                </div>
                <div className="col-span-3 space-y-6">
                    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                        <h3 className="text-lg font-medium text-zinc-200 mb-4">Category Definitions</h3>
                        <div className="space-y-4">
                            <div className="flex space-x-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">Product Display</p>
                                    <p className="text-xs text-zinc-500">Clear images of medical products, packaging, or devices.</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">Promotional</p>
                                    <p className="text-xs text-zinc-500">Marketing materials, banners with text, or advertisements.</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <div className="h-2 w-2 mt-2 rounded-full bg-purple-500"></div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-300">Lifestyle</p>
                                    <p className="text-xs text-zinc-500">Human-centric images, doctor-patient interactions.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
