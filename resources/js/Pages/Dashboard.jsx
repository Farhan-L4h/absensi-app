import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* tombol Absensi */}
                            <h3 className="text-lg font-semibold mb-4">Selamat datang di Dashboard!</h3>
                            <p className="mb-4">Silakan klik tombol di bawah untuk melakukan absensi.</p>
                            <a
                                href="/absen"
                                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Absen Sekarang
                            </a>
                            {/* end tombol Absensi */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
