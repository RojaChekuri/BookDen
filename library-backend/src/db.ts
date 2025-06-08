import fs from 'fs';
import { Book } from './types';

const DB_FILE = './db.json';

export function readBooks(): Book[] {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeBooks(books: Book[]): void {
  fs.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));
}