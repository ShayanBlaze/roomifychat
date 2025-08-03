import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./features/auth/pages/LoginPage";
import HomePage from "./components/pages/HomePage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProtectedRoutes from "./features/auth/routes/ProtectedRoutes";
import Dashboard from "./components/pages/Dashboard";
import ChatPage from "./features/chat/pages/ChatPage";
import AuthProvider from "./features/auth/context/AuthProvider";
import PublicRoutes from "./features/auth/routes/PublicRoutes";
import ProfilePage from "./features/profile/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Public Routes but not authenticated */}
          <Route element={<PublicRoutes />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected Routes needs authentication */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
