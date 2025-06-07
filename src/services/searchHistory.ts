import { CashFlow } from '../types/calculator';

export interface SearchHistoryEntry {
  id: string;
  timestamp: number;
  cashFlows: CashFlow[];
  xirr: number;
  label?: string;
}

const STORAGE_KEY = 'chitx_search_history';
const MAX_ENTRIES = 50;

export const searchHistoryService = {
  // Get all search history entries
  getAllEntries: (): SearchHistoryEntry[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  },

  // Add a new entry
  addEntry: (cashFlows: CashFlow[], xirr: number, label?: string): void => {
    try {
      const entries = searchHistoryService.getAllEntries();
      const newEntry: SearchHistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        cashFlows,
        xirr,
        label,
      };

      // Add new entry at the beginning
      entries.unshift(newEntry);

      // Keep only the latest MAX_ENTRIES
      const trimmedEntries = entries.slice(0, MAX_ENTRIES);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedEntries));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  },

  // Delete a specific entry
  deleteEntry: (id: string): void => {
    try {
      const entries = searchHistoryService.getAllEntries();
      const filteredEntries = entries.filter(entry => entry.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    } catch (error) {
      console.error('Error deleting search history entry:', error);
    }
  },

  // Clear all history
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  },

  // Update entry label
  updateLabel: (id: string, label: string): void => {
    try {
      const entries = searchHistoryService.getAllEntries();
      const updatedEntries = entries.map(entry =>
        entry.id === id ? { ...entry, label } : entry
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error updating search history label:', error);
    }
  },
}; 