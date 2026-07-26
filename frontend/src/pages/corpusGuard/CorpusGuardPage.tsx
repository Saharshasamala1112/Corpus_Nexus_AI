import { Card, CardContent } from '@/components/ui/card'
import { AssistantPanel } from '@/components/aiAssistant'

export default function CorpusGuardPage() {
    return (
        <div className="space-y-6">
            <AssistantPanel />
            <Card className="border-[var(--app-border)] bg-[var(--app-surface-secondary)] dark:border-zinc-800 dark:bg-zinc-900/60">
                <CardContent>
                    <h2 className="text-lg font-semibold text-[var(--app-strong)] dark:text-white">CorpusGuard</h2>
                    <p className="text-sm text-[var(--app-text-muted)] dark:text-zinc-400">Central view for monitoring and querying your corpus.</p>
                </CardContent>
            </Card>
        </div>
    )
}
