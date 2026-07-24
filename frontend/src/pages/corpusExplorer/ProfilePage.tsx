import { useEffect, useState } from 'react'
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
} from 'lucide-react'

import Loader from '@/components/corpusExplorer/Loader'
import { getProfile } from '@/services/corpusExplorer/auth'
import type { CorpusProfile } from '@/types/corpusExplorer'

export default function ProfilePage() {
  const [profile, setProfile] = useState<CorpusProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getProfile()
        setProfile(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load profile')
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  if (loading) {
    return <Loader />
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        {error || "Profile couldn't be loaded"}
      </div>
    )
  }

  const profileItems = [
    { label: 'Username', value: profile.username, icon: UserRound },
    { label: 'Name', value: profile.name, icon: UserRound },
    { label: 'Phone', value: profile.phone, icon: Phone },
    { label: 'Email', value: profile.email, icon: Mail },
    { label: 'Organisation', value: profile.organisation, icon: Building2 },
    { label: 'Profession', value: profile.profession, icon: BriefcaseBusiness },
    { label: 'Roles', value: profile.roles.join(', '), icon: ShieldCheck },
    { label: 'Location', value: profile.location, icon: MapPin },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">My Profile</h1>
            <p className="text-sm text-zinc-400">
              Account identity and organisational metadata for Corpus Explorer.
            </p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {profileItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-lg shadow-black/20"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-2 text-violet-300">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-zinc-400">{item.label}</p>
              </div>
              <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}
