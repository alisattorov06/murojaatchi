export type Role = 'student' | 'staff';

export type User = {
  id: string;
  name: string;
  surname: string;
  role: Role;
  faculty?: string; // For both students and staff (staff belongs to a faculty)
  direction?: string; // Student only
  group?: string; // Student only
  password?: string; // Mock password
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean; // For system messages like "Ticket resolved"
};

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type Ticket = {
  id: string;
  studentId: string;
  studentName: string;
  faculty: string;
  title: string;
  status: TicketStatus;
  createdAt: number;
  messages: Message[];
  pendingConfirmation?: boolean; // If staff marked as resolved, waiting for student
};
