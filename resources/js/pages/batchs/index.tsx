import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type Batch, type BreadcrumbItem } from '@/types';
import { formatDateToHumanReadable } from '@/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barang Masuk',
        href: '/batchs',
    },
];

export default function Index({ batchs }: { batchs: PaginatedData<Batch> }) {
    const { props } = usePage<{ batchs: PaginatedData<Batch>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/batchs', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedBatch) return;

        router.delete(`/batchs/${selectedBatch.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedBatch(null);
            },
            onError: (err) => {
                console.error('Gagal hapus batch:', err);
                alert('Gagal menghapus batch. Coba lagi.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Barang Masuk" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Barang Masuk</h2>
                    <Link
                        href="/batchs/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah Barang Masuk
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={batchs.data}
                    from={batchs.from}
                    to={batchs.to}
                    total={batchs.total}
                    links={batchs.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Kode Produk',
                            render: (batch) => <span className="text-sm font-medium capitalize">{batch.product.sku}</span>,
                        },
                        {
                            title: 'Produk',
                            render: (batch) => <span className="text-sm font-medium capitalize">{batch.product.name}</span>,
                        },
                        {
                            title: 'Jumlah',
                            render: (batch) => (
                                <span className="text-sm font-medium">
                                    {batch.quantity} ({batch.product.unit})
                                </span>
                            ),
                        },
                        {
                            title: 'Tersisa',
                            render: (batch) => (
                                <span className="text-sm font-medium">
                                    {batch.remaining_qty} ({batch.product.unit})
                                </span>
                            ),
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (batch) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedBatch(batch);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={`/batchs/${batch.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedBatch(batch);
                                            setOpenDeleteModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Detail Batch (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail Batch" size="lg">
                {selectedBatch && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Kode Produk</span>
                                <span className="text-base font-semibold">{selectedBatch.product.sku}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Produk</span>
                                <span className="text-base font-semibold">{selectedBatch.product.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Jumlah</span>
                                <span className="text-base font-semibold">
                                    {selectedBatch.quantity} ({selectedBatch.product.unit})
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Tersisa</span>
                                <span className="text-base font-semibold">
                                    {selectedBatch.remaining_qty} ({selectedBatch.product.unit})
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Tanggal Masuk</span>
                                <span className="text-base">
                                    {selectedBatch.created_at ? formatDateToHumanReadable(selectedBatch.entry_date) : 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant={'secondary'} onClick={() => setOpenDetailModal(false)} className="cursor-pointer">
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title="Konfirmasi Hapus"
                size="sm"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpenDeleteModal(false)} variant="secondary">
                            Batal
                        </Button>
                        <Button onClick={handleDelete} className="bg-red-700 hover:bg-red-800">
                            Hapus
                        </Button>
                    </div>
                }
            >
                Apakah Anda yakin ingin menghapus data barang masuk{' '}
                <strong className="text-red-600 dark:text-red-400">{selectedBatch?.product.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
