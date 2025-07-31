import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import HomePage from "./components/pages/HomePage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./components/pages/Dashboard";
import AuthProvider from "./context/AuthProvider";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
