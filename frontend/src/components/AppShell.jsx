import React from 'react';
import Sidebar from './Sidebar';
import SOSButton from './SOSButton';

export const AppShell = ({ children, showSOS = true }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
      {/* SOS Button - Always visible when in authenticated pages */}
      {showSOS && <SOSButton />}
    </div>
  );
};

export default AppShell;
