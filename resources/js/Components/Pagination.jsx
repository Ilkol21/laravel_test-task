import { Link } from '@inertiajs/react';
import React from 'react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="mt-6 flex flex-wrap gap-1">
            {links.map((link, index) => {
                const className = `px-4 py-2 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-white'} ${!link.url ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`;

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={className}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={className}
                    />
                );
            })}
        </div>
    );
}
