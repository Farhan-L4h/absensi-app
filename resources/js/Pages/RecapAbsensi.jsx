import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function RecapAbsensi() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [recap, setRecap] = useState([]);
    const [filteredRecap, setFilteredRecap] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        dateFrom: '',
        dateTo: '',
        user: ''
    });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Detail modal state
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        axios.get('/rekap/data')
            .then(res => {
                setRecap(res.data.recap);
                setFilteredRecap(res.data.recap);
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

    // Filter function
    useEffect(() => {
        let filtered = [...recap];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(item => 
                (item.user_name && item.user_name.toLowerCase().includes(filters.search.toLowerCase())) ||
                item.tanggal.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.status.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Status filter
        if (filters.status) {
            filtered = filtered.filter(item => item.status === filters.status);
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(item => item.tanggal >= filters.dateFrom);
        }
        if (filters.dateTo) {
            filtered = filtered.filter(item => item.tanggal <= filters.dateTo);
        }

        // User filter (for admin)
        if (filters.user && user.role === 'admin') {
            filtered = filtered.filter(item => item.user_name === filters.user);
        }

        setFilteredRecap(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [filters, recap]);

    // Export to Excel function
    const exportToExcel = () => {
        if (filteredRecap.length === 0) {
            Swal.fire({
                title: '⚠️ Tidak Ada Data',
                text: 'Tidak ada data untuk diekspor',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const worksheetData = filteredRecap.map((item, index) => ({
            'No': index + 1,
            ...(user.role === 'admin' && { 'Nama': item.user_name || 'N/A' }),
            'Tanggal': item.tanggal,
            'Hari': item.hari,
            'Status': item.status,
            'Jam': item.jam,
            'Lokasi': item.lat && item.lng ? `${item.lat}, ${item.lng}` : 'Tidak Ada'
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Absensi');

        const fileName = `Rekap_Absensi_${user.role === 'admin' ? 'All_Users' : user.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        Swal.fire({
            title: '📊 Export Berhasil!',
            text: `File ${fileName} berhasil diunduh`,
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000
        });
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            search: '',
            status: '',
            dateFrom: '',
            dateTo: '',
            user: ''
        });
    };

    // Get unique users for filter (admin only)
    const uniqueUsers = user.role === 'admin' ? [...new Set(recap.map(item => item.user_name).filter(Boolean))] : [];

    // Pagination logic
    const totalPages = Math.ceil(filteredRecap.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredRecap.slice(startIndex, endIndex);

    // Show detail modal
    const showDetail = (item) => {
        setSelectedDetail(item);
        setShowDetailModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Rekap Absensi" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center mb-3">
                                    <div className="text-3xl mr-3">📊</div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {user.role === 'admin' ? 'Rekap Absensi Semua User' : 'Rekap Absensi Saya'}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {user.role === 'admin' 
                                                ? 'Data absensi seluruh karyawan dalam sistem' 
                                                : `Riwayat kehadiran dan absensi ${user.name}`
                                            }
                                        </p>
                                    </div>
                                </div>
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

                            {/* Filters */}
                            {!loading && !error && recap.length > 0 && (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                        <div className="flex items-center mb-4 lg:mb-0">
                                            <div className="text-2xl mr-3">🔍</div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">Filter & Pencarian Data</h4>
                                                <p className="text-sm text-gray-600">Gunakan filter untuk mempersempit data absensi</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={exportToExcel}
                                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <span className="mr-2">📊</span>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={resetFilters}
                                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <span className="mr-2">🔄</span>
                                                Reset Filter
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                        {/* Search */}
                                        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">🔍</span>
                                                Pencarian
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Cari nama, tanggal, status..."
                                                value={filters.search}
                                                onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                            />
                                        </div>

                                        {/* Status Filter */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">📋</span>
                                                Status
                                            </label>
                                            <select
                                                value={filters.status}
                                                onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                            >
                                                <option value="">Semua Status</option>
                                                <option value="Hadir">✅ Hadir</option>
                                                <option value="Telat">⏰ Telat</option>
                                                <option value="Alpha">❌ Alpha</option>
                                                <option value="Sakit">🤒 Sakit</option>
                                                <option value="Izin">📋 Izin</option>
                                            </select>
                                        </div>

                                        {/* Date From */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">📅</span>
                                                Dari Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={filters.dateFrom}
                                                onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                            />
                                        </div>

                                        {/* Date To */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">📅</span>
                                                Sampai Tanggal
                                            </label>
                                            <input
                                                type="date"
                                                value={filters.dateTo}
                                                onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                            />
                                        </div>

                                        {/* User Filter (Admin Only) */}
                                        {user.role === 'admin' && (
                                            <div>
                                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                    <span className="mr-2">👤</span>
                                                    Karyawan
                                                </label>
                                                <select
                                                    value={filters.user}
                                                    onChange={(e) => setFilters(prev => ({...prev, user: e.target.value}))}
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                                >
                                                    <option value="">Semua Karyawan</option>
                                                    {uniqueUsers.map(userName => (
                                                        <option key={userName} value={userName}>{userName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {/* Results Info */}
                                    <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                                            <div className="flex items-center text-gray-700 ">
                                                <span className="mr-2">📊</span>
                                                <span className="font-medium">
                                                    Menampilkan {currentData.length} dari {filteredRecap.length} data
                                                </span>
                                                {filteredRecap.length !== recap.length && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        difilter dari {recap.length} total
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-3 sm:mt-0 flex items-center">
                                                <label className="text-gray-700 font-medium mr-3">Items per halaman:</label>
                                                <select
                                                    value={itemsPerPage}
                                                    onChange={(e) => {
                                                        setItemsPerPage(Number(e.target.value));
                                                        setCurrentPage(1);
                                                    }}
                                                    className="py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all "
                                                >
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data Table */}
                            {!loading && !error && (
                                <>
                                    {filteredRecap.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="text-8xl mb-6">📅</div>
                                            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                                {recap.length === 0 ? 'Belum Ada Data Absensi' : 'Tidak Ada Data Sesuai Filter'}
                                            </h4>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                {recap.length === 0 
                                                    ? (user.role === 'admin' 
                                                        ? 'Belum ada data absensi dari karyawan dalam sistem' 
                                                        : 'Anda belum melakukan absensi. Silakan lakukan absensi terlebih dahulu')
                                                    : 'Coba ubah atau reset filter pencarian untuk melihat data lainnya'
                                                }
                                            </p>
                                            {recap.length > 0 && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <span className="mr-2">🔄</span>
                                                    Reset Filter
                                                </button>
                                            )}
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
                                                            <p className="text-xl font-bold text-blue-800">{filteredRecap.length}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-green-50 rounded-lg p-4">
                                                    <div className="flex items-center">
                                                        <div className="text-2xl mr-3">✅</div>
                                                        <div>
                                                            <p className="text-sm text-green-600">Hadir</p>
                                                            <p className="text-xl font-bold text-green-800">
                                                                {filteredRecap.filter(r => r.status === 'Hadir' || r.status === 'Telat').length}
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
                                                                {filteredRecap.length > 0 ? Math.round((filteredRecap.filter(r => r.status === 'Hadir' || r.status === 'Telat').length / filteredRecap.length) * 100) : 0}%
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Table */}
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200">
                                                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                                            <tr>
                                                                {user.role === 'admin' && (
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                        <div className="flex items-center">
                                                                            <span className="mr-2">👤</span>
                                                                            Nama
                                                                        </div>
                                                                    </th>
                                                                )}
                                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">📅</span>
                                                                        Tanggal
                                                                    </div>
                                                                </th>
                                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">📆</span>
                                                                        Hari
                                                                    </div>
                                                                </th>
                                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">📋</span>
                                                                        Status
                                                                    </div>
                                                                </th>
                                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">⏰</span>
                                                                        Jam
                                                                    </div>
                                                                </th>
                                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">⚙️</span>
                                                                        Aksi
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {currentData.map((r, i) => (
                                                                <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                                                                    {user.role === 'admin' && (
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm mr-3">
                                                                                    <span className="text-white font-semibold text-xs">
                                                                                        {(r.user_name || 'N').charAt(0).toUpperCase()}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-sm font-medium text-gray-900">
                                                                                    {r.user_name || 'N/A'}
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    )}
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                        {r.tanggal}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                                        {r.hari}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                                                            r.status === 'Hadir' || r.status === 'Telat'
                                                                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                                                                : r.status === 'Sakit'
                                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                                : r.status === 'Izin'
                                                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                                : 'bg-red-100 text-red-800 border border-red-200'
                                                                        }`}>
                                                                            {r.status === 'Hadir' && '✅ Hadir'}
                                                                            {r.status === 'Telat' && '⏰ Telat'}
                                                                            {r.status === 'Sakit' && '🤒 Sakit'}
                                                                            {r.status === 'Izin' && '📋 Izin'}
                                                                            {r.status === 'Alpha' && '❌ Alpha'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                                                        {r.jam}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <button
                                                                            onClick={() => showDetail(r)}
                                                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all duration-200 hover:shadow-sm"
                                                                        >
                                                                            <span className="mr-1">👁️</span>
                                                                            Detail
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Pagination */}
                                                {totalPages > 1 && (
                                                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm text-gray-700 font-medium">
                                                                📄 Halaman {currentPage} dari {totalPages}
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                                    disabled={currentPage === 1}
                                                                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                                                >
                                                                    ← Sebelumnya
                                                                </button>
                                                                
                                                                {/* Page numbers */}
                                                                <div className="flex space-x-1">
                                                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                                        let pageNum;
                                                                        if (totalPages <= 5) {
                                                                            pageNum = i + 1;
                                                                        } else if (currentPage <= 3) {
                                                                            pageNum = i + 1;
                                                                        } else if (currentPage >= totalPages - 2) {
                                                                            pageNum = totalPages - 4 + i;
                                                                        } else {
                                                                            pageNum = currentPage - 2 + i;
                                                                        }
                                                                        
                                                                        return (
                                                                            <button
                                                                                key={pageNum}
                                                                                onClick={() => setCurrentPage(pageNum)}
                                                                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all shadow-sm ${
                                                                                    currentPage === pageNum
                                                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                                }`}
                                                                            >
                                                                                {pageNum}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                                
                                                                <button
                                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                                    disabled={currentPage === totalPages}
                                                                    className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                                                >
                                                                    Selanjutnya →
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 transform transition-all scale-100 hover:scale-[1.02] duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">📋</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Detail Absensi</h3>
                                        <p className="text-blue-100 text-sm">Informasi kehadiran karyawan</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200"
                                >
                                    <span className="text-xl">×</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6">
                        
                            <div className="space-y-5">
                                {/* Employee Info (only for admin) */}
                                {user.role === 'admin' && (
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">👤</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Nama Karyawan</p>
                                                <p className="text-sm font-bold text-blue-800">{selectedDetail.user_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date & Time Cards */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">📅</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Tanggal & Hari</p>
                                                <p className="text-sm font-bold text-green-800">{selectedDetail.tanggal} - {selectedDetail.hari}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">⏰</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Waktu Absensi</p>
                                                <p className="text-sm font-bold text-purple-800">{selectedDetail.jam}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 rounded-xl border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Status Kehadiran
                                    </h4>
                                    <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                                        <div className="text-center">
                                            <div className="text-3xl mb-2">
                                                {selectedDetail.status === 'Hadir' && '✅'}
                                                {selectedDetail.status === 'Telat' && '⏰'}
                                                {selectedDetail.status === 'Sakit' && '🤒'}
                                                {selectedDetail.status === 'Izin' && '📋'}
                                                {selectedDetail.status === 'Alpha' && '❌'}
                                            </div>
                                            <p className="text-lg font-bold text-gray-800">{selectedDetail.status}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-lg">📍</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-orange-600 uppercase tracking-wide">Lokasi Absensi</p>
                                            {selectedDetail.lat && selectedDetail.lng ? (
                                                <div>
                                                    <p className="text-sm font-bold text-orange-800 mb-2">
                                                        Lat: {selectedDetail.lat}, Lng: {selectedDetail.lng}
                                                    </p>
                                                    <a
                                                        href={`https://maps.google.com?q=${selectedDetail.lat},${selectedDetail.lng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        <span className="mr-1">🗺️</span>
                                                        Lihat di Google Maps
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="text-sm font-bold text-orange-400">Tidak ada data lokasi</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    ✕ Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
