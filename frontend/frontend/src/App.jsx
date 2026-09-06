import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css'
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterApplicants from './pages/RecruiterApplicants';
import ProtectedRoute from './pages/ProtectRoute';
function App() {
  

  return (
            // <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route 
                    path="/candidate"
                    element={
                        <ProtectedRoute>
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route 
                    path="/recruiter"
                    element={<ProtectedRoute>
                    <RecruiterDashboard />
                    </ProtectedRoute>}
                />

                <Route
                    path="/applications"
                    element={
                    
                        <RecruiterApplicants />
                }
                />
              
            </Routes>

        

  );
}

export default App
