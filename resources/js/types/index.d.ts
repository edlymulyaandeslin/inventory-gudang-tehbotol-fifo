import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Product {
    id: number;
    name: string;
    sku: string;
    unit: string;
    image: string;
    batches: Batch[];
    created_at: string;
    updated_at: string;
}

export interface Batch {
    id: number;
    product_id: number;
    quantity: number;
    remaining_qty: number;
    entry_date: string;
    product: Product;
    created_at: string;
    updated_at: string;
}

export interface StockOut {
    id: number;
    product_id: number;
    quantity: number;
    out_date: string;
    product: Product;
    details: StockOutDetail[];
    created_at: string;
    updated_at: string;
}

export interface StockOutDetail {
    id: number;
    stock_out_id: number;
    batch_id: number;
    quantity_used: string;
    stock_out: StockOut;
    batch: Batch;
    created_at: string;
    updated_at: string;
}

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedData<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
