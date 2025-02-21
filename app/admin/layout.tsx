'use client';
import { SessionProvider } from 'next-auth/react';
import { AppSidebar, SidebarProvider } from '@/components/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-6 lg:ml-64">{children}</main>
      </SidebarProvider>
    </SessionProvider>
  );
}
