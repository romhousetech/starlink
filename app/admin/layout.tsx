'use client';
import { SessionProvider } from 'next-auth/react';
import { AppSidebar, SidebarProvider } from '@/components/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="h-screen w-full overflow-y-auto">
          <main className="h-full p-6 ml-6 w-full">{children}</main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
