import type { ReactNode } from "react";

import { SprintHeader } from "./SprintHeader";
import { SprintSidebar } from "./SprintSidebar";
import { cn } from "@/lib/utils";

type SprintLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
};

export function SprintLayout({
    children,
    title = "Sprint Overview",
    subtitle = "Track progress and move faster",
    className,
}: SprintLayoutProps) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(135deg,_#030711_0%,_#07111f_45%,_#030711_100%)] text-slate-100">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
                <div className="w-full lg:w-72 lg:shrink-0">
                    <SprintSidebar />
                </div>

                <div className="flex min-h-screen flex-1 flex-col">
                    <SprintHeader title={title} subtitle={subtitle} />
                    <main
                        className={cn(
                            "flex-1 overflow-auto p-4 sm:p-6 lg:p-8",
                            className
                        )}
                    >
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur sm:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default SprintLayout;
