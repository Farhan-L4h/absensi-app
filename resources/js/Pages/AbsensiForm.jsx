import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function AbsensiForm({ sudahAbsen }) {
  const [loading, setLoading] = useState(false);
  const [lokasi, setLokasi] = useState({ lat: null, lng: null });

  const ambilLokasi = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLokasi({ lat: coords.latitude, lng: coords.longitude });
        setLoading(false);
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal mengambil lokasi',
          text: 'Pastikan izin lokasi diaktifkan.',
        });
        setLoading(false);
      }
    );
  };

  const handleError = (errors) => {
    if (errors.response && errors.response.status === 409) {
      Swal.fire({
        icon: 'info',
        title: 'Sudah Absen',
        text: 'Kamu sudah melakukan absensi hari ini.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengirim absensi',
        text: 'Silakan coba lagi.',
      });
    }
  };

  const submitAbsensi = () => {
    if (sudahAbsen) {
      return Swal.fire({
        icon: 'info',
        title: 'Sudah Absen',
        text: 'Kamu sudah melakukan absensi hari ini.',
      });
    }

    if (!lokasi.lat || !lokasi.lng) {
      return Swal.fire({
        icon: 'warning',
        title: 'Lokasi belum tersedia',
        text: 'Silakan ambil lokasi terlebih dahulu.',
      });
    }

    router.post('/absen', lokasi, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Absensi Berhasil',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => router.visit('/dashboard'));
      },
      onError: (errors) => {
        if (errors.absen) {
          Swal.fire({
            icon: 'info',
            title: 'Sudah Absen',
            text: errors.absen,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal mengirim absensi',
            text: 'Silakan coba lagi.',
          });
        }
      }
    });
  };

  // const lihatStatus = () => {
  //   Swal.fire({
  //     icon: 'info',
  //     title: 'Status Absensi',
  //     text: sudahAbsen
  //       ? 'Kamu sudah absen hari ini.'
  //       : 'Kamu belum absen hari ini.',
  //   });
  // };

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
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mb-3"
      >
        Absen Sekarang
      </button>

      {/* <button
        onClick={lihatStatus}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
      >
        Lihat Status Absensi
      </button> */}
    </div>
  );
}
