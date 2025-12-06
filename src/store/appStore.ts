import { create } from 'zustand';

interface AppStore {
  isMenuOpen: boolean;
  activeSection: string;
  setMenuOpen: (open: boolean) => void;
  setActiveSection: (section: string) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isMenuOpen: false,
  activeSection: 'home',
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
