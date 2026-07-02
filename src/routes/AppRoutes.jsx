import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Dashboard from "../pages/Dashboard"
import Community from "../pages/Community"
import Profile from "../pages/Profile"

import MyNotes from "../pages/MyNotes"
import Tutor from "../pages/Tutor"
import Quiz from "../pages/Quiz"

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/community" element={<Community />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/mynotes" element={<MyNotes />} />

        <Route path="/tutor" element={<Tutor />} />

        <Route path="/quiz" element={<Quiz />} />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes