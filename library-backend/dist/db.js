"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readBooks = readBooks;
exports.writeBooks = writeBooks;
const fs_1 = __importDefault(require("fs"));
const DB_FILE = './db.json';
function readBooks() {
    try {
        const data = fs_1.default.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    }
    catch (_a) {
        return [];
    }
}
function writeBooks(books) {
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(books, null, 2));
}
