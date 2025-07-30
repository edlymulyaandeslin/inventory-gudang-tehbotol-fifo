import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Inventory System - Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Navigation */}
                <header className="flex w-full items-center justify-between border-b border-[#e5e5e5] px-10 py-4 dark:border-[#2e2e2e]">
                    <div className="text-xl font-semibold tracking-tight">InventorySystem</div>
                    {/* <nav className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="rounded-md px-4 py-2 text-sm font-medium hover:underline">
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md border border-[#19140035] px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-[#3E3E3A] dark:hover:bg-gray-800"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav> */}
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">Sistem Informasi Inventory</h1>
                    <p className="mb-8 max-w-2xl text-lg text-gray-600 lg:text-xl dark:text-gray-400">
                        Kelola stok barang, pantau pergerakan inventaris, dan tingkatkan efisiensi operasional dengan sistem inventory yang cepat dan
                        modern.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-md bg-black px-6 py-3 font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                            >
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
                              
                                <Link
                                    href={route('login')}
                                    className="rounded-md border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
                                >
                                    Mulai Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-[#e5e5e5] py-6 text-center text-sm text-gray-500 dark:border-[#2e2e2e] dark:text-gray-600">
                    © {new Date().getFullYear()} InventorySys. All rights reserved.
                </footer>
            </div>
        </>
    );
}
