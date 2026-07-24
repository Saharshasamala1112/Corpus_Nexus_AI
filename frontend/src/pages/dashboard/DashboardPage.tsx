import {
    Activity,
    BrainCircuit,
    FileText,
    Globe2,
    Layers3,
    ShieldCheck,
    Sparkles,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AssistantPanel } from "@/components/aiAssistant";

const kpiCards = [
    { label: "Ingested Records", value: "24.8K", subtitle: "+14.2% vs last week", icon: FileText, tone: "border-violet-500/30 bg-violet-500/10 text-violet-300" },
    { label: "Active Operators", value: "186", subtitle: "+9 active today", icon: Users, tone: "border-sky-500/30 bg-sky-500/10 text-sky-300" },
    { label: "Overall Corpus Health", value: "97.4%", subtitle: "Stable and improving", icon: ShieldCheck, tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
    { label: "Indexed Languages", value: "42", subtitle: "Across 8 regions", icon: Globe2, tone: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
];

const chartData = [
    { name: "Mon", value: 48 },
    { name: "Tue", value: 64 },
    { name: "Wed", value: 58 },
    { name: "Thu", value: 81 },
    { name: "Fri", value: 74 },
    { name: "Sat", value: 91 },
    { name: "Sun", value: 88 },
];

const insights = [
    { title: "Model drift watch", description: "Low variance detected in multilingual retrieval patterns.", time: "8 min ago", icon: BrainCircuit },
    { title: "Policy confidence", description: "Guardrails are holding steady across 97% of active jobs.", time: "24 min ago", icon: Layers3 },
    { title: "Operator overload", description: "Three queues are approaching review capacity thresholds.", time: "41 min ago", icon: Activity },
];

const recentIngestions = [
    { document: "Quarterly report v3", language: "English", operator: "Maya Chen", status: "Reviewed" },
    { document: "Policy digest", language: "French", operator: "Liam Ortiz", status: "In Review" },
    { document: "Product launch notes", language: "German", operator: "Sana Patel", status: "Synced" },
    { document: "Customer support logs", language: "Japanese", operator: "Noah Reed", status: "Queued" },
];

const leaderboard = [
    { name: "Maya Chen", audits: "184 audits", xp: "XP 94", progress: 84, initials: "MC" },
    { name: "Liam Ortiz", audits: "171 audits", xp: "XP 91", progress: 78, initials: "LO" },
    { name: "Sana Patel", audits: "162 audits", xp: "XP 89", progress: 72, initials: "SP" },
];

function DashboardPage() {
    return (
        <div className="space-y-6">
            <AssistantPanel />
            <Card className="overflow-hidden border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 shadow-2xl shadow-black/20">
                <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_0.7fr] lg:p-10">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
                            <Sparkles className="h-4 w-4" />
                            Premium command center
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                Keep every team aligned with one intelligent operating layer.
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                                Monitor knowledge health, automate insights, and stay ahead with a multi-surface AI workspace designed for enterprise execution.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">
                                Open briefing
                            </button>
                            <button className="rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-500 hover:text-white">
                                View health
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Live status</p>
                                <p className="mt-1 text-2xl font-semibold text-white">All systems healthy</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                                <div className="flex items-center justify-between text-sm text-zinc-400">
                                    <span>Knowledge coverage</span>
                                    <span className="font-semibold text-white">94%</span>
                                </div>
                                <div className="mt-3 h-2 rounded-full bg-zinc-800">
                                    <div className="h-2 w-[94%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                                </div>
                            </div>
                            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                                <div className="flex items-center justify-between text-sm text-zinc-400">
                                    <span>Model confidence</span>
                                    <span className="font-semibold text-white">High</span>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
                                    <BrainCircuit className="h-4 w-4 text-violet-400" />
                                    8 tuned agents in active rotation
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpiCards.map((card) => {
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

            <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-white">Today&apos;s Ingestion Activity</CardTitle>
                        <CardDescription>Daily volume across the knowledge pipeline.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="h-72 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
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
                        <CardTitle className="text-lg text-white">AI Insights Analyst</CardTitle>
                        <CardDescription>Signals being surfaced for the current shift.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6 pt-2">
                        {insights.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-2 text-violet-300">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-semibold text-white">{item.title}</p>
                                                <span className="text-xs text-zinc-500">{item.time}</span>
                                            </div>
                                            <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-white">Recent Ingestion</CardTitle>
                        <CardDescription>Latest records flowing into the corpus.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="overflow-hidden rounded-2xl border border-zinc-800">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document</TableHead>
                                        <TableHead>Language</TableHead>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentIngestions.map((entry) => (
                                        <TableRow key={entry.document}>
                                            <TableCell>{entry.document}</TableCell>
                                            <TableCell>{entry.language}</TableCell>
                                            <TableCell>{entry.operator}</TableCell>
                                            <TableCell>
                                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                                    {entry.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-950/70 shadow-lg shadow-black/20">
                    <CardHeader className="px-6 pb-2 pt-6">
                        <CardTitle className="text-lg text-white">Operator Leaderboard</CardTitle>
                        <CardDescription>Top contributors this sprint.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6 pt-2">
                        {leaderboard.map((person) => (
                            <div key={person.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 font-semibold text-white">
                                        {person.initials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-semibold text-white">{person.name}</p>
                                            <span className="text-sm font-medium text-violet-300">{person.xp}</span>
                                        </div>
                                        <p className="mt-1 text-sm text-zinc-400">{person.audits}</p>
                                        <div className="mt-3 h-2 rounded-full bg-zinc-800">
                                            <div className={`h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500`} style={{ width: `${person.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}

export default DashboardPage;
