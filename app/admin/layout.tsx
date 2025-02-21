'use client';
import { SessionProvider } from 'next-auth/react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
