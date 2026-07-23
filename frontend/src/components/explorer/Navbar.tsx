import { Link, useNavigate } from 'react-router-dom'
import '../../styles/Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('phone')

    navigate('/login')
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

        {!token && <Link to="/login">Login</Link>}
      </div>
    </nav>
  )
}
