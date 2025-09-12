<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Models\Author;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::with('authors')
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('authors', function ($q) use ($search) {
                        $q->where('last_name', 'like', "%{$search}%");
                    });
            })
            ->orderBy($request->input('sort', 'title'), $request->input('direction', 'asc'))
            ->paginate(15)
            ->withQueryString();



        return Inertia::render('Books/Index', [
            'books' => $books,
            'authorsList' => Author::orderBy('last_name')->get(),
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    public function store(StoreBookRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('book_images', 'public');
        }

        $book = Book::create($validated);
        $book->authors()->sync($request->input('authors'));

        return redirect()->route('books.index')->with('success', 'Книгу успішно додано.');
    }

    public function update(UpdateBookRequest $request, Book $book)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($book->image) {
                Storage::disk('public')->delete($book->image);
            }
            $data['image'] = $request->file('image')->store('book_images', 'public');
        } else {
            unset($data['image']);
        }

        $book->update($data);

        $book->authors()->sync($request->input('authors'));

        return redirect()->route('books.index')->with('success', 'Дані книги оновлено.');
    }

    public function destroy(Book $book)
    {
        if ($book->image) {
            Storage::disk('public')->delete($book->image);
        }
        $book->delete();
        return redirect()->route('books.index')->with('success', 'Книгу видалено.');
    }
}
