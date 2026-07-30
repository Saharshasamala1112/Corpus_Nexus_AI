interface LogoProps {
    collapsed?: boolean;
}

function Logo({ collapsed = false }: LogoProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--app-accent),var(--app-accent-soft))] shadow-lg shadow-[color:var(--app-accent-soft)]">
                <span className="text-sm font-semibold tracking-wide text-[var(--app-strong)]">CN</span>
            </div>
            {!collapsed ? (
                <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight text-[var(--app-text)]">
                        Corpus Nexus
                    </p>
                    <p className="text-xs font-medium text-[var(--app-accent)]">v3.6</p>
                </div>
            ) : null}
        </div>
    );
}

export default Logo;
