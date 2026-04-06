# NOMAD — AI Trip Planner & Travel Assistant

---

| Field | Details |
|-------|---------|
| **Name** | Utkarsh Chandak |
| **Registration No.** | 24BCI0156 |
| **Course Code** | BCSE203E |
| **Course Title** | Web Programming |
| **Slot** | L1+L2+L29+L30 |
| **Date** | 06-04-2026 |
| **File Name** | 24BCI0156_L1L2L29L30_MP_UTKARSH_CHANDAK |

---

## 1. Given Problem Statement

Modern travelers face difficulty in planning trips efficiently due to scattered information across multiple platforms. Traditional travel planners require manual input, lack personalization, and do not adapt dynamically to user preferences, budget constraints, or real-time changes.

The problem is to develop an intelligent system that simplifies trip planning by:

* Reducing manual effort
* Providing personalized recommendations
* Generating structured itineraries
* Assisting users throughout their travel journey

---

## 2. Problem Description

Existing travel planning solutions are mostly static and user-driven, requiring individuals to:

* Search destinations manually
* Compare multiple sources for food, stay, and activities
* Estimate budgets without reliable insights
* Create itineraries from scratch

This leads to:

* Time consumption
* Information overload
* Poor decision-making
* Lack of personalization

To address this, NOMAD is enhanced into an AI-powered travel companion that:

* Understands user intent through natural input
* Generates intelligent, day-wise itineraries
* Suggests nearby places dynamically (food, shopping, attractions)
* Predicts and analyzes travel expenses
* Continuously improves based on user behavior

The system integrates Google AI Studio (Gemini API) to enable real-time, intelligent decision-making while maintaining a familiar and user-friendly interface.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| AI Engine | Groq API (LLaMA 3 model) |
| Backend Proxy | Node.js + Express (server.mjs) |
| State Management | React Context API |
| Persistence | localStorage |
| Icons | Google Material Symbols |
| Fonts | Noto Serif, Plus Jakarta Sans, Inter |

---

## 3. Module Details and Key Features

### Module 1: Authentication Module
**Files**: `Login.jsx`, `AuthContext.jsx`

| Feature | Description |
|---------|-------------|
| User Registration | Sign up with name, email, password |
| Login/Logout | Session management via localStorage |
| Protected Routes | Unauthenticated users redirected to login |
| Persistent Sessions | Login state preserved across browser refreshes |

**Key Function** (`AuthContext.jsx`):
```javascript
// Variable: utkarshChandak_24BCI0156_authProvider
export function AuthProvider_24BCI0156({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nomad_isLoggedIn')
    return saved ? JSON.parse(localStorage.getItem('nomad_user')) : null
  })
  // ... authentication logic
}
```

---

### Module 2: Smart Search & NLP Parser (Home Page)
**Files**: `Home.jsx`

| Feature | Description |
|---------|-------------|
| Natural Language Input | Parse queries like "4 days Goa trip with friends" |
| Destination Extraction | Match against 35+ known Indian destinations |
| Duration Parsing | Extract days/weeks from natural text |
| Traveler Detection | Detect solo, couple, friends, family from keywords |
| Budget Intelligence | Infer budget from keywords (luxury, budget, backpack) |
| Interest Mapping | Map keywords to travel interests (adventure, beach, culture) |
| Quick Prompt Chips | One-click example queries for instant generation |

**Key Function** (`Home.jsx`):
```javascript
// Function: parseNaturalQuery_24BCI0156
function parseNaturalQuery(query) {
  const q = query.toLowerCase().trim()
  const answers = {
    destination: '',
    duration: '',
    budget: 50000,
    style: 'Comfortable Mid-range',
    travelerType: 'Solo',
    adults: 1,
    children: 0,
    interests: [],
    // ... 15+ parsed fields
  }
  // NLP extraction logic for destination, duration, etc.
  // Developed by Utkarsh Chandak - 24BCI0156
}
```

---

### Module 3: AI Itinerary Generator
**Files**: `ItineraryResult.jsx`, `ai.js`, `server.mjs`, `defaultItineraries.js`

| Feature | Description |
|---------|-------------|
| Groq AI Integration | Sends structured prompts to LLaMA 3 via secure proxy |
| Structured JSON Output | AI returns day-by-day itinerary in strict JSON schema |
| Fallback System | Default curated itineraries for Jaipur, Goa, Kerala, Varanasi |
| Day-by-Day Format | Morning → Breakfast → Afternoon → Lunch → Evening → Dinner |
| Trip Summary | Total cost, packing tips, general tips, emergency contacts |
| Save/Print/Edit | Export functionality for generated itineraries |

**Key Function** (`ItineraryResult.jsx`):
```javascript
// Function: buildItineraryPrompt_24BCI0156
function buildItineraryPrompt(answers) {
  const dest = answers.destination || 'Jaipur, Rajasthan'
  const numDays = parseInt(answers.duration?.match(/\d+/)?.[0]) || 3
  return `Create a detailed ${numDays}-day travel itinerary for ${dest}, India.
  User preferences:
  - Budget: Rs.${answers.budget.toLocaleString()}
  - Travel style: ${answers.style}
  - Travelers: ${answers.adults} adults, ${answers.children} children
  // ... structured prompt by Utkarsh Chandak 24BCI0156
  `
}
```

**Backend Proxy** (`server.mjs`):
```javascript
// Server: nomadServer_24BCI0156
app.post('/api/chat', async (req, res) => {
  const { system, messages, temperature, max_tokens } = req.body
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: system }, ...messages],
      temperature, max_tokens
    })
  })
  // ... response handling - 24BCI0156
})
```

---

### Module 4: Destination Explorer
**Files**: `Explore.jsx`, `DestinationDetail.jsx`, `destinations.js`

| Feature | Description |
|---------|-------------|
| 25+ Destinations | Curated database with images, ratings, budgets |
| Region Filtering | Filter by North, South, East, West India |
| Search | Real-time search by name or state |
| Destination Detail | Full page with highlights, description, best time to visit |
| AI Q&A | Conversational AI for destination-specific questions |

---

### Module 5: Trip Planner (17-Question Behavioral Engine)
**Files**: `Planner.jsx`

| Feature | Description |
|---------|-------------|
| Multi-Step Form | 17 questions across travel preferences |
| Destination Selection | With auto-complete and suggestions |
| Date Picker | Start & end date with duration calculation |
| Budget Slider | Dynamic budget input |
| Interest Tags | Multi-select for Culture, Adventure, Food, etc. |
| Traveler Config | Adults, children, travel companions |
| Pace Selection | Relaxed, Balanced, or Packed |
| Accommodation Prefs | Hotels, Hostels, Resorts, Airbnb |
| Real-time Validation | Form validation before submission |

---

### Module 6: Expense Tracker
**Files**: `Expenses.jsx`, `TripContext.jsx`

| Feature | Description |
|---------|-------------|
| Add Expenses | Log amount, category, date, notes |
| Categories | Food & Dining, Transport, Stay, Heritage Shopping |
| Budget Bar | Visual progress bar (percentage of budget used) |
| Category Breakdown | Per-category spending visualization |
| Daily Average | Calculated from total expenses |
| Delete Expenses | Remove individual expense entries |
| Home Widget | Compact expense view on dashboard |
| Persistent Storage | Saved to localStorage |

---

### Module 7: Saved Trips & Itinerary Viewer
**Files**: `SavedTrips.jsx`, `Itinerary.jsx`

| Feature | Description |
|---------|-------------|
| Trip Gallery | Card-based grid of all saved trips |
| Detailed View | Full day-by-day itinerary display |
| Delete Trips | Remove saved trips with confirmation |
| Print/Export | Print-friendly layout |
| Backward Compat. | Legacy card layout for old-format trips |

---

### Module 8: User Profile
**Files**: `Profile.jsx`

| Feature | Description |
|---------|-------------|
| User Info | Name, email, avatar |
| Trip Stats | Count of trips created |
| Travel Preferences | Primary rhythm, budget archetype |
| Sign Out | Secure logout with session clearing |

---

## 4. Design Layout (Pictorial Representation of Workflow)

### Application Architecture

```
+-------------------------------------------------------------+
|                    NOMAD - Architecture                      |
|    AI Trip Planner & Travel Assistant - 24BCI0156            |
+-------------------------------------------------------------+
|                                                              |
|  +----------+    +----------+    +----------+                |
|  |  Login   |--->|  Home    |--->| Planner  |                |
|  |  Page    |    | Dashboard|    | (17 Qs)  |                |
|  +----------+    +----+-----+    +----+-----+                |
|                       |               |                      |
|                       v               v                      |
|                 +----------+   +---------------+             |
|                 | Explore  |   | AI Generator  |             |
|                 | 25+ Dest |   | (Groq API)    |             |
|                 +----+-----+   +------+--------+             |
|                      |               |                       |
|                      v               v                       |
|                +----------+  +----------------+              |
|                | Dest.    |  | Itinerary      |              |
|                | Detail   |  | Result Page    |              |
|                +----------+  +------+---------+              |
|                                     |                        |
|                    +----------------+------------+           |
|                    v                v            v           |
|              +----------+     +----------+  +--------+      |
|              | Saved    |     | Expense  |  |Profile |      |
|              | Trips    |     | Tracker  |  |        |      |
|              +----------+     +----------+  +--------+      |
|                                                              |
+-------------------------------------------------------------+
```

### User Flow Diagram

```
User Opens App
     |
     v
+---------+    No    +---------+
|Logged In?|-------->|  Login   |
+----+-----+         |  Page   |
     | Yes           +----+----+
     v                    |
+---------+               |
|  HOME   |<--------------+
|Dashboard|
+----+----+
     |
     +---> Type "4 days Goa trip" --> NLP Parser --> AI Generation --> Itinerary
     |
     +---> Click "Explore" --> Browse 25+ Destinations --> Destination Detail
     |
     +---> Click "Plan a Trip" --> 17-Question Form --> AI Generation --> Itinerary
     |
     +---> Click "Expenses" --> Log/View/Delete Expenses --> Budget Tracking
     |
     +---> Click "Saved Trips" --> View/Delete Saved Itineraries
     |
     +---> Click "Profile" --> View/Edit Profile --> Logout
```

### Data Flow

```
+---------+     +----------+     +------------+     +----------+
| User    |---->| React    |---->| Node.js    |---->| Groq API |
| Input   |     | Frontend |     | Proxy      |     | (LLaMA3) |
+---------+     +----------+     +------------+     +----------+
                     |                                    |
                     v                                    |
               +----------+                               |
               |localStorage|<----- JSON Itinerary <------+
               | (Trips,   |
               |  Expenses,|
               |  Auth)    |
               +----------+
```

---

## 5. User Interface (UI) Design

### Design System

| Token | Value |
|-------|-------|
| **Primary Color** | #0033A0 (Deep Navy Blue) |
| **Accent Color** | #FF9933 (Saffron Orange - India flag) |
| **Background** | #fdf9f3 (Warm Cream) |
| **Text Primary** | #00257b |
| **Heading Font** | Noto Serif (editorial, premium) |
| **Body Font** | Plus Jakarta Sans (modern, clean) |
| **Corner Radius** | 2rem - 3rem (pill-shaped cards) |
| **Icons** | Google Material Symbols Outlined |
| **Effects** | Glassmorphism, gradient overlays, micro-animations |

### Responsive Layout
- **Desktop**: Sidebar navigation (256px fixed) + fluid content area
- **Mobile**: Hamburger menu with fullscreen slide-out drawer
- **Tablet**: Adaptive grid (2-column from 4-column)

### Page Designs

#### Login Page
![Login Page](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_login_1775426979740.png)
*Login page with authentication form, sign-up option, and NOMAD branding*

#### Home Dashboard
![Home Hero](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_home_hero_1775426893615.png)
*Hero section with smart NLP search bar and quick prompt chips*

![Home Widgets](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_home_widgets_1775426895593.png)
*Quick stats (Trips, Spent, Budget, Usage), Recent Trips, and Expense Tracker widget*

#### Explore Destinations
![Explore](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_explore_1775426920999.png)
*25+ destination cards with region filtering and search*

#### Trip Planner
![Planner Top](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_planner_1_1775426931893.png)
*17-question behavioral trip planning engine*

![Planner Details](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_planner_2_1775426933319.png)
*Multi-step form with interest tags, traveler config, budget slider*

#### Saved Trips
![Saved Trips](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_saved_trips_1775426943263.png)
*Trip gallery with card-based layout and delete actions*

#### Itinerary View
![Itinerary Header](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_itinerary_1_1775426954375.png)
*Day-by-day itinerary with Morning/Breakfast/Afternoon/Lunch/Evening/Dinner structure*

![Itinerary Details](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_itinerary_2_1775426955875.png)
*Detailed activity, restaurant, cost, and tip information*

#### Expenses
![Expenses](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_expenses_1775426965553.png)
*Financial ledger with budget tracking, category breakdown, and expense log*

#### Profile
![Profile](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_profile_1775426975743.png)
*User profile with stats, travel preferences, and sign-out*

---

## 6. Source Code (Key Components)

### 6.1 Entry Point (main.jsx)
```jsx
// 24BCI0156 - Utkarsh Chandak - NOMAD Main Entry
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 6.2 Application Router (App.jsx)
```jsx
// 24BCI0156 - Utkarsh Chandak - App Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TripProvider } from './lib/TripContext'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Planner from './pages/Planner'
import ItineraryResult from './pages/ItineraryResult'
import Itinerary from './pages/Itinerary'
import SavedTrips from './pages/SavedTrips'
import Expenses from './pages/Expenses'
import DestinationDetail from './pages/DestinationDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" />
}

export default function App_24BCI0156() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            <Route path="/itinerary/result" element={<ProtectedRoute><ItineraryResult /></ProtectedRoute>} />
            <Route path="/itinerary/:id" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
            <Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/destination/:id" element={<ProtectedRoute><DestinationDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
```

### 6.3 NLP Query Parser (Home.jsx - Smart Search)
```javascript
// parseNaturalQuery_24BCI0156 - Utkarsh Chandak
// Parses natural language like "4 days Goa trip with friends"
function parseNaturalQuery(query) {
  const q = query.toLowerCase().trim()
  if (!q) return null

  const answers_24BCI0156 = {
    destination: '',
    duration: '',
    budget: 50000,
    style: 'Comfortable Mid-range',
    travelerType: 'Solo',
    adults: 1,
    children: 0,
    interests: [],
    pace: 'Balanced',
    accommodation: 'Hotels',
  }

  // Extract destination from 35+ known Indian locations
  const knownDests = [
    'jaipur', 'goa', 'kerala', 'varanasi', 'manali', 'ladakh',
    'udaipur', 'agra', 'rishikesh', 'darjeeling', 'hampi', 'mysore',
    'shimla', 'jaisalmer', 'amritsar', 'andaman', 'kashmir', 'delhi'
  ]
  for (const dest of knownDests) {
    if (q.includes(dest)) {
      answers_24BCI0156.destination = dest.charAt(0).toUpperCase() + dest.slice(1)
      break
    }
  }

  // Extract duration: "4 days" -> 4
  const daysMatch = q.match(/(\d+)\s*(?:days?|nights?)/i)
  if (daysMatch) {
    const days = parseInt(daysMatch[1])
    answers_24BCI0156.duration = `Short trip (${days} days)`
  }

  // Extract traveler type
  if (q.includes('friends')) answers_24BCI0156.travelerType = 'Friends'
  else if (q.includes('family')) answers_24BCI0156.travelerType = 'Family'
  else if (q.includes('couple')) answers_24BCI0156.travelerType = 'Couple'

  // 24BCI0156 - Utkarsh Chandak
  return answers_24BCI0156
}
```

### 6.4 AI Integration (ai.js)
```javascript
// NOMAD AI Service - 24BCI0156 - Utkarsh Chandak
const NOMAD_SYSTEM_24BCI0156 = `You are NOMAD, an AI-powered Trip Planner
    & Travel Assistant for India (Bharat).
    Tone: warm, respectful, concise.`

export async function chatWithNomad_24BCI0156(body) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: body.system ?? NOMAD_SYSTEM_24BCI0156,
      messages: body.messages,
      temperature: body.temperature ?? 0.65,
      max_tokens: body.max_tokens ?? 4096,
    }),
  })
  const data = await res.json()
  return { message: data.message ?? '', model: data.model }
}
```

### 6.5 Trip Context - Global State (TripContext.jsx)
```jsx
// TripContext_24BCI0156 - Utkarsh Chandak
import { createContext, useContext, useEffect, useState } from 'react'

const TripContext = createContext(undefined)

export function TripProvider_24BCI0156({ children }) {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('nomad_trips')
    return saved ? JSON.parse(saved) : [DEFAULT_TRIP]
  })

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('nomad_expenses')
    return saved ? JSON.parse(saved) : []
  })

  const [totalBudget, setTotalBudget] = useState(60000)

  useEffect(() => {
    localStorage.setItem('nomad_trips', JSON.stringify(trips))
  }, [trips])

  const addTrip = (trip) => setTrips((prev) => [trip, ...prev])
  const removeTrip = (id) => setTrips((prev) => prev.filter(t => t.id !== id))
  const addExpense = (expense) => setExpenses((prev) => [
    { ...expense, id: crypto.randomUUID() }, ...prev
  ])

  // 24BCI0156 - Utkarsh Chandak
  return (
    <TripContext.Provider value={{
      trips, expenses, totalBudget,
      addTrip, removeTrip, addExpense, setTotalBudget
    }}>
      {children}
    </TripContext.Provider>
  )
}
```

### 6.6 Backend Proxy Server (server.mjs)
```javascript
// NOMAD Backend - 24BCI0156 - Utkarsh Chandak
import express from 'express'

const app = express()
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  const { system, messages, temperature, max_tokens } = req.body
  try {
    const groqRes = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: system },
            ...messages
          ],
          temperature: temperature ?? 0.7,
          max_tokens: max_tokens ?? 2048,
        }),
      }
    )
    const data = await groqRes.json()
    // 24BCI0156 response processing
    res.json({
      message: data.choices?.[0]?.message?.content ?? '',
      model: data.model,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(8787, () => console.log('[nomad] API at http://localhost:8787'))
```

### 6.7 Sidebar Navigation (Sidebar.jsx)
```jsx
// Sidebar_24BCI0156 - Utkarsh Chandak
const navItems_24BCI0156 = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/explore', label: 'Explore', icon: 'explore' },
  { to: '/planner', label: 'Plan a Trip', icon: 'event_note' },
  { to: '/saved-trips', label: 'Saved Trips', icon: 'bookmark' },
  { to: '/expenses', label: 'Expenses', icon: 'account_balance_wallet' },
  { to: '/profile', label: 'Profile', icon: 'account_circle' },
]

export default function Sidebar() {
  return (
    <aside>
      <div>
        <Link to="/">NOMAD</Link>
        <p>AI Trip Planner & Travel Assistant</p>
        <p>24BCI0156</p>
      </div>
      <nav>
        {navItems_24BCI0156.map(item => (
          <NavLink key={item.to} to={item.to}>
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
```

---

## 7. Input and Output / Screenshots with Timestamp

> All screenshots captured on **06 April 2026, 03:38-03:40 AM IST** from http://localhost:5174

### Input 1: Login Screen
![Login](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_login_1775426979740.png)
*Timestamp: 2026-04-06T03:39:39 IST - User authentication with email and password*

### Output 2: Home Dashboard with Smart Search
![Home](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_home_hero_1775426893615.png)
*Timestamp: 2026-04-06T03:38:13 IST - Smart NLP search bar with prompt chips*

### Output 3: Dashboard Widgets
![Widgets](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_home_widgets_1775426895593.png)
*Timestamp: 2026-04-06T03:38:15 IST - Quick stats, recent trips, expense tracker*

### Input 4: Trip Planner Form
![Planner](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_planner_1_1775426931893.png)
*Timestamp: 2026-04-06T03:38:51 IST - 17-question behavioral planning engine*

### Output 5: AI-Generated Itinerary
![Itinerary](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_itinerary_1_1775426954375.png)
*Timestamp: 2026-04-06T03:39:14 IST - DAY 1 header with structured format*

### Output 6: Itinerary Day Details
![Details](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_itinerary_2_1775426955875.png)
*Timestamp: 2026-04-06T03:39:15 IST - Morning/Breakfast/Afternoon/Lunch/Evening/Dinner*

### Output 7: Destination Explorer
![Explore](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_explore_1775426920999.png)
*Timestamp: 2026-04-06T03:38:40 IST - 25+ curated destinations with filtering*

### Output 8: Expense Tracker
![Expenses](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_expenses_1775426965553.png)
*Timestamp: 2026-04-06T03:39:25 IST - Budget tracking with category breakdown*

### Output 9: Saved Trips Gallery
![Saved](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_saved_trips_1775426943263.png)
*Timestamp: 2026-04-06T03:39:03 IST - Card-based trip archive*

### Output 10: User Profile
![Profile](file:///c:/Users/utkar/Desktop/NOMAD2.0/docs/doc_profile_1775426975743.png)
*Timestamp: 2026-04-06T03:39:35 IST - User info, stats, and preferences*

---

## 8. Portfolio Link

> **Utkarsh Chandak - Developer Portfolio**
> 
> Portfolio: [https://utkarshchandak.dev](https://utkarshchandak.dev)
> 
> GitHub: [https://github.com/utkarshchandak](https://github.com/utkarshchandak)

---

## Project File Structure

```
NOMAD2.0/
|-- index.html                    # Root HTML
|-- server.mjs                    # Node.js backend proxy (Groq API)
|-- package.json                  # Dependencies
|-- vite.config.js                # Vite configuration
|-- .env                          # Environment variables (GROQ_API_KEY)
|-- docs/                         # Documentation screenshots
|
+-- src/
    |-- main.jsx                  # React entry point
    |-- App.jsx                   # Router & protected routes
    |-- index.css                 # Global styles
    |
    |-- components/
    |   |-- Sidebar.jsx           # Navigation sidebar
    |   +-- Icon.jsx              # Material Symbols wrapper
    |
    |-- data/
    |   |-- destinations.js       # 25+ destination database
    |   +-- defaultItineraries.js # Fallback itineraries
    |
    |-- lib/
    |   |-- TripContext.jsx       # Global state (trips, expenses)
    |   |-- AuthContext.jsx       # Authentication state
    |   +-- ai.js                 # Groq AI service
    |
    +-- pages/
        |-- Home.jsx              # Dashboard + NLP search
        |-- Login.jsx             # Authentication
        |-- Explore.jsx           # Destination browser
        |-- DestinationDetail.jsx # Single destination view
        |-- Planner.jsx           # 17-question planner
        |-- ItineraryResult.jsx   # AI-generated itinerary
        |-- Itinerary.jsx         # Saved itinerary viewer
        |-- SavedTrips.jsx        # Trip gallery
        |-- Expenses.jsx          # Expense tracker
        +-- Profile.jsx           # User profile
```

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variable
echo "GROQ_API_KEY=your_key_here" > .env

# 3. Start development server (frontend + backend)
npm run dev

# App runs at: http://localhost:5174
# API runs at: http://localhost:8787
```

---

**Developed by Utkarsh Chandak | 24BCI0156 | BCSE203E Web Programming | VIT**

*NOMAD - Your AI Trip Planner & Travel Assistant*
