import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
    theme: ThemePreference;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
    if (typeof window === "undefined") {
        return "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemePreference>(() => {
        if (typeof window === "undefined") {
            return "dark";
        }

        return (window.localStorage.getItem("theme") as ThemePreference | null) ?? "dark";
    });
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => getSystemTheme());

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.localStorage.setItem("theme", theme);

        const updateTheme = () => {
            const nextTheme = theme === "system" ? getSystemTheme() : theme;
            const resolved = nextTheme === "dark" ? "dark" : "light";
            setResolvedTheme(resolved);
            document.documentElement.classList.toggle("dark", resolved === "dark");
            document.documentElement.classList.toggle("light", resolved === "light");
            document.documentElement.style.colorScheme = resolved;
            document.documentElement.dataset.theme = resolved;
        };

        updateTheme();

        if (theme !== "system") {
            return undefined;
        }

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const listener = () => updateTheme();

        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener("change", listener);
            return () => mediaQuery.removeEventListener("change", listener);
        }

        mediaQuery.addListener(listener);
        return () => mediaQuery.removeListener(listener);
    }, [theme]);

    const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}

export { ThemeProvider, useTheme };
export type { ThemePreference };
