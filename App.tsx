
import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
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
import Landing from './pages/Landing';
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
  setNavItems: (items: NavItem[]) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  saveSettings: (updatedNav: NavItem[]) => Promise<void>;
  tempRegData: any | null;
  setTempRegData: React.Dispatch<React.SetStateAction<any | null>>;
  setStoredUser: (user: any) => void;
  isClientModalOpen: boolean;
  setIsClientModalOpen: (val: boolean) => void;
  clientToEdit: Client | null;
  setClientToEdit: (client: Client | null) => void;
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
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'User', email: '', phone: '', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [tempRegData, setTempRegData] = useState<any | null>(null);

  const defaultNav: NavItem[] = [
    { id: '1', name: 'Dashboard', bnName: 'ড্যাশবোর্ড', path: '/dashboard', iconName: 'LayoutGrid', visible: true },
    { id: '2', name: 'Clients', bnName: 'ক্লায়েন্ট', path: '/clients', iconName: 'Users', visible: true },
    { id: '3', name: 'Projects', bnName: 'প্রজেক্ট', path: '/projects', iconName: 'Briefcase', visible: true },
    { id: '4', name: 'Sales', bnName: 'বিক্রয়', path: '/sales', iconName: 'DollarSign', visible: true },
    { id: '5', name: 'Payments', bnName: 'পেমেন্ট', path: '/payments', iconName: 'CreditCard', visible: true },
    { id: '6', name: 'Targets', bnName: 'টার্গেট', path: '/targets', iconName: 'Target', visible: true },
    { id: '7', name: 'Services', bnName: 'সার্ভিস', path: '/services', iconName: 'Layers', visible: true },
    { id: '8', name: 'Tasks', bnName: 'টাস্ক', path: '/tasks', iconName: 'CheckSquare', visible: true },
    { id: '9', name: 'Settings', bnName: 'সেটিংস', path: '/settings', iconName: 'Settings', visible: true },
  ];

  const [navItems, setNavItems] = useState<NavItem[]>(defaultNav);

  const refreshData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;
    
    const [cRes, pRes, sRes, pyRes, tRes, svRes, trRes, setRes] = await Promise.all([
      supabase.from('clients').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('projects').select('*').eq('user_id', userId),
      supabase.from('sales').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('payments').select('*').eq('user_id', userId),
      supabase.from('tasks').select('*').eq('user_id', userId),
      supabase.from('services').select('*').eq('user_id', userId),
      supabase.from('targets').select('*').eq('user_id', userId),
      supabase.from('user_settings').select('nav_config').eq('user_id', userId).maybeSingle()
    ]);

    if (cRes.data) setClients(cRes.data);
    if (pRes.data) setProjects(pRes.data);
    if (sRes.data) setSales(sRes.data);
    if (pyRes.data) setPayments(pyRes.data);
    if (tRes.data) setTasks(tRes.data);
    if (svRes.data) setServices(svRes.data);
    if (trRes.data) setTargets(trRes.data);
    if (setRes.data?.nav_config) setNavItems(setRes.data.nav_config);
  };

  const saveSettings = async (updatedNav: NavItem[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.user.id;
    await supabase.from('user_settings').upsert({ user_id: userId, nav_config: updatedNav }, { onConflict: 'user_id' });
    setNavItems(updatedNav);
  };

  const setStoredUser = (user: any) => {
    if (user) {
      setUserProfile({
        name: user.name || 'User',
        email: user.email || '',
        phone: user.phone || '',
        role: 'Admin',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
      });
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        const metadata = session.user.user_metadata;
        setUserProfile({
          name: metadata.full_name || 'Admin',
          email: session.user.email || '',
          phone: metadata.phone || '',
          role: 'Admin',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`
        });
        refreshData();
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    setNavItems(defaultNav);
  };

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, clients, setClients, projects, setProjects, tasks, setTasks, 
      payments, setPayments, sales, setSales, services, setServices, targets, setTargets,
      navItems, setNavItems, userProfile, setUserProfile,
      isLoggedIn, setIsLoggedIn, logout, refreshData, saveSettings,
      tempRegData, setTempRegData, setStoredUser,
      isClientModalOpen, setIsClientModalOpen, clientToEdit, setClientToEdit
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-slate-50 w-full max-w-full overflow-x-hidden relative">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
                  <Header onMenuClick={() => setIsMobileOpen(true)} />
                  <main className="flex-1 overflow-x-hidden w-full">
                    <div className="w-full max-w-full overflow-x-hidden px-0">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/targets" element={<Targets />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
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
