import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

function PageContainer({ children }: Props) {
    return (
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.16),_transparent_32%),linear-gradient(180deg,var(--app-gradient-from)_0%,var(--app-gradient-via)_50%,var(--app-gradient-to)_100%)] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
    );
}

export default PageContainer;