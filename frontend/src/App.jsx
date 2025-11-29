import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="grow">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/sign-in"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <SignIn />}
            />
            <Route
              path="/sign-up"
              element={currentUser ? <Navigate to="/dashboard" replace /> : <SignUp />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
