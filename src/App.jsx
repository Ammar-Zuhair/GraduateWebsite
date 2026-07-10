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



function AppContent() {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const { students } = useData();
  const [activePage, _setActivePage] = useState('home');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [inviteToken, setInviteToken] = useState(null);

  // Wrapper to sync page state changes with the browser URL and history stack
  const setActivePage = (pageId, pushState = true, studentId = null) => {
    if (studentId) {
      setSelectedStudentId(studentId);
    }
    _setActivePage(pageId);
    const targetStudentId = studentId || selectedStudentId;
    if (pushState) {
      try {
        if (pageId === 'profile' && targetStudentId) {
          window.history.pushState({ page: pageId, studentId: targetStudentId }, '', `?page=${pageId}&id=${targetStudentId}`);
        } else {
          window.history.pushState({ page: pageId }, '', `?page=${pageId}`);
        }
      } catch (err) {
        console.warn("History pushState blocked by browser sandbox:", err);
      }
    }
  };

  // Sync state back when browser back/forward navigation is triggered
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        if (event.state.page === 'profile' && event.state.studentId) {
          setSelectedStudentId(event.state.studentId);
        }
        _setActivePage(event.state.page);
      } else {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || 'home';
        const id = params.get('id');
        if (page === 'profile' && id) {
          setSelectedStudentId(id);
        }
        _setActivePage(page);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedStudentId]);

  // Initial routing hook on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const page = params.get('page');
    const id = params.get('id');
    let shouldClear = false;

    if (token === 'grad2026-secure-invite' || token === 'admin2026-secure-invite') {
      setInviteToken(token);
      sessionStorage.setItem('inviteToken', token);
      _setActivePage('register-student');
      shouldClear = true;
    } else if (params.get('login') === 'true') {
      _setActivePage('login');
      shouldClear = true;
    } else if (page) {
      if (page === 'profile' && id) {
        setSelectedStudentId(id);
      }
      if (page === 'register-student') {
        const storedToken = sessionStorage.getItem('inviteToken');
        if (storedToken) {
          setInviteToken(storedToken);
        }
      }
      _setActivePage(page);
    } else {
      try {
        window.history.replaceState({ page: 'home' }, '', '?page=home');
      } catch (err) {
        console.warn("History replaceState blocked:", err);
      }
    }

    if (shouldClear) {
      try {
        window.history.replaceState({ page: 'register-student' }, document.title, window.location.pathname + `?page=register-student`);
      } catch (err) {
        console.warn("History replaceState blocked:", err);
      }
    }
  }, []);

  const viewStudentProfile = (studentId) => {
    setSelectedStudentId(studentId);
    setActivePage('profile', true, studentId);
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
