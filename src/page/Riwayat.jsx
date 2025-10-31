import React, { useEffect, useState } from "react";
import { useToast } from "../stores/useToast";

const Riwayat = () => {
  const toast = useToast((s) => s.push);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState([]);
  const [openIds, setOpenIds] = useState(new Set());

  const load = async () => {
    setLoading(true);
    try {
      const res = await window.api.sales.list();
      setSales(res || []);
    } catch (err) {
      console.error("Failed load sales", err);
      toast({ type: "error", title: "Error", message: err?.message || "Gagal memuat riwayat" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = (id) => {
    setOpenIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Riwayat Transaksi</h1>
        <div className="flex gap-2">
          <button onClick={load} className="px-3 py-1 bg-gray-200 rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white shadow rounded overflow-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Waktu</th>
              <th className="px-4 py-2 text-right">Subtotal</th>
              <th className="px-4 py-2 text-right">Total</th>
              <th className="px-4 py-2 text-right">Paid</th>
              <th className="px-4 py-2 text-right">Change</th>
              <th className="px-4 py-2 text-center">Items</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center">Memuat...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center">Belum ada transaksi</td></tr>
            ) : (
              sales.map((s) => (
                <React.Fragment key={s.id}>
                  <tr className="border-t">
                    <td className="px-4 py-2">{s.id}</td>
                    <td className="px-4 py-2">{s.datetime}</td>
                    <td className="px-4 py-2 text-right">Rp{Number(s.subtotal || 0).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-right">Rp{Number(s.total || 0).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-right">Rp{Number(s.paid || 0).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-right">Rp{Number(s.change || 0).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => toggle(s.id)} className="px-2 py-1 bg-blue-600 text-white rounded text-sm">
                        {openIds.has(s.id) ? 'Tutup' : 'Lihat'}
                      </button>
                    </td>
                  </tr>
                  {openIds.has(s.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-4 py-2">
                        <div className="font-medium mb-2">Items</div>
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="text-sm text-gray-600">
                              <th className="px-2 py-1 text-left">Nama</th>
                              <th className="px-2 py-1 text-right">Harga</th>
                              <th className="px-2 py-1 text-right">Qty</th>
                              <th className="px-2 py-1 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(s.SaleItems || []).map((it) => (
                              <tr key={it.id} className="border-t">
                                <td className="px-2 py-1">{it.productName || ('#' + (it.productId || ''))}</td>
                                <td className="px-2 py-1 text-right">Rp{Number(it.price || 0).toLocaleString('id-ID')}</td>
                                <td className="px-2 py-1 text-right">{it.qty}</td>
                                <td className="px-2 py-1 text-right">Rp{Number(it.total || (it.price*it.qty) || 0).toLocaleString('id-ID')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Riwayat;
