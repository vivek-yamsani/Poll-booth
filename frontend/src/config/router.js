import { Route, Routes } from "react-router-dom";
import LoginForm from "../pages/Login";
import Poll from "../pages/poll";
import RegisterForm from "../pages/Register";
import Teams from "../pages/team";
import TeamDashboard from "../pages/TeamDashboard";
import ProtectedRoute from "./ProtectedRoute";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/signIn" element={<LoginForm />} />
      <Route path="/signUp" element={<RegisterForm />} />
      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/:teamId"
        element={
          <ProtectedRoute>
            <TeamDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/polls/:teamId/:pollId"
        element={
          <ProtectedRoute>
            <Poll />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default Router;
