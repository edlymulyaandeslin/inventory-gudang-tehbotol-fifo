import DataTable from '@/components/data-table';
import Modal from '@/components/modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, type BreadcrumbItem, type Product } from '@/types';
import { formatDateToHumanReadable } from '@/utils';
import { Head, router, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventories',
        href: '/inventories',
    },
];

export default function Index({ products }: { products: PaginatedData<Product> }) {
    const { props } = usePage<{ products: PaginatedData<Product>; search?: string }>();
    const initialSearch = props.search || '';
    const [search, setSearch] = useState(initialSearch);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);

    // Debounce search
    useEffect(() => {
        if (search !== initialSearch) {
            const delayDebounce = setTimeout(() => {
                router.get('/inventories', { search }, { preserveState: true, replace: true });
            }, 400);

            return () => clearTimeout(delayDebounce);
        }
    }, [search, initialSearch]);

    const handlePrint = (productData: Product[]) => {
        const now = new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const htmlContent = `
    <html>
    <head>
        <title>Laporan Data Inventory</title>
        <style>
            @media print {
                @page {
                    margin: 20mm;
                }
            }

            body {
                font-family: 'Georgia', serif;
                padding: 40px;
                color: #333;
                background: white;
            }

            .header {
                text-align: center;
                margin-bottom: 30px;
            }

            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #222;
            }

            .header p {
                margin: 4px 0;
                font-size: 14px;
                color: #555;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-size: 13px;
            }

            th, td {
                border: 1px solid #aaa;
                padding: 8px;
                text-align: left;
            }

            th {
                background-color: #f0f0f0;
                color: #000;
                font-weight: 600;
            }

            tr:nth-child(even) {
                background-color: #fafafa;
            }

            .footer {
                margin-top: 60px;
                font-size: 12px;
                text-align: right;
                color: #555;
            }

            .signature {
                margin-top: 80px;
                text-align: right;
                font-size: 14px;
            }

            .signature p {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Laporan Data Inventory</h1>
            <p>Gudang Teh Botol Sosro</p>
            <p>Tanggal Cetak: ${now}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Kode Produk</th>
                    <th>Nama Produk</th>
                    <th>Stok Tersedia</th>
                    <th>Satuan</th>
                </tr>
            </thead>
            <tbody>
                ${productData
                    .map(
                        (p, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${p.sku}</td>
                        <td>${p.name}</td>
                        <td>${p.batches.reduce((sum, b) => sum + b.remaining_qty, 0)}</td>
                        <td>${p.unit}</td>
                    </tr>`,
                    )
                    .join('')}
            </tbody>
        </table>

        <div class="footer">
            Dicetak oleh sistem pada tanggal ${now}
        </div>

        <div class="signature">
            <p>__________________________</p>
            <p style="margin-top: 6px;">Tanda Tangan</p>
        </div>

        <script>
            window.onload = function () {
                window.print();
                window.onafterprint = function () {
                    window.close(); // ini akan dipanggil saat print selesai *atau* dibatalkan
                };
            };
        </script>
    </body>
    </html>
    `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Inventory" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Data Inventory</h2>
                    <Button onClick={() => handlePrint(products.data)} variant="outline" className="cursor-pointer">
                        <Printer /> Cetak Laporan
                    </Button>
                </div>

                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <DataTable
                    data={products.data}
                    from={products.from}
                    to={products.to}
                    total={products.total}
                    links={products.links}
                    columns={[
                        {
                            title: '#',
                            render: (_, index) => <span className="text-sm">{index}</span>,
                        },
                        {
                            title: 'Kode Inventory',
                            render: (product) => <span className="text-sm font-medium">{product.sku}</span>,
                        },
                        {
                            title: 'Nama',
                            render: (product) => <span className="text-sm font-medium capitalize">{product.name}</span>,
                        },
                        {
                            title: 'Stok Tersedia',
                            render: (product) => {
                                const totalStock = product.batches.reduce((sum, batch) => sum + batch.remaining_qty, 0);
                                return (
                                    <span className="text-sm font-medium">
                                        {totalStock} ({product.unit})
                                    </span>
                                );
                            },
                        },

                        {
                            title: 'Aksi',
                            className: 'text-right',
                            render: (product) => (
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setOpenDetailModal(true);
                                        }}
                                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                        Lihat
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Modal Detail Product (baru diimplementasikan dari UserIndex) */}
            <Modal isOpen={openDetailModal} onClose={() => setOpenDetailModal(false)} title="Detail Inventory" size="lg">
                {selectedProduct && (
                    <div className="space-y-6 rounded-lg bg-white py-6 text-sm text-gray-700 dark:bg-zinc-900 dark:text-gray-200">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Kode Produk</span>
                                <span className="text-base font-semibold">{selectedProduct.sku}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Nama Produk</span>
                                <span className="text-base font-semibold">{selectedProduct.name}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Stok Tersedia</span>
                                <span className="text-base font-semibold">
                                    {selectedProduct.batches.reduce((sum, batch) => sum + batch.remaining_qty, 0)} {selectedProduct.unit}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Dibuat Pada</span>
                                <span className="text-base">
                                    {selectedProduct.created_at ? formatDateToHumanReadable(selectedProduct.created_at) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Diperbarui Pada</span>
                                <span className="text-base">
                                    {selectedProduct.updated_at ? formatDateToHumanReadable(selectedProduct.updated_at) : 'N/A'}
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
        </AppLayout>
    );
}
