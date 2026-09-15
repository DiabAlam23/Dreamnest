import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-[#1e293b] transition-colors">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
