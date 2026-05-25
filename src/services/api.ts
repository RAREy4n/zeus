import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
})

export const salvarProgresso = async (
  childId: string,
  gameId: string,
  score: number,
  timeSpentSeconds: number
) => {
  try {
    const response = await api.post('/games/progress', {
      childId,
      gameId,
      score,
      timeSpentSeconds
    })
    return response.data
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    throw error
  }
}