import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function AbsensiForm() {
  const [loading, setLoading] = useState(false);
  const [lokasi, setLokasi] = useState({ lat: null, lng: null });
  const [message, setMessage] = useState('');

  const ambilLokasi = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLokasi({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setMessage('Gagal mengambil lokasi.');
        setLoading(false);
      }
    );
  };

  const submitAbsensi = () => {
    if (!lokasi.lat || !lokasi.lng) {
      setMessage('Ambil lokasi dulu!');
      return;
    }

    router.post('/absen', lokasi, {
      onSuccess: () => setMessage('Absensi berhasil!'),
      onError: () => setMessage('Gagal mengirim absensi'),
    });
  };

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Form Absensi</h2>

      <div className="mb-4">
        <p>Latitude: {lokasi.lat ?? '-'}</p>
        <p>Longitude: {lokasi.lng ?? '-'}</p>
      </div>

      <button
        onClick={ambilLokasi}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mb-3"
        disabled={loading}
      >
        {loading ? 'Mengambil Lokasi...' : 'Ambil Lokasi'}
      </button>

      <button
        onClick={submitAbsensi}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Absen Sekarang
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
