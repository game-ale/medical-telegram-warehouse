import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative bg-black text-white">
            <div className="hidden h-full md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-64 h-full bg-black">
                <div className="h-full p-8 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
