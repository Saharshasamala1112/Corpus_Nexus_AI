import { Card, CardContent } from '@/components/ui/card'
import { AssistantPanel } from '@/components/aiAssistant'

export default function CorpusGuardPage() {
    return (
        <div className="space-y-6">
            <AssistantPanel />
            <Card className="border-zinc-800 bg-zinc-900/60">
                <CardContent>
                    <h2 className="text-lg font-semibold text-white">CorpusGuard</h2>
                    <p className="text-sm text-zinc-400">Central view for monitoring and querying your corpus.</p>
                </CardContent>
            </Card>
        </div>
    )
}
