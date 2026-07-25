import { useCallback, useEffect, useState } from "react";

import { getDashboard } from "@/services/dashboard";

import type { DashboardStats } from "@/services/dashboard/types";

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        projects: 0,
        members: 0,
        sprint_plans: 0,
        ai_suggestions: 0,
    });

    const [loading, setLoading] = useState(true);

    const refreshDashboard = useCallback(async () => {
        try {
            setLoading(true);

            const data = await getDashboard();

            setStats(data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshDashboard();
    }, [refreshDashboard]);

    return {
        stats,
        loading,
        refreshDashboard,
    };
}