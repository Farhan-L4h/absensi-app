import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-6">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="text-4xl">📝</div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Sistem Absensi</h1>
                        <p className="text-sm text-gray-600">Digital Modern</p>
                    </div>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-8 py-6 shadow-xl sm:max-w-md sm:rounded-xl border border-gray-200">
                {children}
            </div>

            <div className="mt-4 text-center">
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                    ← Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
