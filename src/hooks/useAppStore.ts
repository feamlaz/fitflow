import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import React from 'react';
import { UserProfile, WorkoutSession, NutritionDay, WeightEntry, MeasurementEntry, AppSettings } from '../types';
import { storageService } from '../services/storage';

interface AppState {
  // User data
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  
  // Workout data
  workoutSessions: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => void;
  updateWorkoutSession: (id: string, updates: Partial<WorkoutSession>) => void;
  
  // Nutrition data
  nutritionDays: NutritionDay[];
  setNutritionDay: (day: NutritionDay) => void;
  
  // Progress data
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: WeightEntry) => void;
  deleteWeightEntry: (id: string) => void;
  
  measurementEntries: MeasurementEntry[];
  addMeasurementEntry: (entry: MeasurementEntry) => void;
  
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // Actions
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
  exportData: () => Promise<any>;
  clearAllData: () => Promise<void>;
}

const defaultSettings: AppSettings = {
  notifications: true,
  darkMode: true,
  units: 'metric',
  language: 'ru',
  autoSync: true,
  reminderTime: '05:00'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfile: null,
      workoutSessions: [],
      nutritionDays: [],
      weightEntries: [],
      measurementEntries: [],
      settings: defaultSettings,

      // User profile actions
      setUserProfile: (profile) => {
        set({ userProfile: profile });
        if (profile) {
          storageService.saveUserProfile(profile);
        }
      },

      // Workout actions
      addWorkoutSession: (session) => {
        const { workoutSessions } = get();
        const updatedSessions = [...workoutSessions, session];
        set({ workoutSessions: updatedSessions });
        storageService.saveWorkoutSession(session);
      },

      updateWorkoutSession: (id, updates) => {
        const { workoutSessions } = get();
        const updatedSessions = workoutSessions.map(session =>
          session.id === id ? { ...session, ...updates } : session
        );
        set({ workoutSessions: updatedSessions });
        const updatedSession = updatedSessions.find(s => s.id === id);
        if (updatedSession) {
          storageService.saveWorkoutSession(updatedSession);
        }
      },

      // Nutrition actions
      setNutritionDay: (day) => {
        const { nutritionDays } = get();
        const existingIndex = nutritionDays.findIndex(
          d => d.date.toDateString() === day.date.toDateString()
        );
        
        let updatedDays;
        if (existingIndex >= 0) {
          updatedDays = [...nutritionDays];
          updatedDays[existingIndex] = day;
        } else {
          updatedDays = [...nutritionDays, day];
        }
        
        set({ nutritionDays: updatedDays });
        storageService.saveNutritionDay(day);
      },

      // Weight entries actions
      addWeightEntry: (entry) => {
        const { weightEntries } = get();
        const updatedEntries = [...weightEntries, entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        set({ weightEntries: updatedEntries });
        storageService.saveWeightEntry(entry);
      },

      deleteWeightEntry: (id) => {
        const { weightEntries } = get();
        const updatedEntries = weightEntries.filter(entry => entry.id !== id);
        set({ weightEntries: updatedEntries });
        storageService.deleteWeightEntry(id);
      },

      // Measurement entries actions
      addMeasurementEntry: (entry) => {
        const { measurementEntries } = get();
        const updatedEntries = [...measurementEntries, entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        set({ measurementEntries: updatedEntries });
        storageService.saveMeasurementEntry(entry);
      },

      // Settings actions
      updateSettings: (updates) => {
        const { settings } = get();
        const updatedSettings = { ...settings, ...updates };
        set({ settings: updatedSettings });
        
        // Save individual settings to IndexedDB
        Object.entries(updates).forEach(([key, value]) => {
          storageService.saveSetting(key, value);
        });
      },

      // Data management actions
      loadData: async () => {
        try {
          const userProfile = await storageService.getUserProfile();
          const workoutSessions = await storageService.getWorkoutSessions();
          const weightEntries = await storageService.getWeightEntries();
          const measurementEntries = await storageService.getMeasurementEntries();
          
          // Load nutrition days for last 30 days
          const endDate = new Date();
          const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          const nutritionDays = await storageService.getNutritionDaysByDateRange(startDate, endDate);
          
          // Load settings
          const notifications = await storageService.getSetting('notifications');
          const darkMode = await storageService.getSetting('darkMode');
          const units = await storageService.getSetting('units');
          const language = await storageService.getSetting('language');
          const autoSync = await storageService.getSetting('autoSync');
          const reminderTime = await storageService.getSetting('reminderTime');
          
          const settings: AppSettings = {
            notifications: notifications ?? defaultSettings.notifications,
            darkMode: darkMode ?? defaultSettings.darkMode,
            units: units ?? defaultSettings.units,
            language: language ?? defaultSettings.language,
            autoSync: autoSync ?? defaultSettings.autoSync,
            reminderTime: reminderTime ?? defaultSettings.reminderTime
          };
          
          set({
            userProfile,
            workoutSessions,
            nutritionDays,
            weightEntries,
            measurementEntries,
            settings
          });
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      },

      saveData: async () => {
        try {
          const { userProfile, workoutSessions, nutritionDays, weightEntries, measurementEntries } = get();
          
          if (userProfile) {
            await storageService.saveUserProfile(userProfile);
          }
          
          for (const session of workoutSessions) {
            await storageService.saveWorkoutSession(session);
          }
          
          for (const day of nutritionDays) {
            await storageService.saveNutritionDay(day);
          }
          
          for (const entry of weightEntries) {
            await storageService.saveWeightEntry(entry);
          }
          
          for (const entry of measurementEntries) {
            await storageService.saveMeasurementEntry(entry);
          }
        } catch (error) {
          console.error('Failed to save data:', error);
        }
      },

      exportData: async () => {
        try {
          return await storageService.exportData();
        } catch (error) {
          console.error('Failed to export data:', error);
          return null;
        }
      },

      clearAllData: async () => {
        try {
          await storageService.clearAllData();
          set({
            userProfile: null,
            workoutSessions: [],
            nutritionDays: [],
            weightEntries: [],
            measurementEntries: [],
            settings: defaultSettings
          });
        } catch (error) {
          console.error('Failed to clear data:', error);
        }
      }
    }),
    {
      name: 'fitflow-store',
      partialize: (state) => ({
        userProfile: state.userProfile,
        settings: state.settings
      })
    }
  )
);

// Hook to initialize data on app start
export const useInitializeApp = () => {
  const loadData = useAppStore((state) => state.loadData);
  
  React.useEffect(() => {
    loadData();
  }, [loadData]);
};
