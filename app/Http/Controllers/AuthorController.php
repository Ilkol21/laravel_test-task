<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAuthorRequest;
use App\Http\Requests\UpdateAuthorRequest;
use App\Models\Author;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $authors = Author::query()
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('last_name', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%");
                });
            })
            ->orderBy($request->input('sort', 'last_name'), $request->input('direction', 'asc'))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Authors/Index', [
            'authors' => $authors,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    public function store(StoreAuthorRequest $request)
    {
        Author::create($request->validated());
        return redirect()->route('authors.index')->with('success', 'Author successfully added.');
    }

    public function update(UpdateAuthorRequest $request, Author $author)
    {
        $author->update($request->validated());
        return redirect()->route('authors.index')->with('success', 'Author details updated.');
    }



    public function destroy(Author $author)
    {
        $author->delete();
        return redirect()->route('authors.index')->with('success', 'Автора видалено.');
    }
}
