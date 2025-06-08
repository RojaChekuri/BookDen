import { ReactNode } from "react";

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  imageUrl?: string;
  description?: string;
  favorite?: boolean;
}

// This is the form data without id (id assigned only on server)
export type BookInput = Omit<Book, 'id'>;

export type BookCardProps = {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  imageUrl: string;
  isFavorite: boolean;                   // NEW prop
  toggleFavorite: (id: string) => void; // NEW prop
  className?: string;
};

export type FloatingTooltipProps = {
  children: ReactNode;         // The element that triggers tooltip (e.g. button)
  content: ReactNode;          // Tooltip content text or node
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offsetDistance?: number;
  id?: string;                 // optional id for aria-describedby
};

export type SearchProps = {
  books: Book[];
  onFilteredBooks: (filtered: Book[]) => void;
};

export type ConfirmDialogProps = {
  id: string;
  title: string;
  description: string;
  open: boolean; // This prop is *ignored* for actual open control - just for render logic
  onConfirm: () => void;
  onCancel: () => void;
};

export type FormProps = {
  initialData?: BookInput;
  onSubmit: (formData: FormData) => void | Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
  loading?: boolean;
};

export type BannerToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export type ErrorBadgeProps = {
    label: string;
};

export interface BooksState {
  books: Book[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  successMessage: string | null;
  hasMore: boolean;
  fetchBooks: (params?: { page?: number; searchTerm?: string; append?: boolean }) => Promise<void>;
  addBook: (formData: FormData) => Promise<void>;
  updateBook: (id: string, formData: FormData) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  markFavorite: (id: string) => Promise<void>;
  unmarkFavorite: (id: string) => Promise<void>;
  toggleFavorite: (id: string, current: boolean) => Promise<void>;
  setError: (msg: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;
}



