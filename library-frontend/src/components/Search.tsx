import React, { useState, useMemo, useRef } from "react";
import {
  Input,
  InputContainer,
  InputControl,
  Typography,
  Utility,
} from "@visa/nova-react";
import { VisaSearchLow, VisaCloseTiny } from "@visa/nova-icons-react";
import { SearchProps } from "../types/libraryTypes";

export const Search: React.FC<SearchProps> = ({
  books,
  onFilteredBooks,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return books.filter((b) =>
      [b.title, b.author, b.genre, b.year.toString()].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }, [books, searchTerm]);

  React.useEffect(() => {
    onFilteredBooks(filteredBooks);
  }, [filteredBooks, onFilteredBooks]);

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <section className="hero-section" aria-label="Library hero with welcome message and search">
      <div className="hero-overlay" />

      <Utility
        vFlex
        vFlexCol
        vAlignItems="center"
        vGap={24}
        vMarginHorizontal="auto"
        className="hero-content"
      >
        <Typography variant="headline-1" className="hero-title">
          Welcome to The Book Den
        </Typography>

        <Typography className="hero-subtitle">
          Dive into a world of knowledge with easy search, favorites management,
          book additions, and news — your one-stop hub for everything bookish.
        </Typography>

        <InputContainer className="search-input-container">
          <InputControl>
            <VisaSearchLow aria-hidden="true" />
          </InputControl>

          <Input
            ref={inputRef}
            type="search"
            placeholder="Search by title, author, genre, year..."
            aria-label="Search books"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            className="search-input"
          />

          {searchTerm && (
            <InputControl
              as="button"
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="clear-button"
            >
              <VisaCloseTiny aria-hidden="true" />
            </InputControl>
          )}
        </InputContainer>
      </Utility>
    </section>
  );
};