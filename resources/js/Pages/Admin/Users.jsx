import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function Users({ users }) {
    const { flash } = usePage().props;
    
    // Filter and pagination states
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    });
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Detail modal state
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                title: '🎉 Berhasil!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'Oke, Siap!',
                confirmButtonColor: '#10B981',
                timer: 3000,
                timerProgressBar: true,
                showClass: {
                    popup: 'animate__animated animate__bounceIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__bounceOut'
                }
            });
        }
        
        if (flash.error) {
            Swal.fire({
                title: '❌ Oops!',
                text: flash.error,
                icon: 'error',
                confirmButtonText: 'Mengerti',
                confirmButtonColor: '#EF4444'
            });
        }
    }, [flash]);

    // Filter users
    useEffect(() => {
        let filtered = [...users];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Status filter
        if (filters.status) {
            if (filters.status === 'active') {
                filtered = filtered.filter(user => user.attendances_count > 0);
            } else if (filters.status === 'inactive') {
                filtered = filtered.filter(user => user.attendances_count === 0);
            }
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(user => {
                const userDate = new Date(user.created_at).toISOString().split('T')[0];
                return userDate >= filters.dateFrom;
            });
        }
        if (filters.dateTo) {
            filtered = filtered.filter(user => {
                const userDate = new Date(user.created_at).toISOString().split('T')[0];
                return userDate <= filters.dateTo;
            });
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [filters, users]);

    // Export to Excel function
    const exportToExcel = () => {
        if (filteredUsers.length === 0) {
            Swal.fire({
                title: '⚠️ Tidak Ada Data',
                text: 'Tidak ada data untuk diekspor',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const worksheetData = filteredUsers.map((user, index) => ({
            'No': index + 1,
            'Nama': user.name,
            'Email': user.email,
            'Total Absensi': user.attendances_count,
            'Status': user.attendances_count > 0 ? 'Aktif' : 'Belum Aktif',
            'Tanggal Daftar': new Date(user.created_at).toLocaleDateString('id-ID'),
            'ID User': user.id
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data User');

        const fileName = `Data_User_${new Date().toISOString().split('T')[0]}.xlsx`;
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
            dateTo: ''
        });
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredUsers.slice(startIndex, endIndex);

    // Show detail modal
    const showDetail = (user) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };
    const handleDelete = (userId, userName) => {
        Swal.fire({
            title: '🗑️ Hapus User?',
            html: `User <strong>"${userName}"</strong> akan dihapus secara permanen!<br><br>
                   <small class="text-gray-500">⚠️ Tindakan ini tidak dapat dibatalkan</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: '🗑️ Ya, Hapus!',
            cancelButtonText: '❌ Batal',
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                confirmButton: 'hover:scale-105 transition-transform',
                cancelButton: 'hover:scale-105 transition-transform'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Show loading
                Swal.fire({
                    title: 'Menghapus...',
                    text: 'Mohon tunggu sebentar',
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                router.delete(route('admin.users.delete', userId), {
                    onSuccess: () => {
                        // Success akan ditangani oleh useEffect flash message
                        Swal.close();
                    },
                    onError: () => {
                        Swal.fire({
                            title: '❌ Error!',
                            text: 'Gagal menghapus user. Silakan coba lagi.',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#EF4444'
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola User" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header dengan Icon */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="text-3xl mr-3">👥</div>
                                        <h3 className="text-2xl font-bold text-gray-900">Kelola User</h3>
                                    </div>
                                    <p className="text-gray-600">Kelola akun karyawan dan monitor aktivitas absensi</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <Link
                                        href={route('admin.users.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <span className="mr-2">➕</span>
                                        Tambah User
                                    </Link>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">👤</div>
                                        <div>
                                            <p className="text-sm text-blue-600">Total User</p>
                                            <p className="text-xl font-bold text-blue-800">{filteredUsers.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">✅</div>
                                        <div>
                                            <p className="text-sm text-green-600">User Aktif</p>
                                            <p className="text-xl font-bold text-green-800">{filteredUsers.filter(u => u.attendances_count > 0).length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">📊</div>
                                        <div>
                                            <p className="text-sm text-purple-600">Total Absensi</p>
                                            <p className="text-xl font-bold text-purple-800">{filteredUsers.reduce((sum, user) => sum + user.attendances_count, 0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            {users.length > 0 && (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8 border border-gray-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                        <div className="flex items-center mb-4 lg:mb-0">
                                            <div className="text-2xl mr-3">🔍</div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">Filter & Pencarian User</h4>
                                                <p className="text-sm text-gray-600">Gunakan filter untuk mencari user tertentu</p>
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
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Search */}
                                        <div className="md:col-span-2 lg:col-span-2">
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">🔍</span>
                                                Pencarian
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Cari nama atau email..."
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
                                                <option value="active">✅ Aktif</option>
                                                <option value="inactive">⚪ Belum Aktif</option>
                                            </select>
                                        </div>

                                        {/* Date From */}
                                        <div>
                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <span className="mr-2">📅</span>
                                                Daftar Dari
                                            </label>
                                            <input
                                                type="date"
                                                value={filters.dateFrom}
                                                onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Results Info */}
                                    <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                                            <div className="flex items-center text-gray-700">
                                                <span className="mr-2">📊</span>
                                                <span className="font-medium">
                                                    Menampilkan {currentData.length} dari {filteredUsers.length} user
                                                </span>
                                                {filteredUsers.length !== users.length && (
                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        difilter dari {users.length} total
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
                                                    className=" py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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

                            {/* Table Content */}
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-8xl mb-6">👥</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                        {users.length === 0 ? 'Belum Ada User' : 'Tidak Ada User Sesuai Filter'}
                                    </h4>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        {users.length === 0 
                                            ? 'Belum ada user yang terdaftar dalam sistem. Silakan tambah user pertama.'
                                            : 'Coba ubah atau reset filter pencarian untuk melihat user lainnya'
                                        }
                                    </p>
                                    {users.length === 0 ? (
                                        <Link
                                            href={route('admin.users.create')}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <span className="mr-2">➕</span>
                                            Tambah User Pertama
                                        </Link>
                                    ) : (
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
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">👤</span>
                                                            Nama
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">📧</span>
                                                            Email
                                                        </div>
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                        <div className="flex items-center">
                                                            <span className="mr-2">📊</span>
                                                            Total Absensi
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
                                                            <span className="mr-2">📅</span>
                                                            Tanggal Daftar
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
                                                {currentData.map((user, index) => (
                                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                                                                        <span className="text-white font-semibold text-lg">
                                                                            {user.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                        {user.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        ID: {user.id}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                    {user.attendances_count} kali
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                user.attendances_count > 0 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {user.attendances_count > 0 ? '✅ Aktif' : '⚪ Belum Aktif'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => showDetail(user)}
                                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
                                                                >
                                                                    <span className="mr-1">📋</span>
                                                                    Detail
                                                                </button>
                                                                <Link
                                                                    href={route('admin.users.edit', user.id)}
                                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                                                                >
                                                                    <span className="mr-1">✏️</span>
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(user.id, user.name)}
                                                                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                                                >
                                                                    <span className="mr-1">🗑️</span>
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Empty State */}
                                    {currentData.length === 0 && (
                                        <div className="text-center py-12">
                                            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-3xl">🔍</span>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {filters.search || filters.status || filters.dateFrom || filters.dateTo 
                                                    ? 'Tidak ada data yang sesuai' 
                                                    : 'Belum ada user'
                                                }
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.search || filters.status || filters.dateFrom || filters.dateTo 
                                                    ? 'Coba ubah filter pencarian Anda' 
                                                    : 'Belum ada user yang terdaftar dalam sistem'
                                                }
                                            </p>
                                            {(filters.search || filters.status || filters.dateFrom || filters.dateTo) && (
                                                <button
                                                    onClick={resetFilters}
                                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md"
                                                >
                                                    🔄 Reset Filter
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {filteredUsers.length > itemsPerPage && (
                                        <div className="bg-white border-t border-gray-200 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-700">
                                                    Menampilkan <span className="font-semibold">{startIndex + 1}</span> sampai{' '}
                                                    <span className="font-semibold">{Math.min(endIndex, filteredUsers.length)}</span> dari{' '}
                                                    <span className="font-semibold">{filteredUsers.length}</span> user
                                                </div>
                                                
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentPage === 1}
                                                        className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                                    >
                                                        ← Sebelumnya
                                                    </button>
                                                    
                                                    <div className="flex items-center space-x-1">
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
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 transform transition-all scale-100 hover:scale-[1.02] duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-6 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">👤</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Detail User</h3>
                                        <p className="text-blue-100 text-sm">Informasi lengkap pengguna</p>
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
                                {/* Info Cards Grid */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">👤</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Nama Lengkap</p>
                                                <p className="text-sm font-bold text-blue-800">{selectedUser.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">📧</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Email Address</p>
                                                <p className="text-sm font-bold text-green-800">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">🆔</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">User ID</p>
                                                <p className="text-sm font-bold text-purple-800">#{selectedUser.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics Section */}
                                <div className="bg-gradient-to-r from-gray-50 to-slate-100 p-4 rounded-xl border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                        <span className="mr-2">📊</span>
                                        Statistik & Status
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                            <div className="text-2xl mb-1">{selectedUser.attendances_count > 0 ? '✅' : '⚪'}</div>
                                            <p className="text-xs text-gray-500">Status</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {selectedUser.attendances_count > 0 ? 'Aktif' : 'Belum Aktif'}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                                            <div className="text-2xl mb-1">📊</div>
                                            <p className="text-xs text-gray-500">Total Absensi</p>
                                            <p className="text-sm font-bold text-gray-800">{selectedUser.attendances_count}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">📅</span>
                                            <div>
                                                <p className="text-xs text-orange-600 font-medium">Tanggal Daftar</p>
                                                <p className="text-sm font-bold text-orange-800">
                                                    {new Date(selectedUser.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg">{selectedUser.email_verified_at ? '✅' : '❌'}</span>
                                            <div>
                                                <p className="text-xs text-indigo-600 font-medium">Verifikasi Email</p>
                                                <p className="text-sm font-bold text-indigo-800">
                                                    {selectedUser.email_verified_at ? 'Terverifikasi' : 'Belum Verifikasi'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    ✕ Tutup
                                </button>
                                <Link
                                    href={route('admin.users.edit', selectedUser.id)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    ✏️ Edit User
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
