import { useState, FormEvent } from 'react';
import { useApp } from '../../store';
import { motion } from 'motion/react';
import ChatWindow from '../Chat/ChatWindow';
import { Plus, MessageSquare, Search, User as UserIcon, LogOut } from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, tickets, createTicket, logout } = useApp();
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');

  const myTickets = tickets.filter(t => t.studentId === currentUser?.id).sort((a, b) => b.createdAt - a.createdAt);
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (newTicketTitle && newTicketMessage) {
      createTicket(newTicketTitle, newTicketMessage);
      setIsCreating(false);
      setNewTicketTitle('');
      setNewTicketMessage('');
      // Automatically select the newest ticket (which is the first one now)
      // We need to wait for state update or just let the user see it in list
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar / List */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${activeTicketId ? 'hidden md:flex' : 'flex'}`}>
        {/* User Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
              {currentUser?.name[0]}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{currentUser?.name}</h3>
              <p className="text-xs text-slate-500">{currentUser?.group}</p>
            </div>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4">
          <button 
            onClick={() => setIsCreating(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} />
            Yangi murojaat
          </button>
        </div>

        {/* Ticket List */}
        <div className="flex-1 overflow-y-auto">
          {myTickets.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
              <p>Murojaatlar yo‘q</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {myTickets.map(ticket => (
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
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
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
              <p>Murojaatni tanlang yoki yangisini yarating</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Yangi murojaat</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mavzu</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Murojaat mavzusi..."
                  value={newTicketTitle}
                  onChange={e => setNewTicketTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Xabar</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  placeholder="Murojaatingiz mazmuni..."
                  value={newTicketMessage}
                  onChange={e => setNewTicketMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm shadow-indigo-200 transition-colors"
                >
                  Yuborish
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
