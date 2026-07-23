interface LogoProps {
    collapsed?: boolean;
}

function Logo({ collapsed = false }: LogoProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 shadow-lg shadow-violet-950/30">
                <span className="text-sm font-semibold tracking-wide text-white">CN</span>
            </div>
            {!collapsed ? (
                <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight text-zinc-100">
                        Corpus Nexus
                    </p>
                    <p className="text-xs font-medium text-violet-400">v3.6</p>
                </div>
            ) : null}
        </div>
    );
}

export default Logo;
