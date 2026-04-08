import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TripProvider } from './lib/TripContext'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Planner from './pages/Planner'
import Itinerary from './pages/Itinerary'
import Community from './pages/Community'
import Expenses from './pages/Expenses'
import Login from './pages/Login'
import Signup from './pages/Signup'
import DestinationDetail from './pages/DestinationDetail'
import SavedTrips from './pages/SavedTrips'
import ItineraryResult from './pages/ItineraryResult'
import Profile from './pages/Profile'
import About from './pages/About'
import ChatBot from './components/ChatBot'

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/destination/:id" element={<ProtectedRoute><DestinationDetail /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            <Route path="/saved-trips" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
            <Route path="/itinerary/result" element={<ProtectedRoute><ItineraryResult /></ProtectedRoute>} />
            <Route path="/itinerary" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
            <Route path="/itinerary/:id" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ChatBot />
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  )
}
