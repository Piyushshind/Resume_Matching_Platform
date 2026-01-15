export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  password2: string
}

export interface AuthResponse {
  access: string
  refresh: string
  message?: string
}
