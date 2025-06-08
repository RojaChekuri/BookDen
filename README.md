# Book Library Application

A modern, full-stack web application for managing a personal book collection. This project allows users to **browse**, **search**, **manage**, and **favorite** books with rich metadata and cover images.

---

## Features

- **Book Catalog**: View paginated lists of books sorted by latest additions.
- **Search & Filter**: Search books by title, author, genre, or year with flexible filters.
- **Add/Edit Books**: Upload book details including cover images with image resizing and optimization.
- **Favorite Books**: Mark/unmark favorite books for quick access.
- **Responsive UI**: Clean and accessible design optimized for desktop and mobile.
- **Image Handling**: Efficient image caching and serving with support for multiple resolutions.
- **Security**: Implements best practices including Content Security Policy (CSP), HSTS, clickjacking protection, and origin isolation.
- **Robust Backend**: Built with Express.js, using JSON file storage for simplicity and fast prototyping.

---

## Technologies Used

- **Frontend:** React, TypeScript, Nova React UI components
- **Backend:** Node.js, Express, Multer (file uploads), Sharp (image processing)
- **Caching:** In-memory caching for image assets (NodeCache)
- **Security:** CSP, HSTS, COOP, X-Frame-Options headers
- **Others:** ESLint, Prettier, Git for version control

---

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- npm or yarn

### Installation

git clone https://github.com/yourusername/book-library.git
cd book-library
npm install

### Installation

# Start backend server
cd library-backend
npm run dev

# Start frontend app (in new terminal)
cd ../library-frontend
npm start

Backend runs on http://localhost:4000
Frontend runs on http://localhost:3000

# Future Improvements
Implement user authentication and personalized libraries
Migrate to a database for scalability (e.g., MongoDB or PostgreSQL)
Add advanced filtering and sorting options
Enhance image delivery with CDN and automatic resizing
Add unit and integration tests for backend and frontend

# License
MIT License © [Roja Chekuri]
