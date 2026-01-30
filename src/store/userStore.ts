import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  avatar: string
  createdAt: number
}

interface UserStore {
  users: UserProfile[]
  currentUserId: string | null
  addUser: (name: string, avatar: string) => UserProfile
  selectUser: (userId: string) => void
  deleteUser: (userId: string) => void
  getCurrentUser: () => UserProfile | null
  logout: () => void
}

const AVATARS = ['astronaut', 'alien', 'robot', 'rocket', 'star', 'planet']

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      addUser: (name: string, avatar: string) => {
        const newUser: UserProfile = {
          id: crypto.randomUUID(),
          name: name.trim(),
          avatar,
          createdAt: Date.now(),
        }
        set((state) => ({
          users: [...state.users, newUser],
          currentUserId: newUser.id,
        }))
        return newUser
      },

      selectUser: (userId: string) => {
        set({ currentUserId: userId })
      },

      deleteUser: (userId: string) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
          currentUserId: state.currentUserId === userId ? null : state.currentUserId,
        }))
      },

      getCurrentUser: () => {
        const state = get()
        return state.users.find((u) => u.id === state.currentUserId) || null
      },

      logout: () => {
        set({ currentUserId: null })
      },
    }),
    {
      name: 'cosmotablas-users',
      version: 1,
    }
  )
)

export { AVATARS }
