import { motion } from 'framer-motion'

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="relative shrink-0">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/20 border border-blue-500/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="size-4 rounded-full bg-blue-400/40"
          />
        </div>
        <motion.span
          className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400/60"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex items-center gap-1.5 pt-2.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-2 rounded-full bg-blue-400/40"
            animate={{
              y: [0, -4, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TypingIndicator
