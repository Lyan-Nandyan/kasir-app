import React from "react";
import { useConfirm } from "../stores/useConfirm";

export default function Confirm() {
  // gunakan selector terpisah agar tidak membuat object baru tiap render
  const isOpen = useConfirm((s) => s.isOpen);
  const title = useConfirm((s) => s.title);
  const message = useConfirm((s) => s.message);
  const confirm = useConfirm((s) => s.confirm);
  const cancel = useConfirm((s) => s.cancel);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={cancel}></div>
      <div className="relative bg-white rounded shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b">
          <div className="font-semibold text-lg">{title}</div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={cancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={confirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
