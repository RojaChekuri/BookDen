import React, { useState, useEffect, useCallback } from "react";
import BookCard from "../components/Card";
import { useBooksStore } from "../store/bookstore";
import { Search } from "../components/Search";
import { Book } from "../types/libraryTypes";
import { VisaArrowUpLow } from '@visa/nova-icons-react';
import { ProgressCircular } from "@visa/nova-react";
import { BACKEND_URL, PLACEHOLDER_IMAGE } from "../constants";



export const Home = () => {
  const { books, loading, loadingMore, error, hasMore, fetchBooks, toggleFavorite } = useBooksStore();
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Fetch books initially and on search/filter changes handled in HeroSearchSort
  useEffect(() => {
    fetchBooks({ page: 1, searchTerm: "", append: false });
  }, [fetchBooks]);

  // Update filteredBooks when books update
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Infinite scroll load more
  const loadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    const nextPage = page + 1;
    fetchBooks({ page: nextPage, searchTerm: "", append: true });
    setPage(nextPage);
  }, [loadingMore, loading, hasMore, page, fetchBooks]);

  // Scroll listener for infinite loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY + 300 >=
        document.documentElement.scrollHeight
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <>
      <Search books={books} onFilteredBooks={setFilteredBooks} />

      <main className="home-main">
        {error && <p className="home-error">{error}</p>}

        <div className="home-books-grid">
          {filteredBooks.map((book: Book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              year={book.year}
              genre={book.genre}
              imageUrl={book.imageUrl ? `${BACKEND_URL}${book.imageUrl}` : PLACEHOLDER_IMAGE}
              isFavorite={book.favorite || false}
              toggleFavorite={() => toggleFavorite(book.id, book.favorite || false)}
            />
          ))}
        </div>

        {(loading || loadingMore) && (
          <div
            className="home-loading"
            aria-live="polite"
            aria-busy="true"
          >
            <ProgressCircular
                className="v-flex-grow upload-progress"
                indeterminate
                progressSize="small"
                aria-label="Loading"
              />
          </div>
        )}

        {!hasMore && !loading && (
          <p className="home-no-more">
            No more books to load.
          </p>
        )}
      </main>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="back-to-top-button"
        >
          <VisaArrowUpLow />
          Back to top
        </button>
      )}
    </>
  );
};