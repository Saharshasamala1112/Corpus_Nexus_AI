import { useState } from "react";
import Navbar from "./Navbar";
import PageContainer from "./PageContainer";
import Sidebar from "./Sidebar";

interface Props {
    children: React.ReactNode;
}

function MainLayout({ children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggleCollapse={() => setCollapsed((value) => !value)}
                onCloseMobile={() => setMobileOpen(false)}
            />

            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            ) : null}

            <div className={`flex min-h-screen flex-col transition-all duration-200 ${collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"}`}>
                <Navbar
                    onOpenMobile={() => setMobileOpen(true)}
                    collapsed={collapsed}
                />
                <PageContainer>{children}</PageContainer>
            </div>
        </div>
    );
}

export default MainLayout;