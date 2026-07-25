import type { AssistantConversation, AssistantMessage } from '@/types/assistant'
import { motion } from 'framer-motion'
import MessageBubble from './MessageBubble'

interface Props {
    conversation: AssistantConversation | null
}

export default function ChatMessageList({ conversation }: Props) {
    if (!conversation) return null

    return (
        <div className="space-y-4 px-1">
            {conversation.messages.map((message: AssistantMessage) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                    <MessageBubble message={message} />
                </motion.div>
            ))}
        </div>
    )
}
