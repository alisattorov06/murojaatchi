import { useState } from 'react';
import { useApp } from '../../store';
import ChatWindow from '../Chat/ChatWindow';
import { MessageSquare, LogOut, Filter } from 'lucide-react';

export default function StaffDashboard() {
  const { currentUser, tickets, logout } = useApp();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  // Filter tickets for this staff's faculty
  const facultyTickets = tickets.filter(t => t.faculty === currentUser?.faculty);
  
  const filteredTickets = facultyTickets.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'open') return t.status === 'open' || t.status === 'in_progress';
    if (filter === 'resolved') return t.status === 'resolved';
    return true;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar / List */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${activeTicketId ? 'hidden md:flex' : 'flex'}`}>
        {/* User Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">
              {currentUser?.name[0]}
            </div>
            <div>
              <h3 className="font-semibold">{currentUser?.name}</h3>
              <p className="text-xs text-slate-400">{currentUser?.faculty} (Xodim)</p>
            </div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-white transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-2 grid grid-cols-3 gap-1 border-b border-slate-100">
          <button 
            onClick={() => setFilter('all')}
            className={`py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Barchasi
          </button>
          <button 
            onClick={() => setFilter('open')}
            className={`py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'open' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Faol
          </button>
          <button 
            onClick={() => setFilter('resolved')}
            className={`py-2 text-xs font-medium rounded-lg transition-colors ${filter === 'resolved' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Yopilgan
          </button>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
              <p>Murojaatlar topilmadi</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filteredTickets.map(ticket => (
                <div 
                  key={ticket.id}
                  onClick={() => setActiveTicketId(ticket.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${activeTicketId === ticket.id ? 'bg-indigo-50/50 border-r-2 border-indigo-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-sm line-clamp-1 ${activeTicketId === ticket.id ? 'text-indigo-900' : 'text-slate-900'}`}>{ticket.title}</h4>
                    {ticket.status === 'open' && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></span>}
                    {ticket.status === 'in_progress' && <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></span>}
                    {ticket.status === 'resolved' && <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{ticket.studentName}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {ticket.messages[ticket.messages.length - 1].text}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.pendingConfirmation && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                        Tasdiqlash kutilmoqda
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!activeTicketId ? 'hidden md:flex' : 'flex'}`}>
        {activeTicket ? (
          <ChatWindow ticket={activeTicket} onBack={() => setActiveTicketId(null)} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-slate-300" />
              </div>
              <p>Murojaatni tanlang</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
