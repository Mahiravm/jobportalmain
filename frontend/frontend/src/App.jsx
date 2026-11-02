import { Routes, Route } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterApplicants from './pages/RecruiterApplicants';
import ProtectedRoute from './pages/ProtectRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
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
        element={
          <ProtectedRoute>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <RecruiterApplicants />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
