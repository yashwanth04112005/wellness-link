import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/Layout/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MySessionsPage from './pages/MySessionsPage';
import NewSessionPage from './pages/NewSessionPage';
import EditSessionPage from './pages/EditSessionPage';

function App() {
  return (
    <Router>
      <AuthProvider> 
        <div className="flex flex-col min-h-screen bg-gray-100"> 
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} /> 
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} /> 

              <Route
                path="/my-sessions"
                element={<ProtectedRoute component={MySessionsPage} />}
              />
              <Route
                path="/my-sessions/new"
                element={<ProtectedRoute component={NewSessionPage} />}
              />
              <Route
                path="/my-sessions/edit/:id"
                element={<ProtectedRoute component={EditSessionPage} />}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;