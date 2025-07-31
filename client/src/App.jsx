import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import HomePage from "./components/pages/HomePage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Dashboard from "./components/pages/Dashboard";
import AuthProvider from "./context/AuthProvider";

function App() {

  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <Dashboard />
                </ProtectedRoutes>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
