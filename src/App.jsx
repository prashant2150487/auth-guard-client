import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/auth/home";
import SignInPage from "./pages/auth/signIn";
import SignUpPage from "./pages/auth/signUp";
import "./App.css";
import BaseLayout from "./layout/baseLayout";
import PermissionPage from "./pages/permission";
import UsersPage from "./pages/users";
import DocsPage from "./pages/docs";
import UsersProject from "./pages/docs/UsersProject";
import PermissionsProject from "./pages/docs/PermissionsProject";
import RolesProject from "./pages/docs/RolesProject";
import ProtectedRoute from "./routes/ProtectedRoute";

const adminRoles = ["Admin", "Security Director"];
const managementRoles = ["Admin", "Manager", "Security Director"];

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <BaseLayout>
            <HomePage />
          </BaseLayout>
        }
      />
      <Route
        path="/sign-in"
        element={
          <BaseLayout>
            <SignInPage />
          </BaseLayout>
        }
      />
      <Route
        path="/sign-up"
        element={
          <BaseLayout>
            <SignUpPage />
          </BaseLayout>
        }
      />
      <Route
        path="/permission"
        element={
          <ProtectedRoute allowedRoles={adminRoles} fallbackPath="/sign-in">
            <BaseLayout>
              <PermissionPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={managementRoles} fallbackPath="/sign-in">
            <BaseLayout>
              <UsersPage />
            </BaseLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/docs"
        element={
          <BaseLayout>
            <DocsPage />
          </BaseLayout>
        }
      />
      <Route
        path="/docs/users-project"
        element={
          <BaseLayout>
            <UsersProject />
          </BaseLayout>
        }
      />
      <Route
        path="/docs/permissions-project"
        element={
          <BaseLayout>
            <PermissionsProject />
          </BaseLayout>
        }
      />
      <Route
        path="/docs/roles-project"
        element={
          <BaseLayout>
            <RolesProject />
          </BaseLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
