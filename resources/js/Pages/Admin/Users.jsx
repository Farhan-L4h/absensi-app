import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Users({ users }) {
    const { flash } = usePage().props;

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

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                                            <p className="text-xl font-bold text-blue-800">{users.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">✅</div>
                                        <div>
                                            <p className="text-sm text-green-600">User Aktif</p>
                                            <p className="text-xl font-bold text-green-800">{users.filter(u => u.attendances_count > 0).length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-2xl mr-3">📊</div>
                                        <div>
                                            <p className="text-sm text-purple-600">Total Absensi</p>
                                            <p className="text-xl font-bold text-purple-800">{users.reduce((sum, user) => sum + user.attendances_count, 0)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table Content */}
                            {users.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">👥</div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada User</h4>
                                    <p className="text-gray-600 mb-6">Belum ada user yang terdaftar dalam sistem</p>
                                    <Link
                                        href={route('admin.users.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <span className="mr-2">➕</span>
                                        Tambah User Pertama
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                        <h4 className="text-lg font-medium text-gray-900">Daftar User</h4>
                                        <p className="text-sm text-gray-600">Kelola semua user dalam sistem</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nama
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Total Absensi
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Tanggal Daftar
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {users.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
