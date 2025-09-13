import React, { useState, useEffect, useRef } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Pagination from '@/Components/Pagination';
import BookModal from '@/Components/BookModal';
import useDebounce from '@/Hooks/useDebounce';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const SortableLink = ({ sort_field, filters, children, route_name }) => {
    const isSorted = filters.sort === sort_field;
    const direction = isSorted ? (filters.direction === 'asc' ? 'desc' : 'asc') : 'asc';
    const queryParams = { ...filters, sort: sort_field, direction };

    return (
        <Link href={route(route_name, queryParams)} className="flex items-center gap-1 hover:text-gray-500">
            {children}
            {isSorted && (filters.direction === 'asc' ? <ChevronUpIcon className="sort-icon" /> : <ChevronDownIcon className="sort-icon" />)}
        </Link>
    );
};

export default function Index({ books, authorsList, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const { data, setData } = useForm({ search: filters.search || '' });
    const debouncedSearch = useDebounce(data.search, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        router.get(route('books.index'), { search: debouncedSearch }, {
            preserveState: true,
            replace: true,
        });
    }, [debouncedSearch]);

    const openEditModal = (book) => { setEditingBook(book); setIsModalOpen(true); };
    const openAddModal = () => { setEditingBook(null); setIsModalOpen(true); };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6 page-header">
                <h1 className="text-2xl font-bold">Books</h1>
                <button onClick={openAddModal} className="btn btn-primary">Add a book</button>
            </div>
            <div className="search-container bg-white rounded-lg shadow-sm">
                <input type="text" value={data.search} onChange={e => setData('search', e.target.value)} placeholder="Search by title or author's surname..." className="form-input" autoComplete="off" />
            </div>
            <div className="overflow-x-auto">
                {books.data.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                        {filters.search ? 'Nothing found for your query. ' : 'No books have been added yet. Create the first one!'}
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr className="text-left text-gray-500 uppercase">
                            <th className="p-4">Image</th>
                            <th className="p-4"><SortableLink sort_field="title" filters={filters} route_name="books.index">Name</SortableLink></th>
                            <th className="p-4">Authors</th>
                            <th className="p-4"><SortableLink sort_field="publication_date" filters={filters} route_name="books.index">Date of publication</SortableLink></th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {books.data.map(book => (
                            <tr key={book.id} className="border-t">
                                <td className="p-4 image-cell">{book.image ? <img src={`/storage/${book.image}`} alt={book.title} className="book-image" /> : 'None'}</td>
                                <td className="p-4">{book.title}</td>
                                <td className="p-4">{book.authors.map(author => `${author.first_name} ${author.last_name}`).join(', ')}</td>
                                <td className="p-4">{book.publication_date}</td>
                                <td className="p-4 actions-cell">
                                    <button onClick={() => openEditModal(book)} className="btn btn-secondary">Update</button>
                                    <Link href={route('books.destroy', book.id)} method="post" as="button" data={{ _method: 'delete' }} className="btn btn-danger" onBefore={() => confirm('Are you sure?')}>Delete</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Pagination links={books.links} />
            <BookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} book={editingBook} authorsList={authorsList} />
        </MainLayout>
    );
}
