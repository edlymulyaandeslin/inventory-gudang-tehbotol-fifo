import AppLayout from '@/layouts/app-layout';
import type { Batch, BreadcrumbItem, Product } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Barang Masuk', href: '/stockins' },
    { title: 'Edit', href: '/stockins/edit' },
];

export default function Edit({ stockin, products }: { stockin: Batch; products: Product[] }) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(stockin.product);
    const { data, setData, put, processing, errors } = useForm({
        product_id: stockin.product_id || '',
        quantity: stockin.quantity || '',
        remaining_qty: stockin.remaining_qty || '',
        entry_date: stockin.entry_date || '',
    });

    const onChangeProduct = (value: string) => {
        const product = products.find((product) => String(product.id) === value);
        if (product) {
            setData('product_id', value);
            setSelectedProduct(product);
        }
    };

    const onChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = e.target.value;
        setData('quantity', quantity);
        setData('remaining_qty', quantity);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('stockins.update', stockin.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Barang Masuk" />

            <section className="w-full px-6 py-10 md:px-12 lg:px-20">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold">Edit Barang Masuk</h1>
                    <p className="mt-2 text-base text-muted-foreground">Masukkan informasi barang masuk baru pada form berikut.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Produk */}
                    <div>
                        <Label htmlFor="product_id">Unit</Label>
                        <Select value={String(data.product_id)} onValueChange={(value) => onChangeProduct(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Produk" />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={String(product.id)}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.product_id && <p className="mt-1 text-sm text-red-500">{errors.product_id}</p>}
                    </div>

                    {/* Kuantitas */}
                    <div>
                        <Label htmlFor="quantity">Jumlah</Label>
                        <Input id="quantity" value={data.quantity} onChange={onChangeQty} placeholder="0" />
                        {selectedProduct && <span className="text-xs font-bold text-gray-400">Satuan: {selectedProduct.unit}</span>}
                        {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                    </div>
                    {/* Kuantitas */}
                    <div>
                        <Label htmlFor="entry_date">Tanggal Masuk</Label>
                        <Input
                            type="datetime-local"
                            id="entry_date"
                            value={data.entry_date}
                            className="bg-accent text-accent-foreground"
                            onChange={(e) => setData('entry_date', e.target.value)}
                        />
                        {errors.entry_date && <p className="mt-1 text-sm text-red-500">{errors.entry_date}</p>}
                    </div>

                    {/* Tombol Submit */}
                    <div className="mt-4 flex justify-end md:col-span-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </section>
        </AppLayout>
    );
}
