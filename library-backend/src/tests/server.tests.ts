// tests/server.test.ts
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import app from '..';

const DB_PATH = path.resolve(__dirname, '../db.json');

describe('Books API', () => {
  let createdBookId: string;

  // Clean up DB before each test if needed (optional)
  beforeEach(() => {
    const initialData = [
      {
        id: '1',
        title: 'Test Book',
        author: 'Test Author',
        year: 2020,
        genre: 'Adventure',
        description: 'Test description',
        imageUrl: '',
        favorite: false,
        timestamp: new Date().toISOString(),
      },
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  });

  // Scenario 1: CRUD operations for books

  it('GET /books should return list of books (paginated)', async () => {
    const res = await request(app).get('/books?page=1&limit=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('title');
  });

  it('POST /books should create a new book', async () => {
    const newBook = {
      title: 'New Book',
      author: 'New Author',
      year: 2021,
      genre: 'Horror',
      description: 'New description',
    };
    const res = await request(app).post('/books').field(newBook);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newBook.title);
    createdBookId = res.body.id;
  });

  it('POST /books should fail with missing required fields', async () => {
    const res = await request(app).post('/books').send({ title: 'Incomplete' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('PUT /books/:id should update an existing book', async () => {
    // First create a book to update
    const bookRes = await request(app).post('/books').field({
      title: 'To Update',
      author: 'Author',
      year: 2019,
      genre: 'Sci-fi',
      description: 'Desc',
    });
    const id = bookRes.body.id;

    const updatedData = {
      title: 'Updated Title',
      author: 'Updated Author',
      year: 2022,
      genre: 'Sci-fi',
      description: 'Updated Desc',
    };

    const res = await request(app).put(`/books/${id}`).field(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedData.title);
  });

  it('PUT /books/:id should return 404 for non-existent book', async () => {
    const res = await request(app).put('/books/999').field({
      title: 'Does Not Exist',
      author: 'Nobody',
      year: 2020,
      genre: 'None',
      description: '',
    });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /books/:id should delete the book', async () => {
    // Create a book to delete
    const bookRes = await request(app).post('/books').field({
      title: 'To Delete',
      author: 'Author',
      year: 2018,
      genre: 'Mystery',
      description: 'Desc',
    });
    const id = bookRes.body.id;

    const res = await request(app).delete(`/books/${id}`);
    expect(res.status).toBe(204);

    // Verify deletion
    const getRes = await request(app).get('/books');
    expect(getRes.body.find((b: any) => b.id === id)).toBeUndefined();
  });

  it('DELETE /books/:id should return 404 for non-existent book', async () => {
    const res = await request(app).delete('/books/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // Scenario 2: Favorite marking endpoints

  it('POST /books/:id/favorite should mark a book as favorite', async () => {
    const bookRes = await request(app).post('/books').field({
      title: 'Favorite Book',
      author: 'Author',
      year: 2020,
      genre: 'Drama',
      description: 'Desc',
    });
    const id = bookRes.body.id;

    const res = await request(app).post(`/books/${id}/favorite`);
    expect(res.status).toBe(200);
    expect(res.body.book.favorite).toBe(true);
  });

  it('DELETE /books/:id/favorite should unmark a book as favorite', async () => {
    const bookRes = await request(app).post('/books').field({
      title: 'Favorite Book 2',
      author: 'Author',
      year: 2020,
      genre: 'Drama',
      description: 'Desc',
    });
    const id = bookRes.body.id;

    await request(app).post(`/books/${id}/favorite`);
    const res = await request(app).delete(`/books/${id}/favorite`);
    expect(res.status).toBe(204);

    // Verify favorite is false
    const allBooks = await request(app).get('/books');
    const book = allBooks.body.find((b: any) => b.id === id);
    expect(book.favorite).toBe(false);
  });

  it('POST /books/:id/favorite should return 404 for non-existent book', async () => {
    const res = await request(app).post('/books/999/favorite');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /books/:id/favorite should return 404 for non-existent book', async () => {
    const res = await request(app).delete('/books/999/favorite');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});



// Helper to reset DB before each test
const initialBooks = [
  {
    id: '1',
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: 'J.K. Rowling',
    year: 1999,
    genre: 'Fantasy',
    description: 'A magical adventure.',
    imageUrl: '',
    favorite: false,
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    year: 1937,
    genre: 'Fantasy',
    description: 'A classic tale.',
    imageUrl: '',
    favorite: true,
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Adventures in Wonderland',
    author: 'Lewis Carroll',
    year: 1865,
    genre: 'Adventure',
    description: 'A whimsical story.',
    imageUrl: '',
    favorite: false,
    timestamp: new Date().toISOString(),
  },
];

beforeEach(() => {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialBooks, null, 2));
});

describe('GET /books/search', () => {
  it('should filter books by title', async () => {
    const res = await request(app).get('/books/search').query({ title: 'hobbit' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('The Hobbit');
  });

  it('should filter books by author', async () => {
    const res = await request(app).get('/books/search').query({ author: 'rowling' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].author).toBe('J.K. Rowling');
  });

  it('should filter books by genre', async () => {
    const res = await request(app).get('/books/search').query({ genre: 'fantasy' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(15);
    res.body.forEach((book: any) => {
      expect(book.genre.toLowerCase()).toBe('fantasy');
    });
  });

  it('should filter books by year', async () => {
    const res = await request(app).get('/books/search').query({ year: '1999' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].year).toBe(1999);
  });

  it('should return empty array if no match', async () => {
    const res = await request(app).get('/books/search').query({ title: 'nonexistent' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe('Pagination edge cases on GET /books', () => {
  it('should return empty array for page out of range', async () => {
    // Assuming initialBooks.length < 100
    const res = await request(app).get('/books').query({ page: 100, limit: 10 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  
  it('should return correct subset of books for page and limit', async () => {
    // Insert a bunch of books for this test
    const manyBooks = Array.from({ length: 30 }, (_, i) => ({
      id: (100 + i).toString(),
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`,
      year: 2000 + i,
      genre: i % 2 === 0 ? 'Fantasy' : 'Adventure',
      description: '',
      imageUrl: '',
      favorite: false,
      timestamp: new Date().toISOString(),
    }));
    fs.writeFileSync(DB_PATH, JSON.stringify([...initialBooks, ...manyBooks], null, 2));

    const res = await request(app).get('/books').query({ page: 2, limit: 20 });
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(20); // second page, 20 items per page

    // The first book on page 2 should be the 21st book in sorted order
    // Since books are sorted by timestamp descending, newest first, you may need to adjust if needed.
  });

  it('should default to page=1 and limit=20 if invalid values provided', async () => {
    const res = await request(app).get('/books').query({ page: 'abc', limit: 'def' });
    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(20);
  });
});

