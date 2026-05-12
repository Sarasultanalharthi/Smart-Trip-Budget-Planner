# Smart Trip Budget Planner
 
**Student Name:** Sara sultan Alharthi  
**Student ID:** 1909093  
 
---

## Project Overview

Smart Trip Budget Planner is a React.js web application that helps travelers manage their trip budgets effectively. Users can register accounts, create trips with a defined budget and currency, log categorized expenses, and visualize their spending through an interactive pie chart. The application also integrates a live currency conversion API, allowing users to add expenses in any currency, which are automatically converted to the trip's base currency.

---

## Features

- **User Authentication** — Register and log in securely. Sessions are persisted via `localStorage`.
- **Protected Routes** — Unauthenticated users cannot access the dashboard or trip pages.
- **Trip Management** — Create and delete trips with a destination, total budget, and base currency.
- **Expense Tracking** — Log expenses by category (Accommodation, Food, Transport, Entertainment, Other).
- **Live Currency Conversion** — Expenses entered in a foreign currency are converted to the trip's base currency using the Open Exchange Rates API.
- **Visual Analytics** — A Pie Chart shows the spending breakdown by category.
- **Responsive Design** — The UI adapts to all screen sizes using Vanilla CSS.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend framework |
| React Router DOM | Page routing and navigation |
| React Context API | Global state management |
| localStorage | Data persistence  |
| Recharts | Expense pie chart |
| Open Exchange Rates API | Live currency conversion |
| CSS | Styling |

---

## Project Structure

```
src/
├── assets/
│   └── hero.png
├── components/
│   ├── Navbar.jsx
│   ├── Navbar.css
│   └── ProtectedRoute.jsx
├── context/
│   ├── AuthContext.jsx
│   └── TripContext.jsx
├── pages/
│   ├── Landing.jsx / Landing.css
│   ├── Login.jsx
│   ├── Register.jsx / Auth.css
│   ├── Dashboard.jsx / Dashboard.css
│   └── TripDetails.jsx / TripDetails.css
├── App.jsx
├── App.css
└── index.css
```

---

## Installation & Running Locally

**1. Clone the repository:**
```bash
git clone https://github.com/sszalharthi5-ops/Smart-Trip-Budget-Planner.git
cd SmartTripPlanner
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```

**4. Open browser and navigate to:** `http://localhost:5173`

---

## How to Use

1. Open the application — you will land on the Home page.
2. Click **Register** to create a new account.
3. After logging in, click **Add New Trip** on the Dashboard (e.g., *Paris, 3000 EUR*).
4. Open the trip and click **Add Expense** to log a cost.
5. To test currency conversion, add an expense in a different currency (e.g., USD) — it will be automatically converted to the trip currency.
6. View the **Pie Chart** to see how your budget is distributed across categories.

---

## External API

I used the **[Open Exchange Rates API](https://open.er-api.com)** for live currency conversion.

- **Endpoint used:** `https://open.er-api.com/v6/latest/{currency}`
- If an expense is entered in a currency different from the trip's base currency, the app fetches the latest rate and converts the amount before saving.
