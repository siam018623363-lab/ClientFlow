
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Sales from './pages/Sales';
import Payments from './pages/Payments';
import Targets from './pages/Targets';
import Services from './pages/Services';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Verify from './pages/Auth/Verify';
import { supabase } from './lib/supabase';
import { Client, Project, Task, NavItem, UserProfile, Payment, Sale, Service, Target } from './types';

interface AppContextType {
  language: 'en' | 'bn';
  setLanguage: (l: 'en' | 'bn') => void;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  navItems: NavItem[];
  setNavItems: React.Dispatch<React.SetStateAction<NavItem[]>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  triggerAddClient: () => void;
  setTriggerAddClient: (fn: () => void) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isLoggedIn } = useApp();
  const location = useLocation();
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

function App() {
  const [language, setLanguage] = useState<'en' | 'bn'>('bn');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [addClientFn, setAddClientFn] = useState<() => void>(() => {});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Admin', email: '', phone: '', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);

  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: '1', name: 'Dashboard', bnName: 'ড্যাশবোর্ড', path: '/', iconName: 'LayoutGrid', visible: true },
    { id: '2', name: 'Clients', bnName: 'ক্লায়েন্ট', path: '/clients', iconName: 'Users', visible: true },
    { id: '3', name: 'Projects', bnName: 'প্রজেক্ট', path: '/projects', iconName: 'Briefcase', visible: true },
    { id: '4', name: 'Sales', bnName: 'বিক্রয়', path: '/sales', iconName: 'DollarSign', visible: true },
    { id: '5', name: 'Payments', bnName: 'পেমেন্ট', path: '/payments', iconName: 'CreditCard', visible: true },
    { id: '6', name: 'Targets', bnName: 'টার্গেট', path: '/targets', iconName: 'Target', visible: true },
    { id: '7', name: 'Services', bnName: 'সার্ভিস', path: '/services', iconName: 'Layers', visible: true },
    { id: '8', name: 'Tasks', bnName: 'টাস্ক', path: '/tasks', iconName: 'CheckSquare', visible: true },
    { id: '9', name: 'Settings', bnName: 'সেটিংস', path: '/settings', iconName: 'Settings', visible: true },
  ]);

  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    // Fetch data concurrently
    const [cRes, pRes, sRes, pyRes] = await Promise.all([
      supabase.from('clients').select('*'),
      supabase.from('projects').select('*'),
      supabase.from('sales').select('*'),
      supabase.from('payments').select('*'),
    ]);

    if (cRes.data) setClients(cRes.data);
    if (pRes.data) setProjects(pRes.data);
    if (sRes.data) setSales(sRes.data);
    if (pyRes.data) setPayments(pyRes.data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setUserProfile({
          name: session.user.user_metadata.full_name || 'Admin',
          email: session.user.email || '',
          phone: session.user.user_metadata.phone || '',
          role: 'Admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
        refreshData();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        refreshData();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setClients([]);
    setProjects([]);
  };

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, clients, setClients, projects, setProjects, tasks, setTasks, 
      payments, setPayments, sales, setSales, services, setServices, targets, setTargets,
      navItems, setNavItems, userProfile, setUserProfile,
      triggerAddClient: addClientFn, setTriggerAddClient: setAddClientFn,
      isLoggedIn, setIsLoggedIn, logout, refreshData
    }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-slate-50">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                <div className="flex-1 flex flex-col min-w-0">
                  <Header onMenuClick={() => setIsMobileOpen(true)} />
                  <main className="flex-1 overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/targets" element={<Targets />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
