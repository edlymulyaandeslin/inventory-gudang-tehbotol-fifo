import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Batch, StockOut, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowDownCircle, ArrowUpCircle, Boxes } from 'lucide-react';

import { formatDateToHumanReadable } from '@/utils';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({
    total_barangmasuk,
    total_barangkeluar,
    total_stok,
    new_barangmasuk,
    new_barangkeluar,
}: {
    total_barangmasuk: number;
    total_barangkeluar: number;
    total_stok: number;
    new_barangmasuk: Batch[];
    new_barangkeluar: StockOut[];
}) {
    // Ringkasan data untuk ditampilkan di dashboard
    const summary = [
        { title: 'Barang Masuk', value: total_barangmasuk, icon: ArrowDownCircle, color: 'bg-emerald-100 text-emerald-600' },
        { title: 'Barang Keluar', value: total_barangkeluar, icon: ArrowUpCircle, color: 'bg-rose-100 text-rose-600' },
        { title: 'Sisa Stok', value: total_stok, icon: Boxes, color: 'bg-blue-100 text-blue-600' },
    ];

    // Setup grafik
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    const data = {
        labels: ['Barang Masuk', 'Barang Keluar', 'Sisa Stock'],
        datasets: [
            {
                label: 'Jumlah stock',
                data: [total_barangmasuk, total_barangkeluar, total_stok],
                backgroundColor: [
                    'rgba(0, 255, 89, 0.8)', // Hijau untuk Barang Masuk
                    'rgba(255, 0, 89, 0.8)', // Merah untuk Barang Keluar
                    'rgba(128, 128, 128, 0.8)', // Abu-abu untuk Sisa Stock
                ],
            },
        ],
    };

    console.log(new_barangmasuk, new_barangkeluar);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-6">
                {/* Ringkasan */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {summary.map((item, idx) => (
                        <Card key={idx} className="rounded-2xl shadow-md transition hover:shadow-lg">
                            <CardContent className="flex items-center gap-4 p-5">
                                <div className={`rounded-full p-3 ${item.color}`}>
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.title}</p>
                                    <p className="text-xl font-semibold text-foreground">{item.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {/* Grafik */}
                    <Card className="rounded-2xl shadow-md">
                        <CardContent>
                            <h2 className="mb-6 text-lg font-semibold text-foreground">Grafik Barang Masuk & Keluar</h2>
                            {/* chart */}
                            <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
                                <Pie data={data} options={options} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-2">
                        {/* Barang Masuk */}
                        <Card className="rounded-2xl shadow-md">
                            <CardContent className="p-6">
                                <h2 className="mb-4 text-lg font-semibold text-green-600">Barang Masuk Terbaru</h2>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="min-w-full divide-y divide-border text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Tanggal</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Kode</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Barang</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border bg-background">
                                            {new_barangmasuk.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2">{formatDateToHumanReadable(item.entry_date)}</td>
                                                    <td className="px-4 py-2">{item.product.sku}</td>
                                                    <td className="px-4 py-2">{item.product.name}</td>
                                                    <td className="px-4 py-2">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Barang Keluar */}
                        <Card className="rounded-2xl shadow-md">
                            <CardContent className="p-6">
                                <h2 className="mb-4 text-lg font-semibold text-rose-600">Barang Keluar Terbaru</h2>
                                <div className="overflow-x-auto rounded-lg border">
                                    <table className="min-w-full divide-y divide-border text-sm">
                                        <thead className="bg-muted">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Tanggal</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Kode</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Barang</th>
                                                <th className="px-4 py-2 text-left text-muted-foreground">Jumlah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border bg-background">
                                            {new_barangkeluar.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2">{formatDateToHumanReadable(item.out_date)}</td>
                                                    <td className="px-4 py-2">{item.product.sku}</td>
                                                    <td className="px-4 py-2">{item.product.name}</td>
                                                    <td className="px-4 py-2">{item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
