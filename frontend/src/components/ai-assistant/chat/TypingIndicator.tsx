import { motion } from 'framer-motion'

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="size-4 rounded-full bg-primary/40"
        />
      </div>
      <div className="flex items-center gap-1.5 pt-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TypingIndicator
