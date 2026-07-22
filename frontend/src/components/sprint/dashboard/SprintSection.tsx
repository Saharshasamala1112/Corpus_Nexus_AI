import type { ReactNode } from "react";

interface SprintSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export default function SprintSection({
    title,
    children,
    className = "",
}: SprintSectionProps) {
    return (
        <section className={`space-y-3 ${className}`}>
            <h3 className="text-base font-semibold text-slate-700">{title}</h3>

            <div className="text-sm leading-6 text-slate-600">{children}</div>
        </section>
    );
}
