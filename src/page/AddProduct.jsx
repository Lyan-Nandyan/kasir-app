import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../stores/useToast";
const AddProduct = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [form, setForm] = useState({
        barcode: '',
        name: '',
        price: '',
        stock: ''
    });

    const addProduct = async (e) => {
        if (e) e.preventDefault();
        // simple validation
        if (!form.name.trim()) return alert('Nama wajib');
        const payload = {
            barcode: form.barcode.trim() || null,
            name: form.name.trim(),
            price: Number(form.price) || 0,
            stock: Number(form.stock) || 0
        };
        await window.api.products.add(payload);
        toast.push({ type: "success", title: "Berhasil", message: "Produk ditambahkan" });
        navigate('/list');
    };

    return (
        <div className="p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            > &larr; Kembali </button>

            <h1 className="text-xl font-bold mb-2">Tambah Produk</h1>

            <form onSubmit={addProduct} className="mb-4 grid gap-2" style={{ maxWidth: 480 }}>
                <input
                    placeholder="Barcode (opsional)"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    placeholder="Nama produk *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 rounded"
                    required
                />
                <input
                    placeholder="Harga (angka)"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 rounded"
                    inputMode="numeric"
                />
                <input
                    placeholder="Stok (angka)"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="border p-2 rounded"
                    inputMode="numeric"
                />
                <div>
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Tambah</button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;
