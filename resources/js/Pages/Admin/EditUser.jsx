import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Swal from 'sweetalert2';

export default function EditUser({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
    });
    
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.success) {
            Swal.fire({
                title: '💾 Data Berhasil Disimpan!',
                text: flash.success,
                icon: 'success',
                confirmButtonText: 'Selesai',
                confirmButtonColor: '#10B981',
                timer: 3000,
                timerProgressBar: true
            });
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: '💾 Simpan Perubahan?',
            html: `Memperbarui data user:<br><strong>${data.name}</strong><br><small class="text-gray-500">${data.email}</small>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            cancelButtonColor: '#6B7280',
            confirmButtonText: '💾 Simpan',
            cancelButtonText: '❌ Batal',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                put(route('admin.users.update', user.id), {
                    onSuccess: () => {
                        // Success akan ditangani oleh useEffect flash message
                    },
                    onError: () => {
                        Swal.fire({
                            title: '❌ Error!',
                            text: 'Gagal memperbarui user. Periksa form dan coba lagi.',
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
            <Head title="Edit User" />

            <div className="py-4">
                <div className="mx-auto max-w-2xl">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <div className="text-3xl mr-3">✏️</div>
                                        <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
                                    </div>
                                    <p className="text-gray-600">Perbarui informasi user {user.name}</p>
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

                            {/* User Info Card */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm mr-4">
                                        <span className="text-white font-semibold text-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-900">{user.name}</h4>
                                        <p className="text-sm text-blue-600">{user.email}</p>
                                        <p className="text-xs text-blue-500">Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Ubah Password (Opsional)</h4>
                                    <p className="text-sm text-yellow-600 mb-4">Kosongkan jika tidak ingin mengubah password</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="password" value="Password Baru" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-1 block w-full"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
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
                                    <PrimaryButton disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">💾</span>
                                                Simpan Perubahan
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
