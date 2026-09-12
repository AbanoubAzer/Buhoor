import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './context/ToastContext';

// Lazy loading for code splitting and faster initial load
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Developers = lazy(() => import('./pages/Developers'));
const Projects = lazy(() => import('./pages/Projects'));
const Units = lazy(() => import('./pages/Units'));
const Locations = lazy(() => import('./pages/Locations'));
const UnitTypes = lazy(() => import('./pages/UnitTypes'));
const Admins = lazy(() => import('./pages/Admins'));
const HeroSlides = lazy(() => import('./pages/HeroSlidesPage'));
const Login = lazy(() => import('./pages/Login'));
const Leads = lazy(() => import('./pages/Leads'));

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const PageLoader = () => (
  <div className="flex h-full min-h-[50vh] w-full items-center justify-center" dir="rtl">
    <div className="flex flex-col items-center gap-3 text-indigo-600">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
      <span className="text-sm font-arabic font-medium">جارِ التحميل...</span>
    </div>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/units" element={<Units />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/unit-types" element={<UnitTypes />} />
                <Route path="/hero-slides" element={<HeroSlides />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/leads" element={<Leads />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
