import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function RecapAbsensi() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [recap, setRecap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/rekap/data')
            .then(res => {
                setRecap(res.data.recap);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching recap:', err);
                setError('Gagal memuat data rekap absensi');
                setLoading(false);
                
                Swal.fire({
                    title: 'Error!',
                    text: 'Gagal memuat data rekap absensi. Silakan refresh halaman.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#EF4444'
                });
            });
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Rekap Absensi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {user.role === 'admin' ? 'Rekap Absensi Semua User' : 'Rekap Absensi Saya'}
                                </h3>
                                <p className="text-gray-600">
                                    {user.role === 'admin' 
                                        ? 'Data absensi seluruh karyawan' 
                                        : `Data absensi untuk ${user.name}`
                                    }
                                </p>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        <span className="text-gray-600">Memuat data...</span>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <div className="text-red-600 mr-3">⚠️</div>
                                        <div>
                                            <h4 className="text-red-800 font-medium">Error</h4>
                                            <p className="text-red-600 text-sm">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data Table */}
                            {!loading && !error && (
                                <>
                                    {recap.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">📅</div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                Belum Ada Data Absensi
                                            </h4>
                                            <p className="text-gray-600">
                                                {user.role === 'admin' 
                                                    ? 'Belum ada data absensi dari karyawan' 
                                                    : 'Anda belum melakukan absensi'
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Stats Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <div className="flex items-center">
                                                        <div className="text-2xl mr-3">📊</div>
                                                        <div>
                                                            <p className="text-sm text-blue-600">Total Absensi</p>
                                                            <p className="text-xl font-bold text-blue-800">{recap.length}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-4">
                                                    <div className="flex items-center">
                                                        <div className="text-2xl mr-3">✅</div>
                                                        <div>
                                                            <p className="text-sm text-green-600">Hadir</p>
                                                            <p className="text-xl font-bold text-green-800">
                                                                {recap.filter(r => r.status === 'hadir').length}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-purple-50 rounded-lg p-4">
                                                    <div className="flex items-center">
                                                        <div className="text-2xl mr-3">📈</div>
                                                        <div>
                                                            <p className="text-sm text-purple-600">Persentase Kehadiran</p>
                                                            <p className="text-xl font-bold text-purple-800">
                                                                {recap.length > 0 ? Math.round((recap.filter(r => r.status === 'hadir').length / recap.length) * 100) : 0}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table */}
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {user.role === 'admin' && (
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                    Nama
                                                                </th>
                                                            )}
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Tanggal
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Hari
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Status
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Jam
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {recap.map((r, i) => (
                                                            <tr key={i} className="hover:bg-gray-50">
                                                                {user.role === 'admin' && (
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {r.user_name || 'N/A'}
                                                                    </td>
                                                                )}
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {r.tanggal}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {r.hari}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        r.status === 'hadir' 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {r.status === 'hadir' ? '✅ Hadir' : '❌ Tidak Hadir'}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {r.jam}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Pagination or Load More could be added here */}
                                            <div className="mt-6 text-center text-sm text-gray-500">
                                                Menampilkan {recap.length} data absensi
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
