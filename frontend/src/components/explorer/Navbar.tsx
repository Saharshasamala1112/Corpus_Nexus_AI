import { Link } from 'react-router-dom'
import '../../styles/Navbar.css'

export default function Navbar() {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')
  }

  return (
    <nav className="navbar">
      <h2>Corpus Explorer AI</h2>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <Link to="/">Home</Link>

        {token && (
          <>
            <Link to="/search">Search</Link>

            <Link to="/profile">Profile</Link>

            <span>👋 {username}</span>

            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
