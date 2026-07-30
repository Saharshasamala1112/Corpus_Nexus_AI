import { useEffect, useMemo, useState } from "react";
import {
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    FileText,
    Globe2,
    PencilLine,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AssistantPanel } from "@/components/aiAssistant";
import { useAuth } from "@/hooks/useauth";
import { getCurrentUser, getInstitution } from "@/services/authService";
import { getLeaderboard } from "@/services/leaderboardService";
import { getLanguages } from "@/services/languageService";
import { getRecords } from "@/services/recordsService";
import type { CorpusRecord } from "@/types/corpusExplorer";
import type { LucideIcon } from "lucide-react";

interface DashboardStat {
    label: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
    tone: string;
}

interface TodoTask {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

function deriveValue(record: Partial<CorpusRecord> | Record<string, unknown>, keys: string[]): string | null {
    const source = record as Record<string, unknown>;

    for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }
        if (typeof value === "number") {
            return String(value);
        }
    }

    return null;
}

function DashboardPage() {
    const { user } = useAuth();
    const [profileName, setProfileName] = useState(user?.username ?? "User");
    const [institutionName, setInstitutionName] = useState("Loading...");
    const [roleName, setRoleName] = useState("Intern");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [records, setRecords] = useState<CorpusRecord[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [contributors, setContributors] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<TodoTask[]>([]);
    const [taskInput, setTaskInput] = useState("");
    const [todoOpen, setTodoOpen] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    useEffect(() => {
        const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const storedTasks = window.localStorage.getItem("dashboard:tasks");
        if (storedTasks) {
            try {
                const parsed = JSON.parse(storedTasks) as TodoTask[];
                if (Array.isArray(parsed)) {
                    setTasks(parsed);
                }
            } catch {
                window.localStorage.removeItem("dashboard:tasks");
            }
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("dashboard:tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        async function loadDashboardData() {
            console.log("========== DASHBOARD DEBUG ==========");
            console.log("Dashboard mounted");
            console.log("User:", user);
            console.log("Token exists:", !!localStorage.getItem("access_token"));

            try {
                console.log("Calling dashboard APIs...");

                const [recordsData, languageData, leaderboardData, profileData] = await Promise.all([
                    getRecords(0, 1000) as Promise<Partial<CorpusRecord>[]>,
                    getLanguages(),
                    getLeaderboard().catch((err) => {
                        console.error("Leaderboard failed", err);
                        return [];
                    }),
                    getCurrentUser().catch((err) => {
                        console.error("Current user failed", err);
                        return null;
                    }),
                ]);

                console.log("Promise.all completed");
                console.log("recordsData", recordsData);
                console.log("languageData", languageData);
                console.log("leaderboardData", leaderboardData);
                console.log("profileData", profileData);

                setRecords(recordsData as CorpusRecord[]);
                setLanguages(languageData.map((item) => item.name));

                const contributorValues = new Set<string>();
                for (const record of recordsData as Partial<CorpusRecord>[]) {
                    const contributor = deriveValue(record, ["contributor", "contributor_name", "user_name", "created_by", "speaker", "owner", "annotator"]);
                    if (contributor) contributorValues.add(contributor);
                }

                const derivedContributors =
                    leaderboardData.length > 0 ? leaderboardData.length : contributorValues.size;

                setContributors(derivedContributors);

                if (profileData) {
                    setProfileName(profileData.username || user?.username || "User");
                    setRoleName(profileData.roles?.[0]?.name || "Intern");

                    if (profileData.institution_id) {
                        try {
                            console.log("Fetching institution", profileData.institution_id);
                            const institution = await getInstitution(profileData.institution_id);
                            console.log("Institution", institution);

                            setInstitutionName(
                                institution.college_name ||
                                institution.university_name ||
                                "Institution available"
                            );
                        } catch (err) {
                            console.error("Institution fetch failed", err);
                            setInstitutionName("Institution pending");
                        }
                    } else {
                        setInstitutionName("Institution not provided");
                    }
                }

                console.log("Dashboard loaded successfully");
            } catch (err) {
                console.error("Dashboard loading failed", err);
                setInstitutionName("Institution unavailable");
            } finally {
                console.log("Dashboard finished");
                setLoading(false);
            }
        }

        void loadDashboardData();
    }, [user?.username]);

    const chartData = useMemo(() => {
        const counts = new Map<string, number>();

        for (const record of records) {
            const label = deriveValue(record as Partial<CorpusRecord>, ["language"]) || "Unknown";
            if (label) {
                counts.set(label, (counts.get(label) ?? 0) + 1);
            }
        }

        return [...counts.entries()].sort(([, left], [, right]) => right - left).slice(0, 7).map(([name, value]) => ({ name, value }));
    }, [records]);

    const todoProgress = useMemo(() => {
        if (!tasks.length) {
            return 0;
        }

        const completed = tasks.filter((task) => task.completed).length;
        return Math.round((completed / tasks.length) * 100);
    }, [tasks]);

    const stats: DashboardStat[] = useMemo(() => [
        {
            label: "Total Records",
            value: records.length.toLocaleString(),
            subtitle: loading ? "Loading corpus data" : "Live corpus inventory",
            icon: FileText,
            tone: "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        },
        {
            label: "Contributors",
            value: contributors.toLocaleString(),
            subtitle: loading ? "Loading contributors" : "Active contributors",
            icon: Users,
            tone: "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        },
        {
            label: "Languages",
            value: languages.length.toLocaleString(),
            subtitle: loading ? "Loading languages" : "Available languages",
            icon: Globe2,
            tone: "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]",
        },
    ], [contributors, languages.length, loading, records]);

    function addTask() {
        const trimmed = taskInput.trim();
        if (!trimmed) {
            return;
        }

        if (editingTaskId) {
            setTasks((current) => current.map((task) => (task.id === editingTaskId ? { ...task, text: trimmed } : task)));
            setEditingTaskId(null);
        } else {
            setTasks((current) => [{ id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: new Date().toISOString() }, ...current]);
        }

        setTaskInput("");
    }

    function toggleTask(taskId: string) {
        setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
    }

    function startEditTask(task: TodoTask) {
        setEditingTaskId(task.id);
        setTaskInput(task.text);
    }

    function deleteTask(taskId: string) {
        setTasks((current) => current.filter((task) => task.id !== taskId));
        if (editingTaskId === taskId) {
            setEditingTaskId(null);
            setTaskInput("");
        }
    }

    return (
        <div className="space-y-6">
            <AssistantPanel />

            <section className="relative overflow-hidden rounded-[28px] border border-[var(--app-border)] bg-[linear-gradient(135deg,var(--app-surface)_0%,var(--app-surface-secondary)_55%,var(--app-bg)_100%)] p-6 shadow-[0_24px_70px_var(--app-accent-soft)] sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,40,217,0.06),transparent_42%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)]/85 px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-[var(--app-accent)] shadow-[0_8px_24px_var(--app-accent-soft)]">
                            <BrainCircuit className="h-4 w-4" />
                            Welcome to your workspace
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-[var(--app-strong)] sm:text-4xl">
                            Welcome, {profileName} 👋
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--app-text-muted)]">
                            Corpus Nexus AI helps you search, understand, and act on multilingual corpus data with a clear and reliable workspace.
                        </p>
                        <div className="mt-6 grid gap-3 text-sm text-[var(--app-text)] sm:grid-cols-2">
                            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--app-text-muted)]">Institution</p>
                                <p className="mt-1 font-medium text-[var(--app-text)]">{institutionName}</p>
                            </div>
                            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--app-text-muted)]">Role</p>
                                <p className="mt-1 font-medium text-[var(--app-text)]">{roleName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[24px] border border-[var(--app-border)] bg-[linear-gradient(145deg,var(--app-surface)_0%,var(--app-surface-secondary)_100%)] p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)] sm:min-w-[260px]">
                        <p className="text-sm font-medium text-[var(--app-text-muted)]">Current date & time</p>
                        <p className="mt-3 text-xl font-semibold tracking-[-0.01em] text-[var(--app-strong)]">{currentTime.toLocaleString()}</p>
                        <div className="mt-4 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)]/90 p-3 text-sm text-[var(--app-accent)] shadow-[0_8px_24px_var(--app-accent-soft)]">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                Corpus data is synced for review.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stats.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Card key={card.label} className="group border border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_12px_32px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-2 hover:border-[color:var(--app-accent-soft)] hover:shadow-[0_18px_44px_var(--app-accent-soft)]">
                            <CardContent className="flex h-full flex-col justify-between p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-semibold tracking-[0.02em] text-[var(--app-text-muted)]">{card.label}</p>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--app-accent-soft)] bg-[var(--app-accent-soft)] p-2 ${card.tone}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-6 space-y-2">
                                    <p className="text-3xl font-semibold tracking-[-0.02em] text-[var(--app-strong)]">{card.value}</p>
                                    <p className="text-sm leading-6 text-[var(--app-text-soft)]">{card.subtitle}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_16px_40px_var(--app-accent-soft)]">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-[var(--app-strong)]">Today&apos;s Analytics</CardTitle>
                        <CardDescription>Corpus activity shaped by the latest backend data.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="h-72 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.length ? chartData : [{ name: "Records", value: 0 }]}>
                                    <CartesianGrid vertical={false} stroke="#27272a" strokeDasharray="3 3" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: "#c084fc" }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_16px_40px_var(--app-accent-soft)]">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-[var(--app-strong)]">At a glance</CardTitle>
                        <CardDescription>Useful corpus signals for the current view.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6 pt-2">
                        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                            <p className="text-sm font-semibold text-[var(--app-strong)]">Records in view</p>
                            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{records.length.toLocaleString()} records are currently available for analysis.</p>
                        </div>
                        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                            <p className="text-sm font-semibold text-[var(--app-strong)]">Language coverage</p>
                            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{languages.length.toLocaleString()} languages are represented in the corpus.</p>
                        </div>
                        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                            <p className="text-sm font-semibold text-[var(--app-strong)]">Contributor activity</p>
                            <p className="mt-1 text-sm text-[var(--app-text-muted)]">{contributors.toLocaleString()} contributors are reflected in the current data.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Card className="border-[var(--app-border)] bg-[var(--app-surface)] shadow-[0_16px_40px_var(--app-accent-soft)]">
                <CardHeader className="px-6 pb-2 pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-lg text-[var(--app-strong)]">My To-Do</CardTitle>
                            <CardDescription>Keep track of the next actions for the day.</CardDescription>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTodoOpen((current) => !current)}
                            className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-2 text-[var(--app-text-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
                        >
                            {todoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                    </div>
                </CardHeader>
                {todoOpen ? (
                    <CardContent className="space-y-4 p-6 pt-2">
                        <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-[var(--app-strong)]">Progress</p>
                                    <p className="mt-1 text-sm text-[var(--app-text-muted)]">{todoProgress}% complete</p>
                                </div>
                                <div className="h-2.5 w-32 rounded-full bg-[var(--app-surface)]">
                                    <div className="h-2.5 rounded-full bg-gradient-to-r from-[var(--app-accent)] to-[color:var(--app-accent-soft)]" style={{ width: `${todoProgress}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                value={taskInput}
                                onChange={(event) => setTaskInput(event.target.value)}
                                placeholder={editingTaskId ? "Update your task" : "Add a task"}
                                className="flex-1 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] px-3 py-2.5 text-sm text-[var(--app-text)] outline-none transition focus:border-[var(--app-accent)]"
                            />
                            <button
                                type="button"
                                onClick={addTask}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--app-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--app-strong)] transition hover:opacity-90"
                            >
                                <Plus className="h-4 w-4" />
                                {editingTaskId ? "Save" : "Add task"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tasks.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4 text-sm text-[var(--app-text-muted)]">
                                    No tasks yet. Add one to keep your day organized.
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-secondary)] p-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleTask(task.id)}
                                                className={`rounded-full border p-1 ${task.completed ? "border-[var(--app-accent)] bg-[var(--app-accent-soft)] text-[var(--app-accent)]" : "border-[var(--app-border)] text-[var(--app-text-muted)]"}`}
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <div>
                                                <p className={`text-sm font-medium ${task.completed ? "text-[var(--app-text-muted)] line-through" : "text-[var(--app-text)]"}`}>{task.text}</p>
                                                <p className="text-xs text-[var(--app-text-muted)]">{new Date(task.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEditTask(task)}
                                                className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-2 text-[var(--app-text-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteTask(task.id)}
                                                className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] p-2 text-[var(--app-text-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                ) : null}
            </Card>
        </div>
    );
}

export default DashboardPage;
