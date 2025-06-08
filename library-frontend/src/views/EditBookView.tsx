import { Typography } from '@visa/nova-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddEditBookForm } from '../components/Form';
import { useBooksStore } from '../store/bookstore';
import type { BookInput } from '../types/libraryTypes';

export const EditBookView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const books = useBooksStore((state) => state.books);
  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const updateBook = useBooksStore((state) => state.updateBook);
  const loading = useBooksStore((state) => state.loading);
  const error = useBooksStore((state) => state.error);

  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  const book = books.find((b) => b.id === id) || null;

  useEffect(() => {
    // If book not found, fetch all books
    if (!book && id) {
      fetchBooks()
        .catch(() => setLocalError('Failed to load book data'))
        .finally(() => setLocalLoading(false));
    } else {
      setLocalLoading(false);
    }
  }, [book, id, fetchBooks]);

  // Compose initialData of type BookInput
  const initialData: BookInput | undefined = book
    ? {
      title: book.title,
      author: book.author,
      year: book.year,
      genre: book.genre,
      imageUrl: book.imageUrl,
      description: book.description
    }
    : undefined;

  // Updated to accept FormData instead of BookInput
  const handleEdit = async (formData: FormData) => {
    if (!id) return;
    await updateBook(id, formData);
    navigate('/');
  };

  if (loading || localLoading) return <Typography>Loading book details...</Typography>;
  if (error || localError)
    return (
      <Typography style={{ color: 'red' }}>
        {error || localError || 'Unknown error'}
      </Typography>
    );
  if (!book) return <Typography>No book found</Typography>;
  if (!initialData) return null;

  return (
    <AddEditBookForm
      initialData={initialData}
      onSubmit={handleEdit}
      onCancel={() => navigate('/')}
    />
  );
};