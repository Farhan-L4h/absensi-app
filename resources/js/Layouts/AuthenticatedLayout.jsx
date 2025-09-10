import Sidebar from '@/Components/Sidebar';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Sidebar */}
            <Sidebar user={user} />
            
            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top header bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                    <div className="px-4 lg:px-6 py-4">
                        {header ? (
                            <div className="flex items-center justify-between">
                                <div className="ml-12 lg:ml-0">
                                    {header}
                                </div>
                                <div className="hidden sm:flex items-center space-x-4">
                                    <div className="text-sm text-gray-500">
                                        {new Date().toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="text-sm font-medium text-green-600">Online</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between ml-12 lg:ml-0">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                                        <span className="text-white font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            Selamat datang, {user.name}!
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {user.role === 'admin' ? 'Administrator' : 'Karyawan'}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center space-x-4">
                                    <div className="text-sm text-gray-500">
                                        {new Date().toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="text-sm font-medium text-green-600">Online</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
