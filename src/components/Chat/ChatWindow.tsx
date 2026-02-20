import { useState, useEffect, useRef, FormEvent } from 'react';
import { useApp } from '../../store';
import { Ticket, Message } from '../../types';
import { Send, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatWindowProps {
  ticket: Ticket;
  onBack: () => void;
}

export default function ChatWindow({ ticket, onBack }: ChatWindowProps) {
  const { currentUser, sendMessage, resolveTicket, confirmResolution } = useApp();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(ticket.id, messageText);
    setMessageText('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><AlertCircle size={12} /> Yangi</span>;
      case 'in_progress': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><Clock size={12} /> Jarayonda</span>;
      case 'resolved': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Hal etildi</span>;
      default: return null;
    }
  };

  const isStaff = currentUser?.role === 'staff';

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 md:hidden">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-slate-900 line-clamp-1">{ticket.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500">{ticket.studentName}</span>
              <span className="text-slate-300">•</span>
              {getStatusBadge(ticket.status)}
            </div>
          </div>
        </div>
        
        {isStaff && ticket.status !== 'resolved' && !ticket.pendingConfirmation && (
          <button 
            onClick={() => resolveTicket(ticket.id)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Hal etildi
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {ticket.messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.id;
          const isSystem = msg.isSystem;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="bg-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'} p-3 shadow-sm`}>
                {!isMe && <p className="text-xs font-semibold mb-1 opacity-70">{msg.senderName}</p>}
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Confirmation Modal Area */}
      <AnimatePresence>
        {ticket.pendingConfirmation && !isStaff && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 bg-emerald-50 border-t border-emerald-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900">Xodim masalani hal etildi deb belgiladi.</p>
                <p className="text-xs text-emerald-700">Tasdiqlaysizmi?</p>
              </div>
              <button 
                onClick={() => confirmResolution(ticket.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
              >
                Tasdiqlash
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      {ticket.status !== 'resolved' && (
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!messageText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            <Send size={20} />
          </button>
        </form>
      )}
      
      {ticket.status === 'resolved' && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-slate-500 text-sm">
          Ushbu murojaat yopilgan.
        </div>
      )}
    </div>
  );
}
