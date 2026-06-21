
const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:3001'
const GAME_ID = 'pizzaria-game'

export interface SubmitRunPayload {
  levelId: number
  score: number
  ticksUsed: number
  pizzasDelivered: number
  pizzasBurned: number
  sourceCode: string
  dslVersion: string
  completedAt: string 
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  score: number
  ticksUsed: number
  achievedAt: string
}

interface KratosLoginResponse {
  success?: boolean
  data?: {
    token: string
    user: {
      id?: string
      _id?: string
    }
  }
  token?: string
  userId?: string
}

export class KratosClient {
  private token: string | null = null

  constructor(private readonly baseUrl: string = DEFAULT_BASE_URL) {}

  setToken(token: string): void {
    this.token = token
  }

  async login(email: string, password: string): Promise<{ token: string; userId: string }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(`Falha no login: ${res.status}`)
    const data = (await res.json()) as KratosLoginResponse
    const token = data.data?.token ?? data.token
    const userId = data.data?.user.id ?? data.data?.user._id ?? data.userId

    if (!token || !userId) {
      throw new Error('Resposta de login invalida')
    }

    this.token = token
    return { token, userId }
  }

  async submitRun(payload: SubmitRunPayload): Promise<{ id: string }> {
    if (!this.token) throw new Error('Não autenticado')
    const res = await fetch(`${this.baseUrl}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ ...payload, gameId: GAME_ID }),
    })
    if (!res.ok) throw new Error(`Falha ao submeter run: ${res.status}`)
    return res.json() as Promise<{ id: string }>
  }

  async getLeaderboard(levelId: number, limit = 100): Promise<LeaderboardEntry[]> {
    const res = await fetch(
      `${this.baseUrl}/leaderboard/${GAME_ID}?level=${levelId}&limit=${limit}`,
      {
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      }
    )
    if (!res.ok) throw new Error(`Falha ao buscar leaderboard: ${res.status}`)
    return res.json() as Promise<LeaderboardEntry[]>
  }
}

export const kratosClient = new KratosClient()
