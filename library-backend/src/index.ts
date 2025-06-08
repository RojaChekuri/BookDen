import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sharp from 'sharp';
import NodeCache from 'node-cache';  // new import
import { Book } from './types';

const app = express();
const PORT = 4000;
const DB_PATH = path.resolve(__dirname, '../db.json');
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

app.use(cors());
// Security headers middleware
app.use((req, res, next) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "font-src 'self' https:; " +
    "frame-ancestors 'none';" // Mitigates clickjacking
  );

  // HTTP Strict Transport Security (HSTS) - 2 years, include subdomains, preload enabled
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Cross-Origin-Opener-Policy (COOP) to isolate browsing context
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // X-Frame-Options to mitigate clickjacking (fallback for older browsers)
  res.setHeader('X-Frame-Options', 'DENY');

  next();
});
app.use(express.json());

// Remove the static middleware for /uploads and replace with custom cached route below
// app.use(
//   '/uploads',
//   express.static(UPLOADS_DIR, {
//     maxAge: '30d',
//     etag: true,
//     lastModified: true,
//   })
// );

// In-memory cache for images, 1 hour TTL (adjust as needed)
const imageCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

app.get('/uploads/:imageName', async (req: Request, res: Response) => {
  const { imageName } = req.params;

  // Try to get image from cache
  let imageBuffer = imageCache.get<Buffer>(imageName);

  if (!imageBuffer) {
    try {
      const imagePath = path.join(UPLOADS_DIR, imageName);
      imageBuffer = await fs.promises.readFile(imagePath);
      imageCache.set(imageName, imageBuffer);
      console.log(`Loaded ${imageName} from disk and cached.`);
    } catch (err) {
      console.error(`Image not found: ${imageName}`, err);
      res.status(404).send('Image not found');
      return 
    }
  } else {
    //console.log(`Served ${imageName} from cache.`);
  }

  // Set correct content type based on extension
  res.setHeader('Content-Type', getMimeType(imageName));

  // Set cache headers for browser
  res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days

  res.send(imageBuffer);
});

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (/image\/(jpeg|png|gif)/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and GIF images are allowed'));
    }
  },
});

function readBooks(): Book[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data) as Book[];
  } catch (error) {
    console.error('Error reading books:', error);
    throw new Error('Failed to read books from database.');
  }
}

function writeBooks(books: Book[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error writing books:', error);
    throw new Error('Failed to write books to database.');
  }
}

function paginate<T>(array: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return array.slice(start, start + limit);
}

// Async wrapper to catch errors and forward to Express error middleware
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get(
  '/books',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(String(req.query.page)) || 1;
    const limit = parseInt(String(req.query.limit)) || 20;

    let books = readBooks();

    // Sort by timestamp descending (latest first)
    books = books.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    console.log('Sorted books by timestamp descending.');

    const paginatedBooks = paginate(books, page, limit);

    res.json(paginatedBooks);
  })
);

app.get('/books/search', asyncHandler(async (req: { query: { page?: any; limit?: any; title?: any; author?: any; genre?: any; year?: any; }; }, res: { json: (arg0: Book[]) => void; }) => {
  const { title, author, genre, year } = req.query;
  const page = parseInt(String(req.query.page)) || 1;
  const limit = parseInt(String(req.query.limit)) || 20;
  let books = readBooks();

  if (title) {
    books = books.filter((b) => b.title.toLowerCase().includes(String(title).toLowerCase()));
  }
  if (author) {
    books = books.filter((b) => b.author.toLowerCase().includes(String(author).toLowerCase()));
  }
  if (genre) {
    books = books.filter((b) => b.genre.toLowerCase() === String(genre).toLowerCase());
  }
  if (year) {
    books = books.filter((b) => String(b.year) === String(year));
  }

  // Sort filtered books by timestamp descending
  books = books.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const paginatedBooks = paginate(books, page, limit);
  res.json(paginatedBooks);
}));

app.post(
  '/books',
  upload.single('image'),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, author, year, genre, description } = req.body;
    if (!title || !author || !year || !genre) {
      res.status(400).json({ error: 'Missing required fields: title, author, year, genre' });
      return;
    }

    let imageUrl: string | undefined;

    if (req.file) {
      const filename = generateFileName(req.file.originalname);
      const filepath = path.join(UPLOADS_DIR, filename);

      await sharp(req.file.buffer)
        .resize({ width: 1024, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(filepath);

      imageUrl = `/uploads/${filename}`;
    }

    const books = readBooks();
    const newId = books.length ? (Math.max(...books.map((b) => +b.id)) + 1).toString() : '1';

    const newBook: Book = {
      id: newId,
      title,
      author,
      year: Number(year),
      genre,
      description,
      imageUrl,
      favorite: false,
      timestamp: new Date().toISOString(),
    };

    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
  })
);

app.put(
  '/books/:id',
  upload.single('image'),
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const { title, author, year, genre, description, favorite } = req.body;
    const books = readBooks();
    const index = books.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    if (!title || !author || !year || !genre) {
      res.status(400).json({ error: 'Missing required fields: title, author, year, genre' });
      return;
    }

    let imageUrl = books[index].imageUrl;

    if (req.file) {
      const filename = generateFileName(req.file.originalname);
      const filepath = path.join(UPLOADS_DIR, filename);

      await sharp(req.file.buffer)
        .resize({ width: 1024, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(filepath);

      imageUrl = `/uploads/${filename}`;
    }

    books[index] = {
      id: books[index].id,
      title,
      author,
      year: Number(year),
      genre,
      description,
      imageUrl,
      favorite: typeof favorite === 'boolean' ? favorite : books[index].favorite,
      timestamp: new Date().toISOString(),
    };


    writeBooks(books);
    res.json(books[index]);
  })
);

app.delete(
  '/books/:id',
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const books = readBooks();
    const index = books.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    books.splice(index, 1);
    writeBooks(books);
    res.status(204).end();
  })
);

app.get(
  '/books/favorites',
  asyncHandler(async (_req: any, res: { json: (arg0: Book[]) => void; }) => {
    const books = readBooks();
    const favorites = books.filter((b) => b.favorite === true);
    res.json(favorites);
  })
);

app.post(
  '/books/:id/favorite',
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const books = readBooks();
    const index = books.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    books[index].favorite = true;
    writeBooks(books);
    res.json({ message: `Book ${req.params.id} marked as favorite.`, book: books[index] });
  })
);

app.delete(
  '/books/:id/favorite',
  asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const books = readBooks();
    const index = books.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    books[index].favorite = false;
    writeBooks(books);
    res.status(204).end();
  })
);

function generateFileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const uniquePart = Date.now() + '-' + Math.round(Math.random() * 1e9);
  return `image-${uniquePart}${ext}`;
}

// Global error handler middleware (must be last middleware)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return;
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});