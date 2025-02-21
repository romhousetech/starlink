'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  MapPinHouse,
  Settings,
  Plus,
  Edit,
  User2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import { FaProductHunt } from 'react-icons/fa';

const items = [
  {
    title: 'Products',
    url: '#',
    icon: FaProductHunt,
    submenu: [
      { title: 'List', url: '/admin/products' },
      { title: 'Create', url: '/admin/products/add' },
    ],
  },
  {
    title: 'Subscribers',
    url: '#',
    icon: MapPinHouse,
    submenu: [
      { title: 'List', url: '/admin/subscribers' },
      { title: 'Distribution', url: '/admin/subscribers/distribution' },
      { title: 'Create', url: '/admin/subscribers/add' },
    ],
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const username = session?.user?.name || 'User';

  return (
    <Sidebar className="bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-5 text-2xl font-bold uppercase">
            ROM HOUSE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible key={item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon className="mr-2" /> {item.title}
                        {item.submenu && <ChevronDown className="ml-auto" />}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.submenu && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <Link href={subItem.url} key={subItem.title}>
                              <SidebarMenuSubItem className="px-3 py-2 hover:bg-gray-100 hover:text-black rounded">
                                {subItem.title}
                              </SidebarMenuSubItem>
                            </Link>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href="/admin/users">
                  <DropdownMenuItem className="px-3 py-2 hover:bg-gray-100 hover:text-black rounded">
                    <span>Manage staff</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="px-3 py-2 hover:bg-gray-100 hover:text-black rounded"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
