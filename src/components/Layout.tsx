import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { User } from '@supabase/supabase-js';

interface LayoutProps {
  children?: React.ReactNode;
  user?: User;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="app-layout">
      <Header user={user} />
      <main className="main-content">
        {children || <Outlet />}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
