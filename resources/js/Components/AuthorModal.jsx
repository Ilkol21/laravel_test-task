import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from './Modal';

export default function AuthorModal({ isOpen, onClose, author }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        patronymic: '',
        _method: 'POST',
    });

    useEffect(() => {
        if (author) {
            setData({
                first_name: author.first_name,
                last_name: author.last_name,
                patronymic: author.patronymic || '',
                _method: 'PUT',
            });
        }
    }, [author]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };
        if (author) {
            post(route('authors.update', author.id), options);
        } else {
            post(route('authors.store'), options);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={author ? 'Редагувати автора' : 'Додати автора'}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Прізвище</label>
                    <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="form-input" />
                    {errors.last_name && <div className="form-error">{errors.last_name}</div>}
                </div>
                <div className="mb-4">
                    <label className="form-label">Ім'я</label>
                    <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="form-input" />
                    {errors.first_name && <div className="form-error">{errors.first_name}</div>}
                </div>
                <div className="mb-4">
                    <label className="form-label">По-батькові</label>
                    <input type="text" value={data.patronymic} onChange={e => setData('patronymic', e.target.value)} className="form-input" />
                    {errors.patronymic && <div className="form-error">{errors.patronymic}</div>}
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={handleClose} className="btn btn-secondary">Скасувати</button>
                    <button type="submit" disabled={processing} className="btn btn-primary">{processing ? 'Збереження...' : 'Зберегти'}</button>
                </div>
            </form>
        </Modal>
    );
}
