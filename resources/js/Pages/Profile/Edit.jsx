import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Edit Profile - Sistem Absensi" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">👤</span>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Edit Profile
                                    </h2>
                                    <p className="text-gray-600">Kelola informasi akun Anda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">📝</span>
                                Informasi Profile
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Perbarui informasi profil dan alamat email akun Anda.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <span className="mr-2">🔒</span>
                                Perbarui Password
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-red-200">
                        <div className="p-6 border-b border-red-200">
                            <h3 className="text-lg font-semibold text-red-900 flex items-center">
                                <span className="mr-2">⚠️</span>
                                Hapus Akun
                            </h3>
                            <p className="text-sm text-red-600 mt-1">
                                Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen.
                            </p>
                        </div>
                        <div className="p-6">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
