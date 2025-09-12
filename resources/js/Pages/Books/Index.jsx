import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Pagination from '@/Components/Pagination';
import BookModal from '@/Components/BookModal';
import { useForm } from '@inertiajs/react';
import useDebounce from '@/Hooks/useDebounce';

export default function Index({ books, authorsList, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const debouncedSearch = useDebounce(data.search, 500)

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            router.get(route('books.index'), { search: debouncedSearch }, {
                preserveState: true,
                replace: true,
            });
        }
    }, [debouncedSearch]);


    const openEditModal = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6 page-header">
                <h1 className="text-2xl font-bold">Книги</h1>
                <button onClick={openAddModal} className="btn btn-primary">Додати книгу</button>
            </div>

            <div className="search-container bg-white rounded-lg shadow-sm">
                <input
                    type="text"
                    value={data.search}
                    onChange={e => setData('search', e.target.value)}
                    placeholder="Пошук за назвою або прізвищем автора..."
                    className="form-input"
                    autoComplete="off"
                />
            </div>

            <div className="overflow-x-auto">
                <table>
                    <thead>
                    <tr>
                        <th>Зображення</th>
                        <th>Назва</th>
                        <th>Автори</th>
                        <th>Дата публікації</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {books.data.map(book => (
                        <tr key={book.id}>
                            <td className="image-cell">
                                {book.image ? <img src={`/storage/${book.image}`} alt={book.title} className="book-image" /> : 'Немає'}
                            </td>
                            <td>{book.title}</td>
                            <td>
                                {book.authors.map(author => `${author.first_name} ${author.last_name}`).join(', ')}
                            </td>
                            <td>{book.publication_date}</td>
                            <td className="actions-cell">
                                <button onClick={() => openEditModal(book)} className="btn btn-secondary">Редагувати
                                </button>
                                <Link href={route('books.destroy', book.id)} method="post" as="button"
                                      data={{_method: 'delete'}} className="btn btn-danger"
                                      onBefore={() => confirm('Ви впевнені?')}>Видалити</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={books.links} />
            <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={editingBook} authorsList={authorsList} />
        </MainLayout>
    );
}
