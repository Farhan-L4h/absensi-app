import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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
    <AuthenticatedLayout>
      <Head title="Form Absensi" />
      
      <div className="py-4">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Form Absensi</h3>
                <p className="text-gray-600">Lakukan absensi dengan mengambil lokasi Anda terlebih dahulu</p>
              </div>

              {/* Status Absensi */}
              {sudahAbsen && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <div className="text-green-600 mr-3">✅</div>
                    <div>
                      <h4 className="text-green-800 font-medium">Sudah Absen</h4>
                      <p className="text-green-600 text-sm">Anda sudah melakukan absensi hari ini</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lokasi Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="mr-2">📍</span>
                  Informasi Lokasi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
                    <p className="text-lg font-mono text-gray-900">
                      {lokasi.lat ? lokasi.lat.toFixed(6) : '-'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
                    <p className="text-lg font-mono text-gray-900">
                      {lokasi.lng ? lokasi.lng.toFixed(6) : '-'}
                    </p>
                  </div>
                </div>
                
                {lokasi.lat && lokasi.lng && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <span className="mr-2">✅</span>
                      <span className="text-sm font-medium">Lokasi berhasil diambil</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={ambilLokasi}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Mengambil Lokasi...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📍</span>
                      Ambil Lokasi
                    </>
                  )}
                </button>

                <button
                  onClick={submitAbsensi}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                    sudahAbsen 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={sudahAbsen}
                >
                  <span className="mr-2">{sudahAbsen ? '✅' : '📝'}</span>
                  {sudahAbsen ? 'Sudah Absen Hari Ini' : 'Absen Sekarang'}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-0.5">ℹ️</div>
                  <div>
                    <h4 className="text-blue-800 font-medium mb-1">Informasi Penting:</h4>
                    <ul className="text-blue-600 text-sm space-y-1">
                      <li>• Pastikan GPS/lokasi dalam keadaan aktif</li>
                      <li>• Ambil lokasi terlebih dahulu sebelum absen</li>
                      <li>• Absensi hanya bisa dilakukan sekali per hari</li>
                      <li>• Data lokasi akan disimpan untuk keperluan verifikasi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
