import { Link, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function MainLayout({ children }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />

            <header className="bg-white shadow-sm">
                <nav className="container">
                    <div className="font-bold text-lg">Book directory</div>
                    <div className="nav-links">
                        <Link href={route('books.index')}>Books</Link>
                        <Link href={route('authors.index')}>Authors</Link>
                    </div>
                </nav>
            </header>

            <main className="container">
                {children}
            </main>
        </div>
    );
}
