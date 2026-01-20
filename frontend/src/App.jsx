import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Leaderboard from './pages/Leaderboard';
import Licensing from './pages/Licensing';
import Contact from './pages/Contact';
import PageTitle from './components/PageTitle';
import PinAuth from './pages/PinAuth';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, isPinVerified } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (!isPinVerified) return <Navigate to="/pin-auth" />;

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <PageTitle />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pin-auth" element={<PinAuth />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/licensing" element={<Licensing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/leaderboard" element={<Leaderboard />} /> {/* Added Leaderboard route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
