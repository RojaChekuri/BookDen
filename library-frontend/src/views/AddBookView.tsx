import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEditBookForm } from '../components/Form';
import { useBooksStore } from '../store/bookstore';

export const AddBookView: React.FC = () => {
  const navigate = useNavigate();

  const addBook = useBooksStore((state) => state.addBook);

  const handleAdd = async (formData: FormData) => {
    await addBook(formData);
    navigate('/');
  };

  return (
    <>
      <AddEditBookForm
        initialData={undefined}
        onSubmit={handleAdd}
        onCancel={() => navigate('/')}
      />
    </>
  );
};

