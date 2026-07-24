import { useNavigate } from 'react-router-dom'

interface ExplorerRecord {
  title?: string
  description?: string
  username?: string
  language?: string
  uid?: string | number
}

interface RecordCardProps {
  item: ExplorerRecord
}

export default function RecordCard({ item }: RecordCardProps) {
  const navigate = useNavigate()

  return (
    <div className="card">
      <h3>{item.title || 'No Title'}</h3>

      <p>{item.description}</p>

      <p>Username: {item.username}</p>

      <p>Language: {item.language}</p>

      <button onClick={() => navigate(`/record/${item.uid}`, { state: item })}>View Details</button>
    </div>
  )
}
