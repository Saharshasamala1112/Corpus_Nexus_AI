import { useEffect, useMemo, useState, type FormEvent } from "react";
import api from "@/api/axios";
import {
    BrainCircuit,
    CheckCircle2,
    Circle,
    ClipboardList,
    FileText,
    Globe2,
    PencilLine,
    Plus,
    ShieldCheck,
    Sparkles,
    Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useauth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface TaskItem {
    id: string;
    text: string;
    completed: boolean;
}

function DashboardPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<TaskItem[]>(() => {
        if (typeof window === "undefined") {
            return [];
        }

        const storedTasks = window.localStorage.getItem("dashboard-tasks");
        if (!storedTasks) {
            return [];
        }

        try {
            return JSON.parse(storedTasks) as TaskItem[];
        } catch {
            return [];
        }
    });
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");
    const [isTodoOpen, setIsTodoOpen] = useState(false);
    const [institutionName, setInstitutionName] = useState("Loading...");
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        window.localStorage.setItem("dashboard-tasks", JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const loadInstitutionName = async () => {
            try {
                const userResponse = await api.get<{ institution_id?: string | null }>('/auth/me');
                const institutionId = userResponse.data?.institution_id;

                if (!institutionId) {
                    setInstitutionName("Not available");
                    return;
                }

                try {
                    const institutionResponse = await api.get<{ college_name?: string; university_name?: string }>('/institutions/' + institutionId);
                    const institutionData = institutionResponse.data;
                    setInstitutionName(institutionData?.college_name || institutionData?.university_name || "Not available");
                } catch {
                    setInstitutionName("Not available");
                }
            } catch {
                setInstitutionName("Not available");
            }
        };

        void loadInstitutionName();
    }, []);

    const username = user?.username || "there";
    const completedCount = tasks.filter((task) => task.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    const todayLabel = useMemo(
        () =>
            now.toLocaleDateString("en", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
        [now],
    );

    const timeLabel = useMemo(
        () =>
            now.toLocaleTimeString("en", {
                hour: "numeric",
                minute: "2-digit",
            }),
        [now],
    );

    const addTask = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedTask = newTask.trim();

        if (!trimmedTask) {
            return;
        }

        setTasks((currentTasks) => [
            ...currentTasks,
            {
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text: trimmedTask,
                completed: false,
            },
        ]);
        setNewTask("");
    };

    const toggleTaskCompletion = (taskId: string) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task,
            ),
        );
    };

    const deleteTask = (taskId: string) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
        if (editingTaskId === taskId) {
            setEditingTaskId(null);
            setEditingText("");
        }
    };

    const startEditing = (task: TaskItem) => {
        setEditingTaskId(task.id);
        setEditingText(task.text);
    };

    const saveTaskEdit = (taskId: string) => {
        const trimmedText = editingText.trim();
        if (!trimmedText) {
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === taskId ? { ...task, text: trimmedText } : task)),
        );
        setEditingTaskId(null);
        setEditingText("");
    };

    return (
        <div className="space-y-6">
            <section>
                <Card className="overflow-hidden border border-border/60 bg-card shadow-sm">
                    <CardContent className="p-6 sm:p-8 lg:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            <Sparkles className="h-4 w-4" />
                            Personalized home
                        </div>
                        <div className="mt-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                        Welcome, {username} 👋
                                    </h1>
                                    <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                        Welcome to Corpus Nexus AI — your unified platform for corpus exploration, analytics, AI-powered assistance, onboarding, SprintWise AI, and CorpusGuard.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsTodoOpen((current) => !current)}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                                    aria-label="Toggle To-Do"
                                >
                                    <ClipboardList className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid gap-3 rounded-3xl border border-border/60 bg-muted/40 p-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Institution Name</p>
                                    <p className="font-medium text-foreground">{institutionName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <p className="font-medium text-foreground">Intern</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Today&apos;s Date</p>
                                    <p className="font-medium text-foreground">{todayLabel}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Current Time</p>
                                    <p className="font-medium text-foreground">{timeLabel}</p>
                                </div>
                            </div>

                            <div className={`overflow-hidden rounded-3xl border border-border/60 bg-muted/40 transition-all duration-300 ${isTodoOpen ? "max-h-[600px] opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
                                <div className="p-4 sm:p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-semibold text-foreground">My To-Do</p>
                                            <p className="text-sm text-muted-foreground">{completedCount}/{tasks.length} completed</p>
                                        </div>
                                        <div className="h-2.5 w-24 rounded-full bg-background/70">
                                            <div className="h-2.5 rounded-full bg-gradient-to-r from-primary to-violet-500" style={{ width: `${progressPercent}%` }} />
                                        </div>
                                    </div>

                                    <form onSubmit={addTask} className="mb-4 flex gap-2">
                                        <input
                                            value={newTask}
                                            onChange={(event) => setNewTask(event.target.value)}
                                            placeholder="Add a new task"
                                            className="flex-1 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary"
                                        />
                                        <button type="submit" className="rounded-2xl bg-primary p-2.5 text-primary-foreground transition hover:bg-primary/90">
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </form>

                                    <div className="space-y-2">
                                        {tasks.length === 0 ? (
                                            <p className="rounded-2xl border border-dashed border-border/60 px-3 py-4 text-sm text-muted-foreground">
                                                No tasks yet. Add your first item to stay organized.
                                            </p>
                                        ) : (
                                            tasks.map((task) => (
                                                <div key={task.id} className="flex items-start gap-2 rounded-2xl border border-border/60 bg-background/50 px-3 py-3">
                                                    <button type="button" onClick={() => toggleTaskCompletion(task.id)} className="mt-0.5 text-primary">
                                                        {task.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                                    </button>

                                                    <div className="min-w-0 flex-1">
                                                        {editingTaskId === task.id ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    value={editingText}
                                                                    onChange={(event) => setEditingText(event.target.value)}
                                                                    className="flex-1 rounded-xl border border-border/60 bg-background/70 px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                                                                />
                                                                <button type="button" onClick={() => saveTaskEdit(task.id)} className="rounded-xl bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground">
                                                                    Save
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                                                {task.text}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <button type="button" onClick={() => startEditing(task)} className="rounded-xl p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                                            <PencilLine className="h-4 w-4" />
                                                        </button>
                                                        <button type="button" onClick={() => deleteTask(task.id)} className="rounded-xl p-1.5 text-muted-foreground transition hover:bg-muted hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-border/60 bg-card shadow-sm">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-foreground">About Corpus Nexus AI</CardTitle>
                        <CardDescription>Everything you need for a streamlined corpus experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 pt-2">
                        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl border border-primary/25 bg-primary/10 p-2 text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Explore your corpus confidently</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Search, discover, and understand records from a single elegant workspace.</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-2 text-sky-300">
                                    <BrainCircuit className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Work with AI assistance</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Ask questions, get summaries, and accelerate your workflow with built-in intelligence.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border/60 bg-card shadow-sm">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-foreground">What you can do here</CardTitle>
                        <CardDescription>Stay focused on the work that matters most.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 pt-2">
                        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-300">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Track progress and insights</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Monitor activity, review analytics, and stay aligned with your team&apos;s momentum.</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-300">
                                    <Globe2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">Move from onboarding to delivery</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Use the platform to guide onboarding, organize sprints, and protect quality across workflows.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

export default DashboardPage;
