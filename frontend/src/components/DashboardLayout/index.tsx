import React, { ReactNode } from 'react';
import Sidebar from '../SideBar';
import Header from '../DashboardHeader';
import "../../app/globals.css";

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  return (

    <div className="flex h-screen bg-gray-100 text-black">

      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;