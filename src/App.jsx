import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Community from "./pages/Community"
import UploadNote from "./pages/UploadNote"
import Profile from "./pages/Profile"
import Tutor from "./pages/Tutor"
import MyNotes from "./pages/MyNotes"
import Quiz from "./pages/Quiz"
import NoteDetails from "./pages/NoteDetails"
import AITutor from "./pages/AITutor"
import ProgressTracking from "./pages/ProgressTracking"

import ProtectedRoute from "./components/ProtectedRoute"
const API = import.meta.env.VITE_API_URL

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Auth Pages */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Pages */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mynotes"
          element={
            <ProtectedRoute>
              <MyNotes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor"
          element={
            <ProtectedRoute>
              <Tutor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/note/:id"
          element={<NoteDetails />}
        />

        <Route
          path="/ai-tutor/:id"
          element={<AITutor />}
        />

        <Route

          path="/progress"

          element={<ProgressTracking/>}

        />

      </Routes>

    </BrowserRouter>

  )

}

export default App