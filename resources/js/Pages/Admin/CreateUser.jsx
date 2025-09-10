import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Swal from 'sweetalert2';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                title: '🎉 User Berhasil Dibuat!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'Lanjutkan',
                confirmButtonColor: '#10B981',
                timer: 3000,
                timerProgressBar: true
            });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: '👤 Buat User Baru?',
            html: `Akan membuat akun untuk:<br><strong>${data.name}</strong><br><small class="text-gray-500">${data.email}</small>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            cancelButtonColor: '#6B7280',
            confirmButtonText: '✅ Ya, Buat User!',
            cancelButtonText: '❌ Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.users.store'), {
                    onSuccess: () => reset('password', 'password_confirmation'),
                    onError: () => {
                        Swal.fire({
                            title: '❌ Error!',
                            text: 'Gagal membuat user. Periksa form dan coba lagi.',
                            icon: 'error',
                            confirmButtonText: 'Coba Lagi',
                            confirmButtonColor: '#EF4444'
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah User" />

            <div className="py-4">
                <div className="mx-auto max-w-2xl">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="text-3xl mr-3">➕</div>
                                        <h3 className="text-2xl font-bold text-gray-900">Tambah User Baru</h3>
                                    </div>
                                    <p className="text-gray-600">Buat akun baru untuk karyawan</p>
                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <Link
                                        href={route('admin.users')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                                    >
                                        <span className="mr-2">←</span>
                                        Kembali
                                    </Link>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <div className="text-blue-600 mr-3 mt-0.5">ℹ️</div>
                                    <div>
                                        <h4 className="text-blue-800 font-medium mb-1">Informasi:</h4>
                                        <ul className="text-blue-600 text-sm space-y-1">
                                            <li>• User baru akan memiliki role "user" secara otomatis</li>
                                            <li>• Password minimal 8 karakter</li>
                                            <li>• Email harus unik dan valid</li>
                                            <li>• User dapat login setelah akun dibuat</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">👤</span>
                                        Informasi Dasar
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                                            <TextInput
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                autoComplete="name"
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                                placeholder="Masukkan nama lengkap"
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="mt-1 block w-full"
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                placeholder="contoh@email.com"
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="bg-red-50 rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <span className="mr-2">🔒</span>
                                        Keamanan Akun
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="password" value="Password" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                placeholder="Minimal 8 karakter"
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                                placeholder="Ulangi password"
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Link
                                        href={route('admin.users')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <PrimaryButton disabled={processing} className="bg-green-600 hover:bg-green-700">
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Membuat User...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">➕</span>
                                                Buat User
                                            </>
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
