import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function MainLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <div>
            <header className="bg-white shadow-sm">
                <nav className="container">
                    <div className="font-bold text-lg">Довідник</div>
                    <div className="flex gap-4">
                        <Link href={route('books.index')} className="text-gray-600 hover:text-blue-500">Книги</Link>
                        <Link href={route('authors.index')} className="text-gray-600 hover:text-blue-500">Автори</Link>
                    </div>
                </nav>
            </header>

            <main className="container">
                {flash?.success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        {flash.success}
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}
