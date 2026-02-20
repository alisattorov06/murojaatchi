/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AppProvider, useApp } from './store';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import StaffDashboard from './components/Dashboard/StaffDashboard';

function Main() {
  const { currentUser } = useApp();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (!currentUser) {
    return authView === 'login' 
      ? <Login onSwitchToRegister={() => setAuthView('register')} />
      : <Register onSwitchToLogin={() => setAuthView('login')} />;
  }

  return currentUser.role === 'student' ? <StudentDashboard /> : <StaffDashboard />;
}

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
