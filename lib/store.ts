import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FitnessPlan {
  id: string;
  createdAt: string;
  userData: any;
  plan: any;
}

interface FitnessStore {
  theme: "light" | "dark";
  currentPlan: any | null;
  savedPlans: FitnessPlan[];
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setCurrentPlan: (plan: any) => void;
  savePlan: (userData: any, plan: any) => void;
  deletePlan: (id: string) => void;
  clearCurrentPlan: () => void;
}

export const useFitnessStore = create<FitnessStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      currentPlan: null,
      savedPlans: [],

      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },

      setCurrentPlan: (plan) => set({ currentPlan: plan }),

      savePlan: (userData, plan) => {
        const newPlan: FitnessPlan = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          userData,
          plan,
        };
        set((state) => ({
          savedPlans: [newPlan, ...state.savedPlans].slice(0, 10), // Keep last 10 plans
        }));
      },

      deletePlan: (id) => {
        set((state) => ({
          savedPlans: state.savedPlans.filter((plan) => plan.id !== id),
        }));
      },

      clearCurrentPlan: () => set({ currentPlan: null }),
    }),
    {
      name: "fitness-coach-storage",
    }
  )
);