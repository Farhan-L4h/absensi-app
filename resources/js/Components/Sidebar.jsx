import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ user }) {
    const { url } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            icon: '🏠',
            current: url === '/dashboard',
            description: 'Ringkasan sistem'
        },
        ...(user.role === 'admin' ? [
            {
                name: 'Kelola User',
                href: '/admin/users',
                icon: '👥',
                current: url.startsWith('/admin/users'),
                description: 'Manajemen karyawan'
            },
            {
                name: 'Rekap Absensi',
                href: route('rekap'),
                icon: '📊',
                current: url === '/rekap',
                description: 'Laporan kehadiran'
            }
        ] : [
            {
                name: 'Form Absensi',
                href: route('absen'),
                icon: '📝',
                current: url === '/absen',
                description: 'Catat kehadiran',
                badge: 'Hari ini'
            },
            {
                name: 'Rekap Absensi',
                href: route('rekap'),
                icon: '📊',
                current: url === '/rekap',
                description: 'Riwayat absensi'
            }
        ]),
        {
            name: 'Profile',
            href: route('profile.edit'),
            icon: '👤',
            current: url === '/profile',
            description: 'Pengaturan akun'
        }
    ];

    return (
        <>
            {/* Mobile menu button */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="bg-white p-2 rounded-lg shadow-lg border border-gray-200"
                >
                    <div className="w-6 h-6 flex flex-col justify-center items-center">
                        <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                        <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
                
                {/* Logo */}
                <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Link href="/" className="flex items-center space-x-2 text-white">
                        <div className="text-2xl">📝</div>
                        <div className="text-center">
                            <div className="text-lg font-bold">Sistem Absensi</div>
                            <div className="text-xs opacity-90">Digital Modern</div>
                        </div>
                    </Link>
                </div>

                {/* User Info */}
                <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {user.email}
                            </div>
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                {user.role === 'admin' ? '👑 Administrator' : '👤 User'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Menu Utama
                    </div>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-start px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                                item.current
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-3 border-blue-600 shadow-sm scale-[1.02]'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900 hover:shadow-sm'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className={`text-lg mr-3 transition-transform duration-200 ${
                                item.current ? 'scale-110' : 'group-hover:scale-105'
                            }`}>
                                {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{item.name}</span>
                                    {item.badge && !item.current && (
                                        <span className="inline-flex text-center items-center p-1 rounded-xl text-xs font-regular bg-orange-100 text-orange-800 ml-1 animate-pulse">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                {item.description && (
                                    <div className={`text-xs mt-0.5 ${
                                        item.current ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'
                                    }`}>
                                        {item.description}
                                    </div>
                                )}
                            </div>
                            {item.current && (
                                <span className="ml-2 flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                </span>
                            )}
                            {!item.current && (
                                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                    <div className="space-y-2">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="text-lg mr-3">🚪</span>
                            Logout
                        </Link>
                    </div>
                    
                    {/* Footer Info */}
                    {/* <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center space-y-2">
                            <div className="flex items-center justify-center space-x-3">
                                <span className="flex items-center px-2 py-1 bg-red-50 text-red-600 rounded-md">
                                    <span className="mr-1">⚡</span>
                                    Laravel
                                </span>
                                <span className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                                    <span className="mr-1">⚛️</span>
                                    React
                                </span>
                            </div>
                            <div className="text-gray-400">
                                <div className="font-medium">© 2025 Sistem Absensi</div>
                                <div className="text-xs">Digital Modern v1.0</div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
}
