import React from 'react';
import Sidebar from './Sidebar';

export const AppShell = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
