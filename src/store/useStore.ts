import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Institution, Schedule } from '../types';

interface AppState {
  institutions: Institution[];
  schedules: Schedule[];
  globalLogo: string | null;
  siteTitle: string;
  siteFavicon: string | null;
  isLoading: boolean;
  
  fetchInitialData: () => Promise<void>;
  
  setGlobalLogo: (logo: string | null) => Promise<void>;
  setSiteTitle: (title: string) => Promise<void>;
  setSiteFavicon: (favicon: string | null) => Promise<void>;
  
  addInstitution: (inst: Institution) => Promise<void>;
  updateInstitution: (id: string, data: Partial<Institution>) => Promise<void>;
  deleteInstitution: (id: string) => Promise<void>;
  
  addSchedule: (schedule: Schedule) => Promise<void>;
  updateSchedule: (id: string, data: Partial<Schedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  institutions: [],
  schedules: [],
  globalLogo: null,
  siteTitle: 'Kayıt Planı',
  siteFavicon: null,
  isLoading: true,

  fetchInitialData: async () => {
    set({ isLoading: true });
    
    // Fetch institutions
    const { data: instData } = await supabase.from('institutions').select('*');
    if (instData) set({ institutions: instData });

    // Fetch schedules
    const { data: schData } = await supabase.from('schedules').select('*');
    if (schData) set({ schedules: schData });

    // Fetch settings
    const { data: setData } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (setData) {
      set({
        globalLogo: setData.globalLogo,
        siteTitle: setData.siteTitle || 'Kayıt Planı',
        siteFavicon: setData.siteFavicon
      });
    }
    
    set({ isLoading: false });
  },

  setGlobalLogo: async (logo) => {
    set({ globalLogo: logo });
    await supabase.from('settings').update({ globalLogo: logo }).eq('id', 1);
  },
  
  setSiteTitle: async (title) => {
    set({ siteTitle: title });
    await supabase.from('settings').update({ siteTitle: title }).eq('id', 1);
  },
  
  setSiteFavicon: async (favicon) => {
    set({ siteFavicon: favicon });
    await supabase.from('settings').update({ siteFavicon: favicon }).eq('id', 1);
  },

  addInstitution: async (inst) => {
    set((state) => ({ institutions: [...state.institutions, inst] }));
    await supabase.from('institutions').insert(inst);
  },
  
  updateInstitution: async (id, data) => {
    set((state) => ({
      institutions: state.institutions.map(inst => 
        inst.id === id ? { ...inst, ...data, updatedAt: new Date().toISOString() } : inst
      )
    }));
    await supabase.from('institutions').update({ ...data, updatedAt: new Date().toISOString() }).eq('id', id);
  },
  
  deleteInstitution: async (id) => {
    set((state) => ({ institutions: state.institutions.filter(inst => inst.id !== id) }));
    await supabase.from('institutions').delete().eq('id', id);
  },

  addSchedule: async (schedule) => {
    set((state) => ({ schedules: [...state.schedules, schedule] }));
    await supabase.from('schedules').insert(schedule);
  },
  
  updateSchedule: async (id, data) => {
    set((state) => ({
      schedules: state.schedules.map(sch => sch.id === id ? { ...sch, ...data } : sch)
    }));
    await supabase.from('schedules').update(data).eq('id', id);
  },
  
  deleteSchedule: async (id) => {
    set((state) => ({ schedules: state.schedules.filter(sch => sch.id !== id) }));
    await supabase.from('schedules').delete().eq('id', id);
  },
}));
