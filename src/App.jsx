import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CheckerPage from './pages/CheckerPage/CheckerPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckerPage />} />
        <Route path="/check" element={<CheckerPage />} />
        
        <Route path="/auth" element={<LoginPage />} />     
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/privacy" element={<PrivacyPage />} /> */}
        {/* <Route path="/terms" element={<TermsPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;