import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/auth/home";
import SignInPage from "./pages/auth/signIn";
import SignUpPage from "./pages/auth/signUp";
import "./App.css";
import BaseLayout from "./layout/baseLayout";
import PermissionPage from "./pages/permission";
import UsersPage from "./pages/users"

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
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/permission" element={<BaseLayout><PermissionPage/></BaseLayout>} />
      <Route path="/users" element={<BaseLayout><UsersPage/></BaseLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
