import React, { useState, useEffect } from "react";
import { SearchHistoryEntry, searchHistoryService } from "../services/searchHistory";
import { formatDate } from "../utils/dateUtils";
import { TrashIcon, PencilIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface SearchHistoryProps {
  onLoadEntry: (cashFlows: SearchHistoryEntry["cashFlows"]) => void;
  onRefresh: () => void;
}

const getIstDummyTitle = (timestamp: string | number | Date) => {
  const dt = new Date(timestamp);
  return `Calculation ${dt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onLoadEntry, onRefresh }) => {
  const [entries, setEntries] = useState<SearchHistoryEntry[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

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
    if (window.confirm("Are you sure you want to clear all search history?")) {
      searchHistoryService.clearAll();
      loadEntries();
    }
  };

  const handleEditLabel = (id: string, currentLabel: string) => {
    setIsEditing(id);
    setEditLabel(currentLabel || "");
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
      <div className="mt-8 p-6 bg-muted/50 dark:bg-muted/20 rounded-lg text-center text-muted-foreground border border-border">
        <p className="font-medium text-foreground mb-1">No saved calculations yet</p>
        <p className="text-sm">
          Run a calculation above — each result is stored here on this device so you can reopen or compare later.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Search History</h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="text-sm text-primary hover:underline flex items-center gap-1"
            aria-label="Refresh history list"
          >
            <ArrowPathIcon className="w-4 h-4" aria-hidden />
            Refresh
          </button>
          <button type="button" onClick={handleClearAll} className="text-sm text-destructive hover:underline">
            Clear all
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {entries.map((entry) => {
          const displayTitle = entry.label?.trim() || getIstDummyTitle(entry.timestamp);
          const monthlyPayment = Math.abs(entry.cashFlows.find((cf) => cf.amount < 0)?.amount || 0);
          const duration = entry.cashFlows.filter((cf) => cf.amount < 0).length;
          const receivedAmount = entry.cashFlows.find((cf) => cf.amount > 0)?.amount || 0;
          const startDate = entry.cashFlows[0]?.date ? new Date(entry.cashFlows[0].date) : null;
          const endDate = entry.cashFlows[entry.cashFlows.length - 1]?.date
            ? new Date(entry.cashFlows[entry.cashFlows.length - 1].date)
            : null;
          const totalInvestment = monthlyPayment * duration;

          return (
            <div key={entry.id} className="bg-card p-4 rounded-lg shadow-sm border border-border">
              <div className="flex justify-between items-start flex-col sm:flex-row gap-3">
                <div className="flex-1 w-full min-w-0">
                  {isEditing === entry.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full">
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="flex-1 px-2 py-1 border border-input rounded-md bg-background w-full"
                        placeholder="Enter label"
                        aria-label="Edit calculation label"
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleSaveLabel(entry.id)}
                          className="flex-1 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(null)}
                          className="flex-1 px-3 py-1 bg-secondary rounded-md text-sm hover:opacity-90"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{displayTitle}</span>
                      <button
                        type="button"
                        onClick={() => handleEditLabel(entry.id, entry.label || displayTitle)}
                        className="text-muted-foreground hover:text-foreground p-1 rounded"
                        aria-label="Rename calculation"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">{formatDate(entry.timestamp)}</div>
                  <div className="mt-2 text-lg font-semibold text-primary">
                    XIRR: {(entry.xirr * 100).toFixed(2)}%
                  </div>
                  <div className="mt-2 text-sm text-foreground/90 space-y-1">
                    <p>Monthly Payment: ₹{monthlyPayment.toLocaleString()}</p>
                    <p>Duration: {duration} months</p>
                    <p>Total Investment: ₹{totalInvestment.toLocaleString()}</p>
                    <p>Received Amount: ₹{receivedAmount.toLocaleString()}</p>
                    <p>Start Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</p>
                    <p>End Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto sm:items-end">
                  <button
                    type="button"
                    onClick={() => handleLoadEntry(entry)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15"
                  >
                    <ArrowPathIcon className="w-4 h-4 shrink-0" aria-hidden />
                    Load in calculator
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border border-destructive/30 text-destructive text-sm hover:bg-destructive/5"
                  >
                    <TrashIcon className="w-4 h-4 shrink-0" aria-hidden />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
