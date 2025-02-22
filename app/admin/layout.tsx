'use client';
import { SessionProvider } from 'next-auth/react';
import { AppSidebar, SidebarProvider } from '@/components/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-screen p-6 ml-6">{children}</main>
      </SidebarProvider>
    </SessionProvider>
  );
}
