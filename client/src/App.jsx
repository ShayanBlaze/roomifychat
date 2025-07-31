import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import HomePage from "./components/pages/HomePage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoutes from "./features/auth/routes/ProtectedRoutes";
import Dashboard from "./components/pages/Dashboard";
import ChatPage from "./features/chat/pages/ChatPage";
import AuthProvider from "./features/auth/context/AuthProvider";

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
