import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bots from './pages/Bots';
import Trades from './pages/Trades';
import Welcome from './pages/Welcome';
import ProtectedRoute from './pages/ProtectedRoute';
import Layout from './pages/Layout';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} pauseOnFocusLoss={false} />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bots" element={<Bots />} />
          <Route path="trades" element={<Trades />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
