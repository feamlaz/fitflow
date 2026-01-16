import { UserProfile, WorkoutSession, NutritionDay, WeightEntry, MeasurementEntry } from '@/types';

/**
 * IndexedDB storage service for offline-first functionality
 */
class StorageService {
  private dbName = 'fitflow-db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // User profile store
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }

        // Workout sessions store
        if (!db.objectStoreNames.contains('workoutSessions')) {
          const workoutStore = db.createObjectStore('workoutSessions', { keyPath: 'id' });
          workoutStore.createIndex('date', 'startTime');
        }

        // Nutrition data store
        if (!db.objectStoreNames.contains('nutritionDays')) {
          const nutritionStore = db.createObjectStore('nutritionDays', { keyPath: 'date' });
          nutritionStore.createIndex('date', 'date');
        }

        // Weight entries store
        if (!db.objectStoreNames.contains('weightEntries')) {
          const weightStore = db.createObjectStore('weightEntries', { keyPath: 'id' });
          weightStore.createIndex('date', 'date');
        }

        // Measurement entries store
        if (!db.objectStoreNames.contains('measurementEntries')) {
          const measurementStore = db.createObjectStore('measurementEntries', { keyPath: 'id' });
          measurementStore.createIndex('date', 'date');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  // User Profile methods
  async saveUserProfile(profile: UserProfile): Promise<void> {
    const store = await this.getStore('userProfile', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(profile);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const store = await this.getStore('userProfile');
    return new Promise((resolve, reject) => {
      const request = store.get('user-profile');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Workout sessions methods
  async saveWorkoutSession(session: WorkoutSession): Promise<void> {
    const store = await this.getStore('workoutSessions', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(session);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveWorkoutSessions(sessions: WorkoutSession[]): Promise<void> {
    for (const session of sessions) {
      await this.saveWorkoutSession(session);
    }
  }

  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    const store = await this.getStore('workoutSessions');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkoutSessionsByDateRange(startDate: Date, endDate: Date): Promise<WorkoutSession[]> {
    const store = await this.getStore('workoutSessions');
    return new Promise((resolve, reject) => {
      const index = store.index('date');
      const range = IDBKeyRange.bound(startDate, endDate);
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Nutrition methods
  async saveNutritionDay(nutritionDay: NutritionDay): Promise<void> {
    const store = await this.getStore('nutritionDays', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(nutritionDay);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getNutritionDay(date: Date): Promise<NutritionDay | null> {
    const store = await this.getStore('nutritionDays');
    const dateString = date.toISOString().split('T')[0];
    return new Promise((resolve, reject) => {
      const request = store.get(dateString);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getNutritionDaysByDateRange(startDate: Date, endDate: Date): Promise<NutritionDay[]> {
    const store = await this.getStore('nutritionDays');
    return new Promise((resolve, reject) => {
      const index = store.index('date');
      const range = IDBKeyRange.bound(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      const request = index.getAll(range);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Weight entries methods
  async saveWeightEntry(entry: WeightEntry): Promise<void> {
    const store = await this.getStore('weightEntries', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    const store = await this.getStore('weightEntries');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWeightEntry(id: string): Promise<void> {
    const store = await this.getStore('weightEntries', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Measurement entries methods
  async saveMeasurementEntry(entry: MeasurementEntry): Promise<void> {
    const store = await this.getStore('measurementEntries', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMeasurementEntries(): Promise<MeasurementEntry[]> {
    const store = await this.getStore('measurementEntries');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Settings methods
  async saveSetting(key: string, value: any): Promise<void> {
    const store = await this.getStore('settings', 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    const store = await this.getStore('settings');
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onsuccess = () => {
        this.db = null;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async exportData(): Promise<any> {
    const userProfile = await this.getUserProfile();
    const workoutSessions = await this.getWorkoutSessions();
    const nutritionDays = await this.getNutritionDaysByDateRange(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
      new Date()
    );
    const weightEntries = await this.getWeightEntries();
    const measurementEntries = await this.getMeasurementEntries();

    return {
      userProfile,
      workoutSessions,
      nutritionDays,
      weightEntries,
      measurementEntries,
      exportDate: new Date().toISOString()
    };
  }

  async importData(data: any): Promise<void> {
    if (data.userProfile) {
      await this.saveUserProfile(data.userProfile);
    }
    if (data.workoutSessions) {
      for (const session of data.workoutSessions) {
        await this.saveWorkoutSession(session);
      }
    }
    if (data.nutritionDays) {
      for (const day of data.nutritionDays) {
        await this.saveNutritionDay(day);
      }
    }
    if (data.weightEntries) {
      for (const entry of data.weightEntries) {
        await this.saveWeightEntry(entry);
      }
    }
    if (data.measurementEntries) {
      for (const entry of data.measurementEntries) {
        await this.saveMeasurementEntry(entry);
      }
    }
  }
}

export const storageService = new StorageService();
