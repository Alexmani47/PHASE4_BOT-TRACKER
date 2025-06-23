import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bots from './pages/Bots';
import Trades from './pages/Trades';
import Strategies from './pages/Strategies';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <ToastContainer position="top-right" autoClose={3000} pauseOnFocusLoss={false} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bots"
            element={
              <ProtectedRoute>
                <Bots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trades"
            element={
              <ProtectedRoute>
                <Trades />
              </ProtectedRoute>
            }
          />
          <Route
            path="/strategies"
            element={
              <ProtectedRoute>
                <Strategies />
              </ProtectedRoute>
            }
          />
          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
