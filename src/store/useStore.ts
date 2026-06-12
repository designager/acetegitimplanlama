import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Institution, Schedule } from '../types';

interface AppState {
  institutions: Institution[];
  schedules: Schedule[];
  globalLogo: string | null;
  siteTitle: string;
  siteFavicon: string | null;
  setGlobalLogo: (logo: string | null) => void;
  setSiteTitle: (title: string) => void;
  setSiteFavicon: (favicon: string | null) => void;
  addInstitution: (inst: Institution) => void;
  updateInstitution: (id: string, data: Partial<Institution>) => void;
  deleteInstitution: (id: string) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, data: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      institutions: [],
      schedules: [],
      globalLogo: null,
      siteTitle: 'Kayıt Planı',
      siteFavicon: null,
      
      setGlobalLogo: (logo) => set({ globalLogo: logo }),
      setSiteTitle: (title) => set({ siteTitle: title }),
      setSiteFavicon: (favicon) => set({ siteFavicon: favicon }),
      
      addInstitution: (inst) => set((state) => ({ 
        institutions: [...state.institutions, inst] 
      })),
      
      updateInstitution: (id, data) => set((state) => ({
        institutions: state.institutions.map(inst => 
          inst.id === id ? { ...inst, ...data, updatedAt: new Date().toISOString() } : inst
        )
      })),
      
      deleteInstitution: (id) => set((state) => ({
        institutions: state.institutions.filter(inst => inst.id !== id)
      })),
      
      addSchedule: (schedule) => set((state) => ({
        schedules: [...state.schedules, schedule]
      })),
      
      updateSchedule: (id, data) => set((state) => ({
        schedules: state.schedules.map(sch => 
          sch.id === id ? { ...sch, ...data } : sch
        )
      })),
      
      deleteSchedule: (id) => set((state) => ({
        schedules: state.schedules.filter(sch => sch.id !== id)
      })),
    }),
    {
      name: 'personel-cizelge-storage',
    }
  )
);
