import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ sudahAbsen, totalUsers, totalAbsensiHariIni, recentAttendances }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-4">
                <div className="mx-auto max-w-7xl">
                    {user.role === 'admin' ? (
                        // Dashboard Admin
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <h3 className="text-2xl font-bold mb-2">Dashboard Administrator</h3>
                                    <p className="text-gray-600">Selamat datang, {user.name}!</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-500 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-white">
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold">Total Users</h4>
                                                <p className="text-3xl font-bold">{totalUsers || 0}</p>
                                            </div>
                                            <div className="text-4xl opacity-80">
                                                👥
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-500 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-white">
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold">Absensi Hari Ini</h4>
                                                <p className="text-3xl font-bold">{totalAbsensiHariIni || 0}</p>
                                            </div>
                                            <div className="text-4xl opacity-80">
                                                ✅
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-500 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-white">
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold">Total Rekap</h4>
                                                <p className="text-sm">Lihat semua data</p>
                                            </div>
                                            <div className="text-4xl opacity-80">
                                                📊
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold mb-4">Aksi Cepat</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Link
                                            href={route('rekap')}
                                            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <div className="text-2xl mr-3">📋</div>
                                            <div>
                                                <h5 className="font-semibold">Lihat Rekap Absensi</h5>
                                                <p className="text-sm text-gray-600">Kelola dan pantau absensi karyawan</p>
                                            </div>
                                        </Link>
                                        
                                        <Link
                                            href="/admin/users"
                                            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                        >
                                            <div className="text-2xl mr-3">👤</div>
                                            <div>
                                                <h5 className="font-semibold">Kelola User</h5>
                                                <p className="text-sm text-gray-600">Tambah, edit, atau hapus user</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Attendances */}
                            {recentAttendances && recentAttendances.length > 0 && (
                                <div className="bg-gradient-to-br from-white to-gray-50 overflow-hidden shadow-xl sm:rounded-2xl border border-gray-200">
                                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                                <span className="text-white text-lg">📋</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-white">Absensi Terbaru</h4>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                                            <div className="flex items-center space-x-2">
                                                                <span>👤</span>
                                                                <span>Karyawan</span>
                                                            </div>
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                                            <div className="flex items-center space-x-2">
                                                                <span>📅</span>
                                                                <span>Tanggal</span>
                                                            </div>
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                                                            <div className="flex items-center space-x-2">
                                                                <span>⏰</span>
                                                                <span>Waktu</span>
                                                            </div>
                                                        </th>
                                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                            <div className="flex items-center space-x-2">
                                                                <span>📊</span>
                                                                <span>Status</span>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {recentAttendances.map((attendance, index) => (
                                                        <tr key={index} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                                        <span className="text-white text-sm font-bold">
                                                                            {(attendance.user?.name || 'N/A').charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-bold text-gray-900">
                                                                            {attendance.user?.name || 'N/A'}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {attendance.user?.email || ''}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {attendance.tanggal}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {attendance.hari || ''}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap border-r border-gray-100">
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {attendance.waktu || attendance.jam}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                                                    attendance.status === 'Hadir' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                                                                    attendance.status === 'Telat' ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border border-orange-200' :
                                                                    attendance.status === 'Sakit' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                                                                    attendance.status === 'Izin' ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200' :
                                                                    attendance.status === 'Alpha' ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200' :
                                                                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                                                                }`}>
                                                                    <span className="mr-1">
                                                                        {attendance.status === 'Hadir' ? '✅' :
                                                                         attendance.status === 'Telat' ? '⏰' :
                                                                         attendance.status === 'Sakit' ? '🤒' :
                                                                         attendance.status === 'Izin' ? '📋' :
                                                                         attendance.status === 'Alpha' ? '❌' : '✅'}
                                                                    </span>
                                                                    {attendance.status || 'Hadir'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        
                                        {/* View All Link */}
                                        <div className="mt-4 text-center">
                                            <Link
                                                href={route('rekap')}
                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="mr-2">📊</span>
                                                Lihat Semua Rekap Absensi
                                                <span className="ml-2">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Dashboard User
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <h3 className="text-2xl font-bold mb-2">Dashboard Karyawan</h3>
                                    <p className="text-gray-600">Selamat datang, {user.name}!</p>
                                </div>
                            </div>

                            {/* Status Absensi Card */}
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold">Status Absensi Hari Ini</h4>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            sudahAbsen 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {sudahAbsen ? '✅ Sudah Absen' : '❌ Belum Absen'}
                                        </span>
                                    </div>
                                    
                                    {!sudahAbsen && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-800 mb-3">
                                                Silakan lakukan absensi untuk hari ini
                                            </p>
                                            <Link
                                                href={route('absen')}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                📝 Absen Sekarang
                                            </Link>
                                        </div>
                                    )}
                                    
                                    {sudahAbsen && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-green-800">
                                                ✅ Terima kasih! Anda sudah melakukan absensi hari ini.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold mb-3">Informasi Akun</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <span className="text-sm text-gray-600">Nama:</span>
                                                <p className="font-medium">{user.name}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Email:</span>
                                                <p className="font-medium">{user.email}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-600">Role:</span>
                                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold mb-3">Menu Cepat</h4>
                                        <div className="space-y-3">
                                            <Link
                                                href={route('absen')}
                                                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                            >
                                                <span className="text-xl mr-3">📝</span>
                                                <span className="font-medium">Form Absensi</span>
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <span className="text-xl mr-3">👤</span>
                                                <span className="font-medium">Edit Profile</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
