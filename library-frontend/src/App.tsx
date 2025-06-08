import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BannerToast } from "./components/BannerToast";
import { NavBar } from "./components/NavBar";
import { useBooksStore } from "./store/bookstore";
import './styles/App.css';
import { AddBookView } from "./views/AddBookView";
import { BookDetailsView } from "./views/BookDetailsView";
import { EditBookView } from "./views/EditBookView";
import { FavoritesView } from "./views/FavoritesView";
import { Home } from "./views/Home";

const App: React.FC = () => {
  const error = useBooksStore((state) => state.error);
  const successMessage = useBooksStore((state) => state.successMessage);
  const setError = useBooksStore((state) => state.setError);
  const setSuccessMessage = useBooksStore((state) => state.setSuccessMessage);

  return (
    <>
      <BrowserRouter>
        <NavBar />
        {error && (
          <BannerToast
            message={error}
            type="error"
            onClose={() => setError(null)}
          />
        )}
        {successMessage && (
          <BannerToast
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage(null)}
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<FavoritesView />} />
          <Route path="/add-book" element={<AddBookView />} />
          <Route path="/books/:id/edit" element={<EditBookView />} />
          <Route path="/books/:id" element={<BookDetailsView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;