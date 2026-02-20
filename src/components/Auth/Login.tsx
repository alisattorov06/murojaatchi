import { useState, FormEvent } from 'react';
import { useApp } from '../../store';
import { motion } from 'motion/react';

export default function Login({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useApp();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(id, password)) {
      setError('');
    } else {
      setError('Login yoki parol noto‘g‘ri');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Tizimga kirish</h1>
          <p className="text-slate-500 mt-2">UniMurojaat tizimiga xush kelibsiz</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Login yoki ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Kiriting..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200"
          >
            Kirish
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Akkauntingiz yo‘qmi?{' '}
            <button onClick={onSwitchToRegister} className="text-indigo-600 font-medium hover:underline">
              Ro‘yxatdan o‘tish
            </button>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
           <p className="text-xs text-slate-400 text-center">Demo hisoblar:</p>
           <div className="flex justify-center gap-4 mt-2 text-xs text-slate-500">
             <code className="bg-slate-100 px-2 py-1 rounded">Aziz / 123</code>
             <code className="bg-slate-100 px-2 py-1 rounded">Botir / 123</code>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
