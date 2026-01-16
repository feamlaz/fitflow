import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
