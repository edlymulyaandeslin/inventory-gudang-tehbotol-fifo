import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowDownToLine, ArrowUpFromLine, LayoutGrid, PackageOpen, ShoppingBasket, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: { label: string; items: NavItem[] }[] = [
    {
        label: 'General',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: 'Master Data',
        items: [
            {
                title: 'Products',
                href: '/products',
                icon: ShoppingBasket,
            },
            {
                title: 'Barang Masuk',
                href: '/stockins',
                icon: ArrowDownToLine,
            },
            {
                title: 'Barang Keluar',
                href: '/stockouts',
                icon: ArrowUpFromLine,
            },
            {
                title: 'Inventory',
                href: '/inventories',
                icon: PackageOpen,
            },
        ],
    },
    {
        label: 'Akun',
        items: [
            {
                title: 'Users',
                href: '/users',
                icon: Users,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
