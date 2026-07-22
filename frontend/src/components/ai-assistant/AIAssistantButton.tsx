import { useNavigate } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'

function AIAssistantButton() {
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon-lg"
        variant="default"
        className="h-14 w-14 rounded-full bg-primary shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        onClick={() => navigate('/ai-assistant')}
        aria-label="Open AI Assistant"
      >
        <Bot className="size-6" />
      </Button>
    </div>
  )
}

export default AIAssistantButton
