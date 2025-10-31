import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../stores/useToast";
const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        barcode: "",
        name: "",
        price: "",
        stock: "",
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const p = await window.api.products.byId(Number(id));
                if (!mounted) return;
                if (!p) {
                    alert("Produk tidak ditemukan");
                    return navigate("/list");
                }
                setForm({
                    barcode: p.barcode ?? "",
                    name: p.name ?? "",
                    price: String(p.price ?? 0),
                    stock: String(p.stock ?? 0),
                });
            } catch (err) {
                console.error(err);
                toast.push({ type: "error", title: "Gagal memuat produk", message: err?.message || "Terjadi kesalahan" });
                navigate("/list");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [id, navigate]);

    const onChange = (key) => (e) => setForm((s) => ({ ...s, [key]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return alert("Nama produk wajib diisi");
        try {
            await window.api.products.update(Number(id), {
                barcode: form.barcode.trim() || null,
                name: form.name.trim(),
                price: Number(form.price) || 0,
                stock: Number(form.stock) || 0,
            });
            toast.push({ type: "success", title: "Berhasil", message: "Produk diperbarui" });
            navigate("/list");
        } catch (err) {
            console.error("Update error:", err);
            toast.push({ type: "error", title: "Gagal memperbarui produk", message: err?.message || "Terjadi kesalahan" });
        }
    };

    if (loading) {
        return (
            <div className="p-4">
                <div className="text-gray-500">Memuat...</div>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-lg">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline"
            > &larr; Kembali </button>
            <h1 className="text-xl font-bold mb-4">Edit Produk</h1>

            <form onSubmit={onSubmit} className="space-y-3">
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Barcode (opsional)"
                    value={form.barcode}
                    onChange={onChange("barcode")}
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Nama produk *"
                    value={form.name}
                    onChange={onChange("name")}
                    required
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Harga"
                    value={form.price}
                    onChange={onChange("price")}
                    inputMode="numeric"
                />
                <input
                    className="w-full border rounded px-3 py-2"
                    placeholder="Stok"
                    value={form.stock}
                    onChange={onChange("stock")}
                    inputMode="numeric"
                />

                <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                        Simpan
                    </button>
                    <button type="button" onClick={() => navigate("/")} className="bg-gray-200 px-4 py-2 rounded">
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
