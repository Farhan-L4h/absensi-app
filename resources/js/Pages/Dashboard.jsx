import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ sudahAbsen, totalUsers, totalAbsensiHariIni, recentAttendances }) {
    const { auth } = usePage().props;
    const user = auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6">
                                        <h4 className="text-lg font-semibold mb-4">Absensi Terbaru</h4>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {recentAttendances.map((attendance, index) => (
                                                        <tr key={index}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {attendance.user?.name || 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {attendance.tanggal}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {attendance.waktu}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                    Hadir
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
