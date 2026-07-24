import { motion } from 'framer-motion'

const QUICK_ACTIONS = [
  { label: 'Explain Backend Architecture', icon: '🏗️' },
  { label: 'Explain Authentication', icon: '🔐' },
  { label: 'Show PostgreSQL Schema', icon: '🗄️' },
  { label: 'Explain Docker Setup', icon: '🐳' },
  { label: 'How do I Deploy?', icon: '🚀' },
  { label: 'Show Project Structure', icon: '📁' },
  { label: 'Find API Endpoint', icon: '🔗' },
  { label: 'Explain Folder Structure', icon: '📂' },
  { label: 'Where is JWT used?', icon: '🔑' },
  { label: 'Show Environment Variables', icon: '⚙️' },
]

interface WelcomeViewProps {
  onSendPrompt: (prompt: string) => void
}

function WelcomeView({ onSendPrompt }: WelcomeViewProps) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin px-5 py-5">
      <div className="flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mb-5"
        >
          <p className="text-[11px] text-blue-300/30 font-medium uppercase tracking-wider">
            Quick Questions
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSendPrompt(action.label)}
              className="group relative overflow-hidden rounded-xl border border-blue-500/10 bg-white/[0.02] p-3 text-left transition-all hover:border-blue-500/25 hover:bg-blue-500/[0.04]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative block text-sm mb-1">{action.icon}</span>
              <span className="relative block text-[11px] text-blue-200/50 group-hover:text-blue-100 transition-colors leading-snug">
                {action.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default WelcomeView
