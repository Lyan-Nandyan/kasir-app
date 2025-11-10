// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

const CameraScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const lastResultTimeRef = useRef(0);
  const [viewActive, setViewActive] = useState(false);

  // milliseconds to allow repeating same code
  const MIN_REPEAT_MS = 600; // tune this (e.g. 300-800ms)

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    let mounted = true;

    (async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        if (!mounted) return;
        const cams = list.filter((d) => d.kind === "videoinput");
        setDevices(cams);
        if (cams.length && !selectedDevice) setSelectedDevice(cams[0].deviceId);
      } catch (err) {
        console.error("enumerateDevices error:", err);
      }
    })();

    return () => {
      mounted = false;
      try { readerRef.current?.reset(); } catch (e) {}
    };
  }, []); // run once

  useEffect(() => {
    const reader = readerRef.current;
    if (!reader || !selectedDevice || !videoRef.current || !viewActive) return;

    // ensure previous decode stopped
    try { reader.reset(); } catch (e) {}

    reader.decodeFromVideoDevice(selectedDevice, videoRef.current, (result, err) => {
      if (result) {
        const text = result.getText();
        const now = Date.now();
        // accept repeated scans if time since last accepted scan > MIN_REPEAT_MS
        if (text && now - lastResultTimeRef.current > MIN_REPEAT_MS) {
          lastResultTimeRef.current = now;
          onScan && onScan(text);
        }
      }
      // ignore NotFoundException etc.
    });

    return () => {
      try { reader.reset(); } catch (e) { console.warn("reader.reset failed", e); }
    };
  }, [selectedDevice, viewActive, onScan]);

  return (
    <div>
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">Pilih kamera</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedDevice || ""}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">Pilih kamera...</option>
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
          ))}
        </select>
        <button
          className="ml-2 px-3 py-1 bg-gray-200 rounded"
          onClick={() => {
            setViewActive((v) => !v);
            lastResultTimeRef.current = 0; // reset timer saat toggle
          }}
        >
          {viewActive ? "Sembunyikan" : "Tampilkan"} pratinjau
        </button>
      </div>

      <div>
        {viewActive && <video ref={videoRef} className="w-full max-w-xs h-auto border rounded" />}
        <div className="text-xs text-gray-500 mt-2">
          Pastikan izin kamera diberikan. Untuk DroidCam: jalankan DroidCam di HP & PC, pilih device yang muncul.
        </div>
      </div>
    </div>
  );
}

export default CameraScanner;
// ...existing code...