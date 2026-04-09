import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { StandaloneGuard } from './components/StandaloneGuard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Diary from './pages/Diary';
import Routine from './pages/Routine';
import Vault from './pages/Vault';
import Events from './pages/Events';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  
  if (!state.isLoaded) return null;

  if (!state.profile) {
    return <Navigate to="/signup" replace />;
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { state } = useStore();

  React.useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  if (!state.isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 bg-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <StandaloneGuard>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={state.profile ? <Navigate to="/login" replace /> : <SignUp />} />
          <Route path="/login" element={state.isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
            <Route index element={<Home />} />
            <Route path="diary" element={<Diary />} />
            <Route path="routine" element={<Routine />} />
            <Route path="vault" element={<Vault />} />
            <Route path="events" element={<Events />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StandaloneGuard>
  );
}
