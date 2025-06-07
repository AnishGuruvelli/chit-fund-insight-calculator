import React, { useState, useEffect } from 'react';
import { SearchHistoryEntry, searchHistoryService } from '../services/searchHistory';
import { formatDate } from '../utils/dateUtils';
import { TrashIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface SearchHistoryProps {
  onLoadEntry: (cashFlows: SearchHistoryEntry['cashFlows']) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onLoadEntry }) => {
  const [entries, setEntries] = useState<SearchHistoryEntry[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    setEntries(searchHistoryService.getAllEntries());
  };

  const handleDelete = (id: string) => {
    searchHistoryService.deleteEntry(id);
    loadEntries();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all search history?')) {
      searchHistoryService.clearAll();
      loadEntries();
    }
  };

  const handleEditLabel = (id: string, currentLabel: string) => {
    setIsEditing(id);
    setEditLabel(currentLabel || '');
  };

  const handleSaveLabel = (id: string) => {
    searchHistoryService.updateLabel(id, editLabel);
    setIsEditing(null);
    loadEntries();
  };

  const handleLoadEntry = (entry: SearchHistoryEntry) => {
    onLoadEntry(entry.cashFlows);
  };

  if (entries.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
        No previous searches yet
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Search History</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing === entry.id ? (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                      placeholder="Enter label"
                    />
                    <button
                      onClick={() => handleSaveLabel(entry.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(null)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">
                      {entry.label || 'Unnamed Calculation'}
                    </span>
                    <button
                      onClick={() => handleEditLabel(entry.id, entry.label || '')}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {formatDate(entry.timestamp)}
                </div>
                <div className="mt-2 text-lg font-semibold text-blue-600">
                  XIRR: {entry.xirr.toFixed(2)}%
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLoadEntry(entry)}
                  className="p-2 text-blue-500 hover:text-blue-700"
                  title="Load this calculation"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Delete this entry"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 