import { Link } from '@inertiajs/react';
import React from 'react';

export default function Pagination({ links }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav className="pagination-container">
            {links.map((link, index) => {
                const classNames = `pagination-link ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`;

                const label = { __html: link.label };

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className={classNames}
                            dangerouslySetInnerHTML={label}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={classNames}
                        dangerouslySetInnerHTML={label}
                    />
                );
            })}
        </nav>
    );
}
