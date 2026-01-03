import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import '../styles/Layout.css';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-container">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`main-content ${!isSidebarOpen ? 'expanded' : ''}`}>
          <div className="content-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
