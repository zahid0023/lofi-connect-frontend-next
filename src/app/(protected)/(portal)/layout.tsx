import { SidebarProvider } from "@/components/ui/sidebar";
import { PortalHeader } from "@/layouts/portal/portal-header";
import { PortalSidebar } from "@/layouts/portal/portal-sidebar";

export default function PortalLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <PortalSidebar />
                <div className="flex flex-1 flex-col">
                    <PortalHeader />
                    <main className="flex-1 overflow-auto bg-muted/30 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}