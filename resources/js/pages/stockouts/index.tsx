import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type StockOut } from '@/types';
import { formatDateToHumanReadable } from '@/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-base font-semibold">{value}</span>
    </div>
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Barang Keluar',
        href: '/stockouts',
    },
];

export default function Index({ stockouts }: { stockouts: PaginatedData<StockOut> }) {
    const { props } = usePage<{ stockouts: PaginatedData<StockOut>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedStockOut, setSelectedStockOut] = useState<StockOut | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/stockouts', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handleDelete = () => {
        if (!selectedStockOut) return;

        router.delete(`/stockouts/${selectedStockOut.id}`, {
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedStockOut(null);
            },
            onError: (err) => {
                console.error('Gagal hapus stockout:', err);
                alert('Gagal menghapus stockout. Coba lagi.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Barang Keluar" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Barang Keluar</h2>
                    <Link
                        href="/stockouts/create"
                        className="inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700"
                    >
                        + Tambah Barang Keluar
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
                    data={stockouts.data}
                    from={stockouts.from}
                    to={stockouts.to}
                    total={stockouts.total}
                    links={stockouts.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Kode Produk',
                            render: (stockout) => <span className="text-sm font-medium capitalize">{stockout.product.sku}</span>,
                        },
                        {
                            title: 'Produk',
                            render: (stockout) => <span className="text-sm font-medium capitalize">{stockout.product.name}</span>,
                        },
                        {
                            title: 'Jumlah',
                            render: (stockout) => (
                                <span className="text-sm font-medium">
                                    {stockout.quantity} ({stockout.product.unit})
                                </span>
                            ),
                        },
                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (stockout) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedStockOut(stockout);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                    <Link
                                        href={`/stockouts/${stockout.id}/edit`}
                                        className="inline-flex items-center rounded-md bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSelectedStockOut(stockout);
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

            {/* Modal Detail StockOut (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail Barang Keluar" size="lg">
                {selectedStockOut && (
                    <div className="space-y-6 rounded-lg bg-white px-2 py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        {/* Informasi Utama */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoItem label="Kode Produk" value={selectedStockOut.product.sku} />
                            <InfoItem label="Produk" value={selectedStockOut.product.name} />
                            <InfoItem label="Jumlah" value={`${selectedStockOut.quantity} (${selectedStockOut.product.unit})`} />
                            <InfoItem
                                label="Tanggal Keluar"
                                value={selectedStockOut.out_date ? formatDateToHumanReadable(selectedStockOut.out_date) : 'N/A'}
                            />
                        </div>

                        {/* Detail Batch */}
                        <div className="mt-6">
                            <h3 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Rincian Pemakaian Batch (FIFO)</h3>
                            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-2 font-medium">Tanggal Masuk</th>
                                            <th className="px-4 py-2 font-medium">Jumlah Masuk</th>
                                            <th className="px-4 py-2 font-medium">Tanggal Keluar</th>
                                            <th className="px-4 py-2 font-medium">Jumlah Keluar</th>
                                            <th className="px-4 py-2 font-medium">Sisa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...selectedStockOut.details]
                                            .sort((a, b) => new Date(b.batch.entry_date).getTime() - new Date(a.batch.entry_date).getTime())
                                            .map((detail, index) => (
                                                <tr
                                                    key={index}
                                                    className={index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800'}
                                                >
                                                    <td className="px-4 py-2">{formatDateToHumanReadable(detail.batch.entry_date)}</td>
                                                    <td className="px-4 py-2">{detail.batch.quantity}</td>
                                                    <td className="px-4 py-2">{formatDateToHumanReadable(selectedStockOut.out_date)}</td>
                                                    <td className="px-4 py-2">{detail.quantity_used}</td>
                                                    <td className="px-4 py-2">{detail.batch.remaining_qty}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setOpenDetailModal(false)} className="cursor-pointer">
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
                Apakah Anda yakin ingin menghapus data barang Keluar{' '}
                <strong className="text-red-600 dark:text-red-400">{selectedStockOut?.product.name}</strong>? Tindakan ini tidak dapat dibatalkan.
            </Modal>
        </AppLayout>
    );
}
