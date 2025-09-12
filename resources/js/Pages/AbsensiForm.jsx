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

  const ambilLokasi = async () => {
    setLoading(true);
    
    try {
      // Langsung gunakan IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const coords = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 10000 // IP-based location is less accurate
        };
        
        const newLocation = { lat: coords.latitude, lng: coords.longitude };
        setLokasi(newLocation);

        // Update map and marker with Google Maps style
        if (map && window.L) {
          map.setView([newLocation.lat, newLocation.lng], 16);

          // Remove existing marker
          if (marker) {
            map.removeLayer(marker);
          }

          // Create Google Maps style custom icon
          const customIcon = window.L.divIcon({
            html: `
              <div style="
                width: 32px; 
                height: 40px; 
                background: #EA4335; 
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 3px 6px rgba(234, 67, 53, 0.5);
                position: relative;
              ">
                <div style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(45deg);
                  color: white;
                  font-size: 16px;
                  font-weight: bold;
                ">📍</div>
              </div>
            `,
            className: 'google-maps-marker',
            iconSize: [32, 40],
            iconAnchor: [16, 35]
          });

          // Add new marker
          const newMarker = window.L.marker([newLocation.lat, newLocation.lng], {
            icon: customIcon
          }).addTo(map);

          // Add Google Maps style popup
          newMarker.bindPopup(`
            <div style="padding: 10px; min-width: 220px; font-family: 'Roboto', sans-serif;">
              <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 24px; height: 24px; background: #4285f4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 8px;">
                  <span style="color: white; font-size: 12px;">📍</span>
                </div>
                <h3 style="margin: 0; color: #1a73e8; font-weight: 500; font-size: 14px;">Lokasi Anda</h3>
              </div>
              <div style="background: #f8f9fa; padding: 8px; border-radius: 8px; margin-bottom: 8px;">
                <p style="margin: 2px 0; font-size: 12px; color: #5f6368;">
                  <strong style="color: #202124;">Lat:</strong> ${coords.latitude.toFixed(6)}
                </p>
                <p style="margin: 2px 0; font-size: 12px; color: #5f6368;">
                  <strong style="color: #202124;">Lng:</strong> ${coords.longitude.toFixed(6)}
                </p>
                <p style="margin: 2px 0; font-size: 12px; color: #5f6368;">
                  <strong style="color: #202124;">Lokasi:</strong> ${data.city}, ${data.country_name}
                </p>
              </div>
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 6px; border-radius: 6px;">
                <p style="margin: 0; font-size: 11px; color: #856404;">
                  ⚠️ Lokasi berdasarkan IP address dengan akurasi ±${(coords.accuracy/1000).toFixed(1)} km
                </p>
              </div>
            </div>
          `, {
            closeButton: true,
            autoClose: false,
            className: 'google-maps-popup'
          }).openPopup();

          setMarker(newMarker);
        }

        setLoading(false);
        
        // Show success alert with improved design
        Swal.fire({
          icon: 'info',
          title: '📍 Lokasi Berhasil Diambil',
          html: `
            <div style="text-left; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px; color: white; margin: 10px 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <div style="font-size: 20px; margin-bottom: 5px;">🌐</div>
                  <div style="font-size: 12px; margin-bottom: 3px; opacity: 0.9;">Latitude</div>
                  <div style="font-size: 16px; font-weight: bold;">${coords.latitude.toFixed(6)}</div>
                </div>
                <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 10px; text-align: center;">
                  <div style="font-size: 20px; margin-bottom: 5px;">🗺️</div>
                  <div style="font-size: 12px; margin-bottom: 3px; opacity: 0.9;">Longitude</div>
                  <div style="font-size: 16px; font-weight: bold;">${coords.longitude.toFixed(6)}</div>
                </div>
              </div>
              <div style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin-bottom: 15px;">
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                  <span style="margin-right: 8px; font-size: 16px;">📍</span>
                  <strong>Lokasi Terdeteksi:</strong>
                </div>
                <div style="font-size: 15px; margin-left: 24px;">${data.city}, ${data.country_name}</div>
              </div>
              <div style="background: rgba(255,193,7,0.2); padding: 10px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <div style="display: flex; align-items: center;">
                  <span style="margin-right: 8px;">⚠️</span>
                  <span style="font-size: 12px;"><strong>Akurasi:</strong> ±${(coords.accuracy/1000).toFixed(1)} km (berbasis IP address)</span>
                </div>
              </div>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: '👍 Siap Absen',
          confirmButtonColor: '#1a73e8',
          timer: 8000,
          width: '500px',
          backdrop: `rgba(0,0,0,0.6)`
        });

      } else {
        throw new Error('Tidak dapat mendapatkan koordinat dari IP');
      }
    } catch (error) {
      console.error('IP location failed:', error);
      setLoading(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengambil lokasi',
        html: `
          <div style="text-align: left; padding: 10px;">
            <p style="margin-bottom: 15px;">Tidak dapat mengambil lokasi dari IP address.</p>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 8px;">
              <h4 style="color: #856404; margin: 0 0 8px 0; font-size: 14px;">💡 Solusi:</h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #856404;">
                <li>Pastikan koneksi internet stabil</li>
                <li>Coba refresh halaman</li>
                <li>Gunakan jaringan yang berbeda jika perlu</li>
              </ul>
            </div>
          </div>
        `,
        confirmButtonText: 'Coba Lagi',
        confirmButtonColor: '#dc3545'
      });
    }
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
                <p className="text-gray-600 text-lg">Lakukan absensi dengan lokasi otomatis berbasis IP address melalui peta interaktif</p>
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
                      Ambil Lokasi Otomatis
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
                        <span className="mr-2">🌐</span>
                        <span className="text-sm">Lokasi diambil otomatis dari IP address Anda</span>
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
