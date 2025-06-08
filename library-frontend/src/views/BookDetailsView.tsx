import {
  Button,
  ContentCard,
  ProgressCircular,
  Surface,
  Typography,
  Utility,
} from '@visa/nova-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/Dialog';
import { useBooksStore } from '../store/bookstore';

import {
  VisaFavoriteStarFillTiny,
  VisaFavoriteStarOutlineTiny,
} from '@visa/nova-icons-react';
import FloatingTooltip from '../components/ToolTip';

export const BookDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const books = useBooksStore((state) => state.books);
  const fetchBooks = useBooksStore((state) => state.fetchBooks);
  const loading = useBooksStore((state) => state.loading);
  const error = useBooksStore((state) => state.error);
  const deleteBook = useBooksStore((state) => state.deleteBook);
  const toggleFavorite = useBooksStore((state) => state.toggleFavorite);

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const book = books.find((b) => b.id === id) ?? null;

  useEffect(() => {
    if (!book && id) {
      setLocalLoading(true);
      fetchBooks()
        .catch(() => setLocalError('Failed to load book details'))
        .finally(() => setLocalLoading(false));
    }
  }, [book, id, fetchBooks]);

  const handleEdit = () => navigate(`/books/${book?.id}/edit`);

  const openDeleteModal = () => setShowDeleteModal(true);
  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      if (book) {
        await deleteBook(book.id);
        setShowDeleteModal(false);
        navigate('/');
      }
    } catch {
      alert('Failed to delete book.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!book) return;
    setFavoriteLoading(true);
    try {
      await toggleFavorite(book.id, book.favorite || false);
    } catch {
      alert('Failed to update favorite status.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading || localLoading)
    return (
      <Utility vFlex vAlignItems="center" vJustifyContent="center" className="loading-center">
        <Typography variant="body-1">Loading book details...</Typography>
      </Utility>
    );

  if (error || localError)
    return (
      <Utility vFlex vAlignItems="center" vJustifyContent="center" className="loading-center">
        <Typography variant="body-1" color="error">
          {error ?? localError}
        </Typography>
      </Utility>
    );

  if (!book)
    return (
      <Utility vFlex vAlignItems="center" vJustifyContent="center" className="loading-center">
        <Typography variant="body-1">Book not found</Typography>
      </Utility>
    );

  return (
    <Utility
      vFlex
      vFlexCol
      vAlignItems="center"
      vJustifyContent="center"
      className="book-details-wrapper"
    >
      <Surface elevation="medium" className="book-details-surface">
        <Typography variant="headline-2" as="h1" className="book-title">
          {book.title}

          <FloatingTooltip
            content={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
            placement="top"
            offsetDistance={4}
          >
            <span
              onClick={handleToggleFavorite}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggleFavorite();
                }
              }}
              className="book-title-favorite"
              aria-label={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteLoading ? (
                <ProgressCircular
                  indeterminate
                  progressSize="small"
                  aria-label="Updating favorite status"
                  className="loading-progress"
                />
              ) : book.favorite ? (
                <VisaFavoriteStarFillTiny style={{ color: '#FFD700' }} />
              ) : (
                <VisaFavoriteStarOutlineTiny style={{ color: '#888' }} />
              )}
            </span>
          </FloatingTooltip>
        </Typography>

        {book.imageUrl && (
          <ContentCard className="book-image-card">
            <img
              src={book.imageUrl}
              alt={`Cover of ${book.title}`}
              draggable={false}
            />
          </ContentCard>
        )}

        <Utility vFlex vFlexCol vGap={6}>
          <section className="book-section">
            <Typography variant="headline-4" as="h2" >
              Author
            </Typography>
            <Typography variant="body-1">{book.author}</Typography>
          </section>

          <section className="book-section">
            <Typography variant="headline-4" as="h2" >
              Year Published
            </Typography>
            <Typography variant="body-1">{book.year}</Typography>
          </section>

          <section className="book-section">
            <Typography variant="headline-4" as="h2" >
              Genre
            </Typography>
            <Typography variant="body-1">{book.genre}</Typography>
          </section>

          {book.description && (
            <section className="book-section">
              <Typography variant="headline-4" as="h2" >
                Description
              </Typography>
              <Typography variant="body-1" className="book-description">
                {book.description}
              </Typography>
            </section>
          )}
        </Utility>

        <Utility vFlex vFlexRow vGap={16} className="book-actions">
          <Button onClick={handleEdit} aria-label="Edit book" type="button">
            Edit
          </Button>

          <Button
            colorScheme="secondary"
            destructive
            onClick={openDeleteModal}
            aria-label="Delete book"
            disabled={deleteLoading}
            type="button"
          >
            Delete
          </Button>
        </Utility>
      </Surface>

      <ConfirmDialog
        id="delete-dialog"
        open={showDeleteModal}
        title="Confirm Delete"
        description="Are you sure you want to delete this book? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </Utility>
  );
};