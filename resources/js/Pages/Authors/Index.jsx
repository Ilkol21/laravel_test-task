import React, {useEffect, useState} from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Pagination from '@/Components/Pagination';
import AuthorModal from '@/Components/AuthorModal';
import { useForm } from '@inertiajs/react';
import useDebounce from '@/Hooks/useDebounce';

export default function Index({ authors, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);

    const { data, setData } = useForm({
        search: filters.search || '',
        sort: filters.sort || 'last_name',
        direction: filters.direction || 'asc',
    });

    const debouncedSearch = useDebounce(data.search, 500)

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            router.get(route('authors.index'), { search: debouncedSearch }, {
                preserveState: true,
                replace: true,
            });
        }
    }, [debouncedSearch]);

    const openEditModal = (author) => {
        setEditingAuthor(author);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingAuthor(null);
        setIsModalOpen(true);
    };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6 page-header">
                <h1 className="text-2xl font-bold">Автори</h1>
                <button onClick={openAddModal} className="btn btn-primary">Додати автора</button>
            </div>

            <div className="search-container bg-white rounded-lg shadow-sm">
                <input
                    type="text"
                    value={data.search}
                    onChange={e => setData('search', e.target.value)}
                    placeholder="Пошук за ім'ям або прізвищем..."
                    className="form-input"
                    autoComplete="off"
                />
            </div>

            <div className="overflow-x-auto">
                <table>
                    <thead>
                    <tr>
                        <th>Прізвище</th>
                        <th>Ім'я</th>
                        <th>По-батькові</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {authors.data.map(author => (
                        <tr key={author.id}>
                            <td>{author.last_name}</td>
                            <td>{author.first_name}</td>
                            <td>{author.patronymic}</td>
                            <td className="actions-cell">
                                <button onClick={() => openEditModal(author)} className="btn btn-secondary">Редагувати
                                </button>
                                <Link href={route('authors.destroy', author.id)} method="post"
                                      data={{_method: 'delete'}} as="button" className="btn btn-danger"
                                      onBefore={() => confirm('Ви впевнені?')}>Видалити</Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination links={authors.links} />
            <AuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} author={editingAuthor} />
        </MainLayout>
    );
}
