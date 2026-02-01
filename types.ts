
export type UserRole = 'admin' | 'staff' | 'viewer';
export type ClientStatus = 'সক্রিয়' | 'সম্পন্ন' | 'বন্ধ';
export type ProjectStatus = 'পেন্ডিং' | 'চলমান' | 'সম্পন্ন' | 'বাতিল';
export type ProjectPriority = 'বেশি' | 'মাঝারি' | 'কম';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Bank Account' | 'Credit Card' | 'Debit Card';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assignedTo: string;
  dueDate: string;
  priority: ProjectPriority;
  status: 'todo' | 'doing' | 'done';
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  revenue: number;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  deadline: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget: number;
  dueAmount: number;
  description: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  details: string; // Phone number or account number or card last 4
  status: 'সম্পন্ন' | 'পেন্ডিং' | 'ব্যর্থ';
}

export interface Sale {
  id: string;
  projectId: string;
  clientId: string;
  amount: number;
  date: string;
  status: 'পরিশোধিত' | 'বকেয়া';
}

export interface Service {
  id: string;
  name: string;
  bnName: string;
  price: number;
  description: string;
}

export interface Target {
  id: string;
  title: string;
  goal: number;
  current: number;
  deadline: string;
}

export interface NavItem {
  id: string;
  name: string;
  bnName: string;
  path: string;
  iconName: string;
  visible: boolean;
}
