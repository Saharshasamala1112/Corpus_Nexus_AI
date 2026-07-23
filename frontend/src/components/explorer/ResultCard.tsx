import { Link } from 'react-router-dom'

interface ExplorerRecord {
  title?: string
  description?: string
  language?: string
  creator?: string
  username?: string
  media_type?: string
  uid?: string | number
}

interface ResultCardProps {
  item: ExplorerRecord
}

export default function ResultCard({ item }: ResultCardProps) {
  return (
    <div className="card">
      <h2>{item.title}</h2>

      <p>
        <strong>Description:</strong>
        <br />
        {item.description}
      </p>

      <p>
        <strong>Language:</strong> {item.language}
      </p>

      <p>
        <strong>Creator:</strong> {item.creator}
      </p>

      <p>
        <strong>Username:</strong> {item.username}
      </p>

      <p>
        <strong>Media Type:</strong> {item.media_type}
      </p>

      <Link to={`/record/${item.uid}`} state={item}>
        <button>View Details</button>
      </Link>
    </div>
  )
}
