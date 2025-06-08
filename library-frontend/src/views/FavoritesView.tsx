import React from "react";
import { Typography } from "@visa/nova-react";
import BookCard from "../components/Card";
import { useBooksStore } from "../store/bookstore";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x200?text=Book+Cover";

export const FavoritesView: React.FC = () => {
  const { books, loading, error, toggleFavorite } = useBooksStore();

  // Filter books that have favorite === true
  const favoriteBooks = books.filter((b) => b.favorite === true);

  return (
    <div className="favorites-container">
      <h1 className="favorites-heading">Favorites</h1>

      {error && (
        <Typography className="favorites-error" role="alert">
          {error}
        </Typography>
      )}

      {favoriteBooks.length === 0 && (
        <Typography className="favorites-empty">
          No favorite books yet.
        </Typography>
      )}

      <div className="favorites-grid">
        {favoriteBooks.map((b) => (
          <BookCard
            key={b.id}
            id={b.id}
            title={b.title}
            author={b.author}
            year={b.year}
            genre={b.genre}
            imageUrl={b.imageUrl || PLACEHOLDER_IMAGE}
            isFavorite={true}
            toggleFavorite={() => toggleFavorite(b.id, true)}
          />
        ))}
      </div>

      {loading && (
        <div
          className="favorites-loading"
          aria-live="polite"
          aria-busy="true"
        >
          Loading...
        </div>
      )}
    </div>
  );
};