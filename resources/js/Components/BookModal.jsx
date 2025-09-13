import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Modal from './Modal';
import Select from 'react-select';

export default function BookModal({ isOpen, onClose, book, authorsList }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        publication_date: '',
        image: null,
        authors: [],
    });

    const authorOptions = authorsList.map(author => ({
        value: author.id,
        label: `${author.last_name} ${author.first_name}`
    }));

    useEffect(() => {
        if (book) {
            setData({
                title: book.title || '',
                description: book.description || '',
                publication_date: book.publication_date || '',
                authors: book.authors.map(a => a.id) || [],
                image: null,
            });
        }
    }, [book]);

    const handleAuthorsChange = (selectedOptions) => {
        setData('authors', selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true,
        };
        if (book) {
            post(route('books.update', book.id), options);
        } else {
            post(route('books.store'), options);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const selectedAuthorValues = authorOptions.filter(option =>
        data.authors.includes(option.value)
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={book ? 'Edit book' : 'Add a book'}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Title</label>
                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="form-input" />
                    {errors.title && <div className="form-error">{errors.title}</div>}
                </div>

                <div className="mb-4">
                    <label className="form-label">Authors</label>
                    <Select
                        isMulti
                        options={authorOptions}
                        value={selectedAuthorValues}
                        onChange={handleAuthorsChange}
                        className="form-input p-0 border-none"
                        placeholder="Select one or more authors..."
                        noOptionsMessage={() => 'No authors found'}
                    />
                    {errors.authors && <div className="form-error">{errors.authors}</div>}
                </div>

                <div className="mb-4">
                    <label className="form-label">Description</label>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="form-input h-24"></textarea>
                    {errors.description && <div className="form-error">{errors.description}</div>}
                </div>
                <div className="mb-4">
                    <label className="form-label">Date of publication</label>
                    <input type="date" value={data.publication_date} onChange={e => setData('publication_date', e.target.value)} className="form-input" />
                    {errors.publication_date && <div className="form-error">{errors.publication_date}</div>}
                </div>
                <div className="mb-4">
                    <label className="form-label">Image</label>

                    {book && book.image && (
                        <div className="current-image-preview">
                            <p>Current image:</p>
                            <img src={`/storage/${book.image}`} alt="Current image"/>
                        </div>
                    )}

                    <input type="file" onChange={e => setData('image', e.target.files[0])} className="form-input"/>
                    {errors.image && <div className="form-error">{errors.image}</div>}
                </div>

                <div className="flex justify-end gap-4 form-actions">
                    <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
                    <button type="submit" disabled={processing}
                            className="btn btn-primary">{processing ? 'Saving...' : 'Save'}</button>
                </div>
            </form>
        </Modal>
    );
}
