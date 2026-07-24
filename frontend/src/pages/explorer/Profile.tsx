import { useEffect, useState } from 'react'
import { getProfile } from '../../services/api.ts'

type ProfileData = {
  username?: string
  phone?: string
  email?: string
  name?: string
  profession?: string
  organisation?: string
  current_place?: string
  roles?: Array<{ name?: string }>
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile()
        const profileData = data as ProfileData
        setProfile(profileData)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load profile'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading profile...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'red' }}>{error}</h2>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
      }}
    >
      <div
        style={{
          width: '500px',
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>👤 My Profile</h2>

        <hr />

        <p>
          <strong>Username:</strong> {profile.username}
        </p>

        <p>
          <strong>Phone:</strong> {profile.phone}
        </p>

        <p>
          <strong>Email:</strong> {profile.email || 'Not Available'}
        </p>

        <p>
          <strong>Name:</strong> {profile.name || 'Not Available'}
        </p>

        <p>
          <strong>Profession:</strong> {profile.profession || 'Not Available'}
        </p>

        <p>
          <strong>Organisation:</strong> {profile.organisation || 'Not Available'}
        </p>

        <p>
          <strong>Location:</strong> {profile.current_place || 'Not Available'}
        </p>

        <p>
          <strong>Roles:</strong> {profile.roles?.map((role) => role.name).join(', ')}
        </p>
      </div>
    </div>
  )
}
