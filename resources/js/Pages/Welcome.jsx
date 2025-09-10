import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Sistem Absensi Digital" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
                {/* Navigation */}
                <nav className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="text-3xl">📝</div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Sistem Absensi Digital</h1>
                                <p className="text-sm text-gray-600">Solusi modern untuk kehadiran karyawan</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    <span className="mr-2">🏠</span>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <span className="mr-2">🔑</span>
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <span className="mr-2">📋</span>
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="mb-8">
                            <div className="text-8xl mb-6">⏰</div>
                            <h2 className="text-5xl font-bold text-gray-900 mb-4">
                                Sistem Absensi
                                <span className="block text-blue-600">Digital Modern</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                Kelola kehadiran karyawan dengan mudah dan efisien. Sistem absensi berbasis lokasi yang akurat dan real-time.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">📱</div>
                                <h3 className="text-xl font-semibold mb-2">Absensi Mobile</h3>
                                <p className="text-gray-600">Lakukan absensi kapan saja, di mana saja dengan smartphone Anda</p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">🗺️</div>
                                <h3 className="text-xl font-semibold mb-2">Tracking Lokasi</h3>
                                <p className="text-gray-600">Sistem GPS terintegrasi untuk memastikan kehadiran di lokasi kerja</p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold mb-2">Laporan Real-time</h3>
                                <p className="text-gray-600">Dashboard dan laporan kehadiran yang dapat diakses secara real-time</p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        {!auth.user && (
                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Mulai Sekarang</h3>
                                <p className="text-gray-600 mb-6">
                                    Bergabunglah dengan sistem absensi digital yang mudah dan efisien
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-lg font-medium"
                                    >
                                        <span className="mr-2">🚀</span>
                                        Daftar Gratis
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm text-lg font-medium"
                                    >
                                        <span className="mr-2">👋</span>
                                        Sudah Punya Akun?
                                    </Link>
                                </div>
                            </div>
                        )}

                        {auth.user && (
                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    Selamat Datang, {auth.user.name}!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Anda sudah login. Akses dashboard untuk mulai menggunakan sistem absensi.
                                </p>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-lg font-medium"
                                >
                                    <span className="mr-2">🏠</span>
                                    Buka Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-6 py-8 text-center text-gray-600">
                    <div className="max-w-4xl mx-auto">
                        <div className="border-t border-gray-200 pt-8">
                            <p className="mb-4">
                                © 2025 Sistem Absensi Digital. Dibuat dengan ❤️ menggunakan Laravel & React.
                            </p>
                            <div className="flex justify-center space-x-6 text-sm">
                                <span className="flex items-center">
                                    <span className="mr-1">⚡</span>
                                    Powered by Laravel
                                </span>
                                <span className="flex items-center">
                                    <span className="mr-1">⚛️</span>
                                    Built with React
                                </span>
                                <span className="flex items-center">
                                    <span className="mr-1">🎨</span>
                                    Styled with Tailwind
                                </span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
