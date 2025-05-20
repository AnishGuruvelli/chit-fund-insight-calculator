# Chit Fund XIRR Calculator

## 🎯 Purpose

This app is designed to calculate the XIRR (Extended Internal Rate of Return) for a Chit Fund investment, based on user inputs like monthly payable amount, duration, total amount paid, lump sum received, and start date. 

It's a fully functional product intended to demonstrate full-stack development and end-to-end product lifecycle skills — from ideation to deployment — showcasing product management capability.

---

## 🧮 Inputs

- **Payable Amount**: Amount paid every month (e.g., ₹10,000)
- **Duration (Months)**: Total number of months the amount is paid (e.g., 24)
- **Total Amount Paid**: Payable amount × number of months (e.g., ₹240,000)
- **Received Amount**: Final lump sum amount received (e.g., ₹300,000)
- **Start Date**: Date when the payments start (e.g., Jan 1, 2025)

---

## 📈 Output

- **Cash Flow Table**: Displays each monthly outflow (-₹10,000) and the final inflow (+₹300,000)
- **Calculated XIRR**: Annualized return on investment based on all cash flows

---

## 💡 Sample Calculation

Given:
- ₹10,000 monthly for 24 months
- ₹300,000 received at the end
- Start date: Jan 1, 2025

Cash Flow:
| Date         | Cash Flow |
|--------------|-----------|
| Jan 1, 2025  | -10000    |
| ...          | ...       |
| Dec 1, 2026  | -10000    |
| Jan 1, 2027  | +300000   |

Output:
- **XIRR**: 22.99%

---

## ⚙️ Tech Stack (Proposed)

- Frontend: React (with Tailwind for UI)
- Backend: Node.js + Express or Python (Flask/FastAPI)
- Calculation Engine: JavaScript/Python XIRR logic
- Deployment: Vercel/Netlify (Frontend), Render/Heroku (Backend) 