import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn" aria-label="Close">
                    &times;
                </button>

                <h2 className="text-xl font-bold mb-4">{title}</h2>

                {children}
            </div>
        </div>
    );
}
