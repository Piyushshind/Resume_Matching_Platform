const API_BASE = 'http://127.0.0.1:8000/api'

export const authAPI = {
  login: async (data: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE}/auth/cookie-login/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Login failed')
    }
    const result = await response.json()
    
    const token = result.access || result.access_token
    localStorage.setItem('access_token', token)
    return { token }
  },
  
  register: async (data: { username: string; email: string; password: string; password2: string }) => {
    const response = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }
    return response.json()
  }
}

export const bookAPI = {
  getAvailableBooks: async () => {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${API_BASE}/books/?copies_available__gt=0`, {
      headers: {
        'Authorization': `Bearer ${token}`,  
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Failed to fetch books')
    }
    return response.json()
  },
}

