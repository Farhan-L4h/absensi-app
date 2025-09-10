import React, { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AbsensiForm({ sudahAbsen }) {
  const [loading, setLoading] = useState(false);
  const [lokasi, setLokasi] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);

  // Initialize Leaflet Map with OpenStreetMap
  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    if (!window.L) {
      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJS.onload = initMap;
      document.head.appendChild(leafletJS);
    } else {
      initMap();
    }

    function initMap() {
      if (window.L && mapRef.current && !map) {
        const mapInstance = window.L.map(mapRef.current, {
          center: [-6.2088, 106.8456], // Jakarta
          zoom: 13,
          zoomControl: true,
          scrollWheelZoom: true
        });

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        setMap(mapInstance);
      }
    }
  }, []);

  const ambilLokasi = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newLocation = { lat: coords.latitude, lng: coords.longitude };
        setLokasi(newLocation);

        // Update map and marker
        if (map && window.L) {
          map.setView([newLocation.lat, newLocation.lng], 17);

          // Remove existing marker
          if (marker) {
            map.removeLayer(marker);
          }

          // Create custom icon
          const customIcon = window.L.divIcon({
            html: `
              <div style="
                width: 30px; 
                height: 30px; 
                background: #3B82F6; 
                border: 3px solid white; 
                border-radius: 50%; 
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
              ">📍</div>
            `,
            className: 'custom-location-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          // Add new marker
          const newMarker = window.L.marker([newLocation.lat, newLocation.lng], {
            icon: customIcon
          }).addTo(map);

          // Add popup
          newMarker.bindPopup(`
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #3B82F6; font-weight: bold;">📍 Lokasi Anda</h3>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">
                <strong>Lat:</strong> ${coords.latitude.toFixed(6)}
              </p>
              <p style="margin: 2px 0; font-size: 12px; color: #666;">
                <strong>Lng:</strong> ${coords.longitude.toFixed(6)}
              </p>
            </div>
          `).openPopup();

          setMarker(newMarker);
        }

        setLoading(false);
        
        Swal.fire({
          icon: 'success',
          title: '📍 Lokasi Berhasil Diambil!',
          html: `
            <div class="text-left">
              <p class="mb-2"><strong>Latitude:</strong> ${coords.latitude.toFixed(6)}</p>
              <p><strong>Longitude:</strong> ${coords.longitude.toFixed(6)}</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 3000
        });
      },
      () => {
        Swal.fire({
          icon: 'error',
          title: 'Gagal mengambil lokasi',
          text: 'Pastikan izin lokasi diaktifkan dan koneksi internet stabil.',
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
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
      
      <div className="py-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white overflow-hidden shadow-2xl rounded-2xl border border-gray-200">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Form Absensi
                </h3>
                <p className="text-gray-600 text-lg">Lakukan absensi dengan lokasi GPS real-time melalui OpenStreetMap</p>
              </div>

              {/* Status Absensi */}
              {sudahAbsen && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-xl">✅</span>
                    </div>
                    <div>
                      <h4 className="text-green-800 font-bold text-lg">Sudah Absen Hari Ini</h4>
                      <p className="text-green-600">Terima kasih, absensi Anda sudah tercatat dalam sistem</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Lokasi Bar */}
              <div className={`mb-6 p-4 rounded-xl border-2 transition-all duration-300 ${
                lokasi.lat && lokasi.lng 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' 
                  : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                      lokasi.lat && lokasi.lng ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {lokasi.lat && lokasi.lng ? '📍 Lokasi Berhasil Diambil' : '⏳ Menunggu Lokasi GPS'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lokasi.lat && lokasi.lng 
                          ? 'Siap untuk melakukan absensi' 
                          : 'Klik "Ambil Lokasi dengan GPS" untuk melanjutkan'
                        }
                      </p>
                    </div>
                  </div>
                  {lokasi.lat && lokasi.lng && (
                    <div className="text-2xl">✅</div>
                  )}
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h4 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                  <span className="mr-2">�️</span>
                  Lokasi Absensi Anda
                </h4>
                
                {/* Map Container */}
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 mb-4">
                  <div className="relative">
                    <div 
                      ref={mapRef} 
                      className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"
                      id="absensi-map"
                    >
                    </div>
                    {!map && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                        <div className="text-center text-gray-500">
                          <div className="animate-bounce text-4xl mb-3">🗺️</div>
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <p className="font-medium">Memuat Peta...</p>
                          </div>
                          <p className="text-xs mt-2 text-gray-400">Menggunakan OpenStreetMap</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">📍</span>
                      <label className="text-sm font-semibold text-blue-700">Latitude</label>
                    </div>
                    <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {lokasi.lat ? lokasi.lat.toFixed(6) : 'Belum diambil'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">🌐</span>
                      <label className="text-sm font-semibold text-blue-700">Longitude</label>
                    </div>
                    <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {lokasi.lng ? lokasi.lng.toFixed(6) : 'Belum diambil'}
                    </p>
                  </div>
                </div>
                
                {lokasi.lat && lokasi.lng && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <span className="mr-2 text-xl">✅</span>
                        <div>
                          <span className="font-semibold">Lokasi berhasil diambil!</span>
                          <p className="text-sm text-green-600">Siap untuk melakukan absensi</p>
                        </div>
                      </div>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${lokasi.lat}&mlon=${lokasi.lng}&zoom=16`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center"
                      >
                        <span className="mr-1">�️</span>
                        Buka di Maps
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={ambilLokasi}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                    loading 
                      ? 'bg-blue-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Mencari Lokasi Anda...
                    </>
                  ) : (
                    <>
                      <span className="mr-3 text-xl">📍</span>
                      Ambil Lokasi dengan GPS
                    </>
                  )}
                </button>

                <button
                  onClick={submitAbsensi}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                    sudahAbsen 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  }`}
                  disabled={sudahAbsen}
                >
                  <span className="mr-3 text-xl">{sudahAbsen ? '✅' : '📝'}</span>
                  {sudahAbsen ? 'Sudah Absen Hari Ini' : 'Absen Sekarang'}
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="text-purple-600 mr-4 mt-1 text-2xl">💡</div>
                  <div>
                    <h4 className="text-purple-800 font-bold text-lg mb-3">Panduan Absensi:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center text-purple-700">
                        <span className="mr-2">📍</span>
                        <span className="text-sm">Pastikan GPS aktif dan koneksi internet stabil</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <span className="mr-2">🗺️</span>
                        <span className="text-sm">Lihat posisi Anda di peta yang tersedia</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <span className="mr-2">⏰</span>
                        <span className="text-sm">Absensi hanya bisa dilakukan sekali per hari</span>
                      </div>
                      <div className="flex items-center text-purple-700">
                        <span className="mr-2">🔒</span>
                        <span className="text-sm">Data lokasi disimpan untuk verifikasi</span>
                      </div>
                    </div>
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
