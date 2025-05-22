import { create } from "zustand";

interface RecipeFormModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useRecipeFormModal = create<RecipeFormModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
