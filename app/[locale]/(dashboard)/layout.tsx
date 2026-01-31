import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden w-full">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50 p-4 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}