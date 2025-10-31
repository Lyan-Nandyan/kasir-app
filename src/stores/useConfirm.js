import { create } from "zustand";

export const useConfirm = create((set, get) => ({
  isOpen: false,
  title: "",
  message: "",
  _resolve: undefined,

  // open returns a Promise<boolean>
  open: (opts = {}) =>
    new Promise((resolve) => {
      // simpan resolver langsung di state; jangan memanggil resolve di dalam set
      set({
        isOpen: true,
        title: opts.title || "Konfirmasi",
        message: opts.message || "Apakah anda yakin?",
        _resolve: resolve,
      });
    }),

  // confirm/cancel: ambil resolver via get(), tutup modal lalu panggil resolver
  confirm: () => {
    const r = get()._resolve;
    set({ isOpen: false, _resolve: undefined });
    if (typeof r === "function") r(true);
  },

  cancel: () => {
    const r = get()._resolve;
    set({ isOpen: false, _resolve: undefined });
    if (typeof r === "function") r(false);
  },
}));
