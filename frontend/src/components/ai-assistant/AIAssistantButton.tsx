import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

function AIAssistantButton() {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Animated background pulse */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          width: '80px',
          height: '80px',
          left: '-8px',
          top: '-8px',
        }}
      />

      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/ai-assistant')}
        aria-label="Open AI Assistant"
        className={`relative h-16 w-16 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center font-semibold text-white overflow-hidden group ${
          isHovered
            ? 'bg-gradient-to-br from-blue-600 to-purple-600 scale-110 shadow-2xl'
            : 'bg-gradient-to-br from-blue-500 to-purple-500 hover:shadow-2xl'
        }`}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Icon with animation */}
        <div
          className={`relative z-10 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        >
          <MessageCircle className="h-7 w-7" strokeWidth={1.5} />
        </div>

        {/* Tooltip */}
        <div
          className={`absolute bottom-full right-0 mb-3 px-3 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg whitespace-nowrap pointer-events-none transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          Ask Assistant
          <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-900" />
        </div>
      </button>

      {/* Floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 16px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default AIAssistantButton
