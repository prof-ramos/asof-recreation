import { create } from 'zustand'
import { Filiacao } from '@/types'

interface FiliacaoState {
  filiacoes: Filiacao[]
  loading: boolean
  error: string | null
  fetchFiliacoes: (status?: string) => Promise<void>
  approveFiliacao: (id: number, observacoes?: string) => Promise<void>
  rejectFiliacao: (id: number, motivo?: string) => Promise<void>
}

export const useFiliacaoStore = create<FiliacaoState>((set, get) => ({
  filiacoes: [],
  loading: false,
  error: null,

  fetchFiliacoes: async (status?: string) => {
    set({ loading: true, error: null })
    try {
      const url = status ? `/api/filiacoes?status=${status}` : '/api/filiacoes'
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Erro ao buscar filiações')
      }

      const filiacoes = await response.json()
      set({ filiacoes, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false
      })
    }
  },

  approveFiliacao: async (id: number, observacoes?: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/filiacoes/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observacoes }),
      })

      if (!response.ok) {
        throw new Error('Erro ao aprovar filiação')
      }

      // Atualizar a lista após aprovação
      await get().fetchFiliacoes()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false
      })
    }
  },

  rejectFiliacao: async (id: number, motivo?: string) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/filiacoes/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo }),
      })

      if (!response.ok) {
        throw new Error('Erro ao rejeitar filiação')
      }

      // Atualizar a lista após rejeição
      await get().fetchFiliacoes()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        loading: false
      })
    }
  },
}))
