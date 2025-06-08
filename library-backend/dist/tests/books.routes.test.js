"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
require("../index"); // your Express app
describe('GET /books', () => {
    it('returns paginated books', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(index).get('/books?page=1&limit=2');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
});
describe('GET /books/search', () => {
    it('filters by title', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/books/search?title=great');
        expect(res.status).toBe(200);
        res.body.forEach((book) => expect(book.title.toLowerCase()).toContain('great'));
    }));
});
describe('POST /books', () => {
    it('creates a new book', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/books')
            .field('title', 'New Book')
            .field('author', 'Author')
            .field('year', '2023')
            .field('genre', 'Novel');
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('New Book');
    }));
    it('returns 400 if missing fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post('/books')
            .field('title', '')
            .field('author', '')
            .field('year', '')
            .field('genre', '');
        expect(res.status).toBe(400);
    }));
});
describe('PUT /books/:id', () => {
    it('updates existing book', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .put('/books/1')
            .field('title', 'Updated Book')
            .field('author', 'Author')
            .field('year', '2023')
            .field('genre', 'Novel');
        expect([200, 404]).toContain(res.status); // 404 if not found
        if (res.status === 200)
            expect(res.body.title).toBe('Updated Book');
    }));
});
describe('DELETE /books/:id', () => {
    it('deletes a book', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).delete('/books/1');
        expect([204, 404]).toContain(res.status);
    }));
});
