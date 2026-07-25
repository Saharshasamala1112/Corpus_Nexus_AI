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
            try {
                const [recordsData, languageData, leaderboardData, profileData] = await Promise.all([
                    getRecords(0, 1000) as Promise<Partial<CorpusRecord>[]>,
                    getLanguages(),
                    getLeaderboard().catch(() => []),
                    getCurrentUser().catch(() => null),
                ]);

                setRecords(recordsData as CorpusRecord[]);
                setLanguages(languageData.map((item) => item.name));

                const contributorValues = new Set<string>();
                for (const record of recordsData as Partial<CorpusRecord>[]) {
                    const contributor = deriveValue(record, ["contributor", "contributor_name", "user_name", "created_by", "speaker", "owner", "annotator"]);
                    if (contributor) {
                        contributorValues.add(contributor);
                    }
                }

                const derivedContributors = leaderboardData.length > 0 ? leaderboardData.length : contributorValues.size;
                setContributors(derivedContributors);

                if (profileData) {
                    setProfileName(profileData.username || user?.username || "User");
                    const role = profileData.roles?.[0]?.name || "Intern";
                    setRoleName(role);

                    if (profileData.institution_id) {
                        try {
                            const institution = await getInstitution(profileData.institution_id);
                            setInstitutionName(institution.college_name || institution.university_name || "Institution available");
                        } catch {
                            setInstitutionName("Institution pending");
                        }
                    } else {
                        setInstitutionName("Institution not provided");
                    }
                }
            } catch {
                setInstitutionName("Institution unavailable");
            } finally {
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
            tone: "border-violet-500/30 bg-violet-500/10 text-violet-300",
        },
        {
            label: "Contributors",
            value: contributors.toLocaleString(),
            subtitle: loading ? "Loading contributors" : "Active contributors",
            icon: Users,
            tone: "border-sky-500/30 bg-sky-500/10 text-sky-300",
        },
        {
            label: "Languages",
            value: languages.length.toLocaleString(),
            subtitle: loading ? "Loading languages" : "Available languages",
            icon: Globe2,
            tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
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

            <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-2xl shadow-black/20 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                            <BrainCircuit className="h-4 w-4" />
                            Welcome to your workspace
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Welcome, {profileName} 👋
                        </h1>
                        <p className="mt-3 text-base leading-7 text-zinc-400">
                            Corpus Nexus AI helps you search, understand, and act on multilingual corpus data with a clear and reliable workspace.
                        </p>
                        <div className="mt-5 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Institution</p>
                                <p className="mt-1 font-medium text-white">{institutionName}</p>
                            </div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Role</p>
                                <p className="mt-1 font-medium text-white">{roleName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 sm:min-w-[260px]">
                        <p className="text-sm font-medium text-zinc-400">Current date & time</p>
                        <p className="mt-3 text-xl font-semibold text-white">{currentTime.toLocaleString()}</p>
                        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
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
                        <Card key={card.label} className="group border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-violet-500/40">
                            <CardContent className="flex h-full flex-col justify-between p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-zinc-400">{card.label}</p>
                                    <div className={`rounded-2xl border p-2 ${card.tone}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <p className="text-3xl font-semibold tracking-tight text-white">{card.value}</p>
                                    <p className="mt-2 text-sm text-zinc-400">{card.subtitle}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-white">Today&apos;s Analytics</CardTitle>
                        <CardDescription>Corpus activity shaped by the latest backend data.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
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

                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-white">At a glance</CardTitle>
                        <CardDescription>Useful corpus signals for the current view.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6 pt-2">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                            <p className="text-sm font-semibold text-white">Records in view</p>
                            <p className="mt-1 text-sm text-zinc-400">{records.length.toLocaleString()} records are currently available for analysis.</p>
                        </div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                            <p className="text-sm font-semibold text-white">Language coverage</p>
                            <p className="mt-1 text-sm text-zinc-400">{languages.length.toLocaleString()} languages are represented in the corpus.</p>
                        </div>
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                            <p className="text-sm font-semibold text-white">Contributor activity</p>
                            <p className="mt-1 text-sm text-zinc-400">{contributors.toLocaleString()} contributors are reflected in the current data.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                <CardHeader className="px-6 pb-2 pt-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-lg text-white">My To-Do</CardTitle>
                            <CardDescription>Keep track of the next actions for the day.</CardDescription>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTodoOpen((current) => !current)}
                            className="rounded-full border border-zinc-800 bg-zinc-900/70 p-2 text-zinc-300 transition hover:border-violet-500 hover:text-white"
                        >
                            {todoOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                    </div>
                </CardHeader>
                {todoOpen ? (
                    <CardContent className="space-y-4 p-6 pt-2">
                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-white">Progress</p>
                                    <p className="mt-1 text-sm text-zinc-400">{todoProgress}% complete</p>
                                </div>
                                <div className="h-2.5 w-32 rounded-full bg-zinc-800">
                                    <div className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: `${todoProgress}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                value={taskInput}
                                onChange={(event) => setTaskInput(event.target.value)}
                                placeholder={editingTaskId ? "Update your task" : "Add a task"}
                                className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500"
                            />
                            <button
                                type="button"
                                onClick={addTask}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
                            >
                                <Plus className="h-4 w-4" />
                                {editingTaskId ? "Save" : "Add task"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tasks.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/70 p-4 text-sm text-zinc-400">
                                    No tasks yet. Add one to keep your day organized.
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleTask(task.id)}
                                                className={`rounded-full border p-1 ${task.completed ? "border-emerald-500 bg-emerald-500/15 text-emerald-300" : "border-zinc-700 text-zinc-500"}`}
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </button>
                                            <div>
                                                <p className={`text-sm font-medium ${task.completed ? "text-zinc-500 line-through" : "text-white"}`}>{task.text}</p>
                                                <p className="text-xs text-zinc-500">{new Date(task.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEditTask(task)}
                                                className="rounded-full border border-zinc-800 bg-zinc-950/70 p-2 text-zinc-300 transition hover:border-violet-500 hover:text-white"
                                            >
                                                <PencilLine className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteTask(task.id)}
                                                className="rounded-full border border-zinc-800 bg-zinc-950/70 p-2 text-zinc-300 transition hover:border-rose-500 hover:text-white"
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
