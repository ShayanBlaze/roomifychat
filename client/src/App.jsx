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
import MainLayout from "./components/layout/MainLayout";
import PublicLayout from "./components/layout/PublicLayout";
import { SocketProvider } from "./features/auth/context/SocketProvider";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
            {/* Public Routes with Fixed Header */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route element={<PublicRoutes />}>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat/:conversationId" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
