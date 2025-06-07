# 📄 Product Requirements Document (PRD) – ChitX v2: Search History

## ✨ Feature: Search History (Local Search Log)

### 📌 Objective
Allow users to view a log of all past chit fund calculations (searches) performed within the app. This improves user recall, encourages repeated use, and adds depth to the user experience without requiring login/authentication.

## 🎯 Goals
- Help users revisit past XIRR calculations without re-entering data
- Boost app stickiness and repeat engagement

## 🧩 User Stories
1. **As a user**, I want to see a list of my previous searches, so I can quickly recheck results without redoing inputs
2. **As a user**, I want to clear my search history if I wish to remove old records

## 🛠️ Scope (MVP – MoSCoW)

### Must Have
- Store each search entry (date, cash flows, XIRR result) locally using `localStorage`
- Display search history in reverse chronological order
- Show key info: date, inputs, XIRR

### Should Have
- Allow user to delete individual entries or clear all history
- Compact, scrollable UI integrated below or beside the calculator

### Could Have (Future)
- Allow users to name/label each search
- Export history as CSV
- Cloud sync (post-login version)

### Won't Have (Now)
- User accounts / authentication
- Cross-device sync

## 📐 UX/UI Design
- History section appears **below the calculator** as a collapsible card
- Each entry shows:
  - timestamp
  - XIRR output (e.g., 17.6%) and the input parameters
  - Icon/button to reload
  - Optional delete icon
- Empty state: "No previous searches yet"
- Max 50 entries stored to avoid bloat

## 🔧 Tech Stack
- **Storage**: `localStorage` or `IndexedDB` (for structured JSON storage)
- **UI**: Tailwind cards with vertical list
- **Logic**: Capture data at every "Calculate" action and append to local log

## 🧪 Testing & QA
- Test for proper localStorage handling across browsers
- Confirm data persists after refresh, clears when deleted
- Validate performance impact on large number of entries

## 📈 Success Metrics
- ≥ 60% of active users have at least 1 saved search
- ≥ 30% of users reload a saved calculation within 7 days
- 0 critical bugs from local data persistence

## 🧠 Notes
- This feature adds tangible long-term value without backend infra
- Can be pitched as a user-friendly memory feature or "search journal" 