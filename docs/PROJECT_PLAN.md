# Chit Fund XIRR Calculator – Project Plan

## 1. 🎨 Planning & Requirements

- Define key user stories:
  - As a user, I want to enter the monthly payment, duration, received amount, and start date
  - As a user, I want to see all cash flows and calculated XIRR
- Design minimal and intuitive UI

---

## 2. 🧑‍💻 Frontend

### Tech Stack
- React + TailwindCSS
- Optional: Next.js for routing and SSR

### Components
- InputForm (Payable Amt, Duration, Received Amt, Start Date)
- CashFlowTable (renders month-by-month cash flows)
- ResultCard (shows XIRR %)
- DatePicker (for Start Date input)

### Pages
- Home (input + results)
- About (brief about the app, XIRR concept)

---

## 3. ⚙️ Backend

### Tech Stack
- Option A: Node.js + Express
- Option B: Python (Flask or FastAPI)

### API Endpoints
- POST /calculate-xirr
  - Body: { payableAmt, months, receivedAmt, startDate }
  - Returns: { cashFlows: [...], xirr }

### XIRR Logic
- Convert user input into date-cashflow pairs
- Use XIRR function (IRR with dates) from:
  - Python: numpy.irr with date mapping
  - JS: third-party library like xirr-js or custom implementation

---

## 4. 📦 Deployment

- Frontend:
  - Netlify or Vercel (auto deploy from GitHub)
- Backend:
  - Render or Railway (free tier hosting)
- Optional:
  - Use GitHub Actions for CI/CD

---

## 5. 📋 Testing

- Unit test: XIRR logic
- Integration test: API + Frontend
- Manual test: Various input combinations

---

## 6. 🧾 Deliverables for Resume

- Live App Link
- GitHub Repo (structured with README, planning doc, backend code, frontend code)
- Screenshots or video demo
- Blog or LinkedIn post on end-to-end journey 