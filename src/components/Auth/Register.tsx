import { useState, FormEvent } from 'react';
import { useApp } from '../../store';
import { motion } from 'motion/react';

const FACULTIES = [
  'Axborot texnologiyalari',
  'Iqtisodiyot',
  'Huquqshunoslik',
  'Filologiya',
  'Tibbiyot'
];

export default function Register({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    faculty: '',
    direction: '',
    group: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    register({
      ...formData,
      role: 'student'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Ro‘yxatdan o‘tish</h1>
          <p className="text-slate-500 mt-2">Talaba sifatida tizimga qo‘shiling</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ism</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Familiya</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={formData.surname}
                onChange={e => setFormData({...formData, surname: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fakultet</label>
            <select
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              value={formData.faculty}
              onChange={e => setFormData({...formData, faculty: e.target.value})}
            >
              <option value="">Tanlang...</option>
              {FACULTIES.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Yo‘nalish</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Masalan: Dasturlash"
                value={formData.direction}
                onChange={e => setFormData({...formData, direction: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guruh</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="912-21"
                value={formData.group}
                onChange={e => setFormData({...formData, group: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parol</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm shadow-indigo-200 mt-2"
          >
            Ro‘yxatdan o‘tish
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Allaqachon hisobingiz bormi?{' '}
            <button onClick={onSwitchToLogin} className="text-indigo-600 font-medium hover:underline">
              Kirish
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
