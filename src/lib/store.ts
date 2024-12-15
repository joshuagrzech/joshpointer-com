import { create } from 'zustand'
import type { Route } from './types'

interface NavigationState {
  currentRoute: Route
  setRoute: (route: Route) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: 'home',
  setRoute: (route) => set({ currentRoute: route }),
}))
