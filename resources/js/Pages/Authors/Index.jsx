import React, { useEffect, useState, useRef } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Pagination from '@/Components/Pagination';
import AuthorModal from '@/Components/AuthorModal';
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

export default function Index({ authors, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const { data, setData } = useForm({ search: filters.search || '' });
    const debouncedSearch = useDebounce(data.search, 300);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        router.get(route('authors.index'), { search: debouncedSearch }, {
            preserveState: true,
            replace: true
        });
    }, [debouncedSearch]);

    const openEditModal = (author) => { setEditingAuthor(author); setIsModalOpen(true); };
    const openAddModal = () => { setEditingAuthor(null); setIsModalOpen(true); };

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6 page-header">
                <h1 className="text-2xl font-bold">Автори</h1>
                <button onClick={openAddModal} className="btn btn-primary">Add an author</button>
            </div>
            <div className="search-container bg-white rounded-lg shadow-sm">
                <input type="text" value={data.search} onChange={e => setData('search', e.target.value)} placeholder="Search by first name or surname..." className="form-input" autoComplete="off" />
            </div>

            <div className="overflow-x-auto">
                {authors.data.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                        {filters.search ? 'Nothing found for your query. ' : 'No authors have been added yet. Create the first one!'}
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr className="text-left text-gray-500 uppercase">
                            <th className="p-4 text-center"><SortableLink sort_field="last_name" filters={filters} route_name="authors.index">Surname</SortableLink></th>
                            <th className="p-4 text-center"><SortableLink sort_field="first_name" filters={filters} route_name="authors.index">First name</SortableLink></th>
                            <th className="p-4 text-center">Patronymic name</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {authors.data.map(author => (
                            <tr key={author.id} className="border-t">
                                <td className="p-4 text-center">{author.last_name}</td>
                                <td className="p-4 text-center">{author.first_name}</td>
                                <td className="p-4 text-center">{author.patronymic}</td>
                                <td className="p-4 actions-cell">
                                    <button onClick={() => openEditModal(author)} className="btn btn-secondary">Update</button>
                                    <Link href={route('authors.destroy', author.id)} method="post" data={{ _method: 'delete' }} as="button" className="btn btn-danger" onBefore={() => confirm('Are you sure?')}>Delete</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination links={authors.links} />
            <AuthorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} author={editingAuthor} />
        </MainLayout>
    );
}
