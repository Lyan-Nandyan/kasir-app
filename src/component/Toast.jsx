import React from "react";
import { useToast } from "../stores/useToast";

const colorByType = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const Toast = () => {
  const toasts = useToast((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="max-w-sm w-full text-white shadow-lg rounded overflow-hidden">
          <div className={`px-4 py-3 flex items-start gap-3 ${colorByType[t.type] || colorByType.info}`}>
            <div className="flex-1">
              <div className="font-semibold text-sm">{t.title}</div>
              {t.message ? <div className="text-sm mt-1 opacity-90">{t.message}</div> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Toast;