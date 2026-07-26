import RobotSvg from '@/assets/robot.svg';

interface AIAssistantButtonProps {
    open: boolean;
    onToggle: () => void;
}

export default function AIAssistantButton({ open, onToggle }: AIAssistantButtonProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={open ? "Close CorpusGuard AI" : "Open CorpusGuard AI"}
            title="Ask CorpusGuard AI"
            className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-0 shadow-[0_12px_30px_rgba(37,99,235,0.28)] transform-gpu transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
        >
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 opacity-30 blur-md animate-pulse" aria-hidden />
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-surface)]/60 ring-[var(--app-border)] overflow-hidden">
                <img src={RobotSvg} alt="assistant" className="h-10 w-10 object-contain" />
            </span>
        </button>
    );
}
