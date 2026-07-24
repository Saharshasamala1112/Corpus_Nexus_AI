export interface LoginRequest {
  phone: string
  password: string
}

export interface UserProfile {
  id?: string
  username?: string
  name?: string
  phone?: string
  email?: string
  organisation?: string
  profession?: string
  roles?: string[]
  location?: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user_id: string
  username: string
  phone: string
  roles: string[]
  user?: UserProfile
}

export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  token: string | null
}

export interface LogoutResponse {
  message?: string
}
