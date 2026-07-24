import { useChatStore } from '@/store/useChatStore'
import { motion, AnimatePresence } from 'framer-motion'
import BlueBotMascot from './BlueBotMascot'

function AIAssistantButton() {
  const { aiDrawerOpen, toggleAiDrawer } = useChatStore()

  return (
    <AnimatePresence>
      {!aiDrawerOpen && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="relative group">
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-6 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Neon ring */}
            <motion.div
              className="absolute -inset-3 rounded-full border border-blue-400/20"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59,130,246,0.15)',
                  '0 0 40px rgba(59,130,246,0.3)',
                  '0 0 20px rgba(59,130,246,0.15)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Inner glow */}
            <motion.div
              className="absolute -inset-2 rounded-full bg-blue-500/10 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Button */}
            <motion.button
              onClick={toggleAiDrawer}
              aria-label="Open AI Assistant"
              className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#0F172A] to-[#020617] border border-blue-500/20 overflow-hidden cursor-pointer"
              style={{ width: 88, height: 88 }}
              whileHover={{ scale: 1.08, borderColor: 'rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent" />
              <div className="scale-[0.6] origin-center">
                <BlueBotMascot />
              </div>
              <motion.div
                className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-4 px-3 py-2 rounded-xl bg-[#0A0F1E]/90 backdrop-blur-xl border border-blue-500/20 text-white text-sm font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-xl">
              Ask CorpusGuard AI
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AIAssistantButton
