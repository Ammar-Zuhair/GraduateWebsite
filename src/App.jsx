import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import MemoriesPage from './pages/MemoriesPage';
import SendWishPage from './pages/SendWishPage';
import DiaryPage from './pages/DiaryPage';
import SponsorsPage from './pages/SponsorsPage';
import AdminPage from './pages/AdminPage';
import StudentRegisterPage from './pages/StudentRegisterPage';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import NewsPage from './pages/NewsPage';
import DeanSpeechPage from './pages/DeanSpeechPage';
import LoginPage from './pages/LoginPage';
import CreateStudentProfilePage from './pages/CreateStudentProfilePage';
import StudentWishesPage from './pages/StudentWishesPage';

// Particle Falling Caps Component
function FallingCaps() {
  const [caps, setCaps] = useState([]);

  useEffect(() => {
    // Generate floating cap emojis randomly
    const generateCap = () => {
      const id = Date.now() + Math.random();
      const style = {
        left: `${Math.random() * 100}vw`,
        animationDuration: `${Math.random() * 2 + 3}s`, // between 3-5 seconds
        transform: `rotate(${Math.random() * 360}deg)`
      };
      setCaps(prev => [...prev, { id, style }]);

      // Clean up after animation finishes
      setTimeout(() => {
        setCaps(prev => prev.filter(c => c.id !== id));
      }, 5000);
    };

    // Spawn caps every 1.5 seconds at the footer
    const interval = setInterval(generateCap, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden select-none">
      {caps.map(cap => (
        <span
          key={cap.id}
          style={cap.style}
          className="falling-cap block"
        >
          🎓
        </span>
      ))}
    </div>
  );
}

function AppContent() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const { students } = useData();
  const [activePage, setActivePage] = useState('home');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [inviteToken, setInviteToken] = useState(null);

  // Invitation link hook detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    let shouldClear = false;

    if (token === 'grad2026-secure-invite' || token === 'admin2026-secure-invite') {
      setInviteToken(token);
      setActivePage('register-student');
      shouldClear = true;
    }
    if (params.get('login') === 'true') {
      setActivePage('login');
      shouldClear = true;
    }

    if (shouldClear) {
      // Remove query parameters from URL bar without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const viewStudentProfile = (studentId) => {
    setSelectedStudentId(studentId);
    setActivePage('profile');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'students':
        return <StudentsPage viewStudentProfile={viewStudentProfile} />;
      case 'profile':
        return (
          <StudentProfilePage
            studentId={selectedStudentId}
            onBack={() => setActivePage('students')}
          />
        );
      case 'memories':
        return <MemoriesPage />;
      case 'send-wish':
        return <SendWishPage setActivePage={setActivePage} />;
      case 'diary':
        return <DiaryPage />;
      case 'sponsors':
        return <SponsorsPage />;
      case 'admin':
        return <AdminPage />;
      case 'register-student':
        return <StudentRegisterPage setActivePage={setActivePage} inviteToken={inviteToken} />;
      case 'login':
        return <LoginPage setActivePage={setActivePage} />;
      case 'my-profile':
        const myStudent = students.find(s => s.user_id === user?.id);
        if (myStudent) {
          return (
            <StudentProfilePage
              studentId={myStudent.id}
              onBack={() => setActivePage('home')}
            />
          );
        }
        return <CreateStudentProfilePage setActivePage={setActivePage} />;
      case 'my-wishes':
        const studentForWishes = students.find(s => s.user_id === user?.id);
        if (studentForWishes) {
          return (
            <StudentWishesPage
              studentId={studentForWishes.id}
              onBack={() => setActivePage('home')}
            />
          );
        }
        return <CreateStudentProfilePage setActivePage={setActivePage} />;
      case 'map':
        return <MapPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'news':
        return <NewsPage />;
      case 'dean':
        return <DeanSpeechPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-on-surface transition-colors duration-300">
      <Header activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-grow flex flex-col items-center">
        {renderPage()}
      </main>

      {/* Particle emitter for graduation caps */}
      <FallingCaps />

      <Footer setActivePage={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
