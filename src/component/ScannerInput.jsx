import React, { useEffect, useRef, useState } from "react";

/**
 * ScannerInput
 * - Menangani scanner keyboard-HID (mengirim teks cepat diikuti ENTER)
 * - Buffer berdasarkan waktu antar-keystroke (threshold)
 * - Mendukung paste
 * - Memanggil onScan(code) saat ENTER diterima
 */
const ScannerInput = ({ onScan }) => {
  const inputRef = useRef(null);
  const bufferRef = useRef("");
  const lastTimeRef = useRef(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleKeyDown = (e) => {
      const now = Date.now();
      // reset buffer jika jeda antar-key terlalu panjang (scanner cepat => jeda kecil)
      if (now - lastTimeRef.current > 120) bufferRef.current = "";
      lastTimeRef.current = now;

      // ignore modifier keys
      if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") return;

      if (e.key === "Enter" || e.key === "NumpadEnter") {
        const code = bufferRef.current.trim() || el.value.trim();
        bufferRef.current = "";
        el.value = "";
        if (code) onScan && onScan(code);
        // keep focus
        setTimeout(() => el.focus(), 20);
        e.preventDefault();
        return;
      }

      // if single printable char, append to buffer
      if (e.key.length === 1) {
        bufferRef.current += e.key;
      }
    };

    const handlePaste = (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text) {
        e.preventDefault();
        // assume pasted contains full code (maybe from phone)
        onScan && onScan(text.trim());
        el.value = "";
        bufferRef.current = "";
        setTimeout(() => el.focus(), 20);
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    el.addEventListener("paste", handlePaste);
    return () => {
      el.removeEventListener("keydown", handleKeyDown);
      el.removeEventListener("paste", handlePaste);
    };
  }, [onScan]);

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">Scan input (pastikan fokus)</label>
      <input
        ref={inputRef}
        className="border p-2 rounded w-full"
        placeholder="Arahkan scanner / ketik lalu tekan Enter..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        inputMode="numeric"
        aria-label="scanner-input"
      />
      <div className="text-xs text-gray-500 mt-1">Focused: {focused ? "yes" : "no"}</div>
    </div>
  );
}
export default ScannerInput;