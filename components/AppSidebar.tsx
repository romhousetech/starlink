'use client';
import React, { useState, createContext, useContext } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Package,
  Home,
  User2,
  ChevronDown,
  ChevronUp,
  Menu,
  LogOut,
  Users,
} from 'lucide-react';

// Create context for sidebar state
const SidebarContext = createContext({
  isOpen: true,
  toggle: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="flex">{children}</div>
    </SidebarContext.Provider>
  );
};

const MenuItem = ({ item }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className="flex items-center w-full px-4 py-2 text-white hover:bg-primary
         rounded-lg transition-colors"
      >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="flex-1 text-left">{item.title}</span>
        {item.submenu && (
          <span className="ml-auto">
            {isSubmenuOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {item.submenu && isSubmenuOpen && (
        <div className="ml-6 mt-2 space-y-1">
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.url}
              className="block px-4 py-2 text-sm text-white hover:bg-primary
               rounded-lg transition-colors"
            >
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const AppSidebar = () => {
  const { data: session } = useSession();
  const { isOpen, toggle } = useContext(SidebarContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const username = session?.user?.name || 'User';

  const items = [
    {
      title: 'Products',
      icon: Package,
      submenu: [
        { title: 'List', url: '/admin/products' },
        { title: 'Create', url: '/admin/products/add' },
      ],
    },
    {
      title: 'Subscribers',
      icon: Home,
      submenu: [
        { title: 'List', url: '/admin/subscribers' },
        { title: 'Distribution', url: '/admin/subscribers/distribution' },
        { title: 'Create', url: '/admin/subscribers/add' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 h-screen
          w-64 bg-[#0f172a] border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">ROM HOUSE</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <MenuItem key={item.title} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center w-full px-4 py-2 text-white hover:bg-primary rounded-lg transition-colors"
            >
              <User2 className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{username}</span>
              {isProfileOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg- border border-gray-200 rounded-lg shadow-lg bg-[#0f172a]">
                <Link
                  href="/admin/users"
                  className="flex items-center px-4 py-2 text-sm text-white hover:bg-primary
                  "
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage staff
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center w-full px-4 py-2 text-left text-sm text-white hover:bg-primary
                  "
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
