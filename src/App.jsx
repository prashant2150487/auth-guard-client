import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/auth/home'
import SignInPage from './pages/auth/signIn'
import SignUpPage from './pages/auth/signUp'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
