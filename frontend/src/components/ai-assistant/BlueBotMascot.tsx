import { motion } from 'framer-motion'

function BlueBotMascot() {
  return (
    <motion.div
      animate={{ y: [-6, 6, -6] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-full bg-blue-500/10 blur-3xl" />
      <svg
        viewBox="0 0 240 260"
        className="w-32 h-32 relative z-10 drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="botHead" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="botBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A5F" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Antenna glow */}
        <motion.circle
          cx="120"
          cy="20"
          r="4"
          fill="#60A5FA"
          filter="url(#glow)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <line
          x1="120"
          y1="24"
          x2="120"
          y2="40"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Head */}
        <rect x="70" y="40" width="100" height="85" rx="24" fill="url(#botHead)" />

        {/* Ears / side panels */}
        <rect x="50" y="60" width="22" height="40" rx="10" fill="#2563EB" opacity="0.6" />
        <rect x="168" y="60" width="22" height="40" rx="10" fill="#2563EB" opacity="0.6" />

        {/* Left eye */}
        <ellipse cx="100" cy="75" rx="14" ry="18" fill="#0F172A" opacity="0.9" />
        <motion.ellipse
          cx="103"
          cy="78"
          rx="8"
          ry="10"
          fill="#60A5FA"
          filter="url(#glow)"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="105" cy="73" r="3" fill="white" opacity="0.8" />

        {/* Right eye */}
        <ellipse cx="140" cy="75" rx="14" ry="18" fill="#0F172A" opacity="0.9" />
        <motion.ellipse
          cx="143"
          cy="78"
          rx="8"
          ry="10"
          fill="#60A5FA"
          filter="url(#glow)"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <circle cx="145" cy="73" r="3" fill="white" opacity="0.8" />

        {/* Mouth - subtle smile */}
        <path
          d="M 105 100 Q 120 110 135 100"
          stroke="#60A5FA"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Neck connector */}
        <rect x="110" y="125" width="20" height="12" rx="4" fill="#1E40AF" />

        {/* Body */}
        <rect x="75" y="137" width="90" height="75" rx="20" fill="url(#botBody)" />

        {/* Chest panel */}
        <rect x="100" y="155" width="40" height="35" rx="8" fill="#0F172A" opacity="0.4" />

        {/* Chest LEDs */}
        <motion.circle
          cx="115"
          cy="167"
          r="4"
          fill="#22D3EE"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="130"
          cy="167"
          r="4"
          fill="#3B82F6"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.circle
          cx="120"
          cy="180"
          r="3"
          fill="#34D399"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
        />

        {/* Left arm */}
        <rect
          x="55"
          y="150"
          width="20"
          height="12"
          rx="6"
          fill="#2563EB"
          transform="rotate(-20 65 156)"
        />
        <motion.circle
          cx="48"
          cy="148"
          r="8"
          fill="#3B82F6"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Right arm - waving */}
        <rect
          x="165"
          y="150"
          width="20"
          height="12"
          rx="6"
          fill="#2563EB"
          transform="rotate(25 175 156)"
        />
        <motion.g
          animate={{ rotate: [-8, 12, -8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '175px 156px' }}
        >
          <circle cx="185" cy="140" r="9" fill="#3B82F6" />
        </motion.g>

        {/* Feet */}
        <rect x="85" y="212" width="22" height="10" rx="5" fill="#1E40AF" opacity="0.7" />
        <rect x="133" y="212" width="22" height="10" rx="5" fill="#1E40AF" opacity="0.7" />
      </svg>
    </motion.div>
  )
}

export default BlueBotMascot
