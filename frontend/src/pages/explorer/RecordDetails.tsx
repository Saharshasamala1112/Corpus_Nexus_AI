import { useLocation } from 'react-router-dom'
import AIAssistant from '../../components/explorer/AIAssistant'

interface ExplorerRecord {
  title?: string
  username?: string
  description?: string
  language?: string
  category?: string
}

export default function RecordDetails() {
  const location = useLocation()
  const record = location.state as ExplorerRecord | null

  if (!record) {
    return <h2>No record selected.</h2>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{record.title || record.username}</h1>

      <p>
        <strong>Description:</strong> {record.description || 'No description'}
      </p>

      <p>
        <strong>Language:</strong> {record.language || 'N/A'}
      </p>

      <p>
        <strong>Category:</strong> {record.category || 'N/A'}
      </p>

      <AIAssistant record={record} />
    </div>
  )
}
