import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { User, Ticket, Message, Role } from './types';

// Mock initial data
const MOCK_USERS: User[] = [
  {
    id: 's1',
    name: 'Aziz',
    surname: 'Rahimov',
    role: 'student',
    faculty: 'Axborot texnologiyalari',
    direction: 'Dasturiy injiniring',
    group: '912-21',
    password: '123'
  },
  {
    id: 'x1',
    name: 'Botir',
    surname: 'Aliyev',
    role: 'staff',
    faculty: 'Axborot texnologiyalari',
    password: '123'
  }
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 't1',
    studentId: 's1',
    studentName: 'Aziz Rahimov',
    faculty: 'Axborot texnologiyalari',
    title: 'Imtihon jadvali bo‘yicha savol',
    status: 'open',
    createdAt: Date.now() - 100000,
    messages: [
      {
        id: 'm1',
        senderId: 's1',
        senderName: 'Aziz Rahimov',
        text: 'Assalomu alaykum, yakuniy imtihonlar qachon boshlanadi?',
        timestamp: Date.now() - 100000
      }
    ]
  }
];

interface AppContextType {
  currentUser: User | null;
  users: User[];
  tickets: Ticket[];
  login: (id: string, password: string) => boolean;
  register: (user: Omit<User, 'id'>) => void;
  logout: () => void;
  createTicket: (title: string, initialMessage: string) => void;
  sendMessage: (ticketId: string, text: string) => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  resolveTicket: (ticketId: string) => void; // Staff action
  confirmResolution: (ticketId: string) => void; // Student action
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

  const login = (idOrName: string, password: string) => {
    const user = users.find(u => (u.id === idOrName || u.name === idOrName) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'id'>) => {
    const newUser = { ...userData, id: Math.random().toString(36).substr(2, 9) };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createTicket = (title: string, initialMessage: string) => {
    if (!currentUser) return;
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: currentUser.id,
      studentName: `${currentUser.name} ${currentUser.surname}`,
      faculty: currentUser.faculty || 'General',
      title,
      status: 'open',
      createdAt: Date.now(),
      messages: [
        {
          id: Math.random().toString(36).substr(2, 9),
          senderId: currentUser.id,
          senderName: `${currentUser.name} ${currentUser.surname}`,
          text: initialMessage,
          timestamp: Date.now()
        }
      ]
    };
    setTickets([newTicket, ...tickets]);
  };

  const sendMessage = (ticketId: string, text: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: currentUser.id,
          senderName: `${currentUser.name} ${currentUser.surname}`,
          text,
          timestamp: Date.now()
        };
        // If staff replies, change status to in_progress
        let newStatus = t.status;
        if (currentUser.role === 'staff' && t.status === 'open') {
          newStatus = 'in_progress';
        }
        return { ...t, messages: [...t.messages, newMessage], status: newStatus };
      }
      return t;
    }));
  };

  const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, pendingConfirmation: true } : t));
  };

  const confirmResolution = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'resolved',
          pendingConfirmation: false,
          messages: [
            ...t.messages,
            {
              id: 'sys-' + Date.now(),
              senderId: 'system',
              senderName: 'Tizim',
              text: 'Murojaat talaba tomonidan yopildi.',
              timestamp: Date.now(),
              isSystem: true
            }
          ]
        };
      }
      return t;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      tickets,
      login,
      register,
      logout,
      createTicket,
      sendMessage,
      updateTicketStatus,
      resolveTicket,
      confirmResolution
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
