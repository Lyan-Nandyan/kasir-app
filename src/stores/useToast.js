import {create} from "zustand";

let idCounter = 1;
export const useToast = create((set) => ({
  toasts: [],
  push: (opts = {}) => {
    const id = idCounter++;
    const toast = {
      id,
      title: opts.title || "Info",
      message: opts.message || "",
      type: opts.type || "success", // success | error | info
      duration: typeof opts.duration === "number" ? opts.duration : 3000,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), toast.duration);
    return id;
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
