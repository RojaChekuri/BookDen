"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const db = __importStar(require("../db"));
jest.mock('fs');
describe('readBooks', () => {
    it('should return parsed books from file', () => {
        fs_1.default.readFileSync.mockReturnValue(JSON.stringify([{ id: '1', title: 'Test Book' }]));
        const books = db.readBooks();
        expect(books).toEqual([{ id: '1', title: 'Test Book' }]);
    });
    it('should return empty array on error', () => {
        fs_1.default.readFileSync.mockImplementation(() => { throw new Error('fail'); });
        const books = db.readBooks();
        expect(books).toEqual([]);
    });
});
describe('writeBooks', () => {
    it('should write books to file', () => {
        const mockWrite = jest.spyOn(fs_1.default, 'writeFileSync').mockImplementation(() => { });
        db.writeBooks([{
                id: '1', title: 'Test Book',
                author: 'ffdsf',
                year: 0,
                genre: 'fdsfsd',
                description: 'fdsfsdf',
                imageUrl: 'gfdgd',
                favorite: false
            }]);
        expect(mockWrite).toHaveBeenCalled();
        mockWrite.mockRestore();
    });
    it('should throw error on write failure', () => {
        jest.spyOn(fs_1.default, 'writeFileSync').mockImplementation(() => { throw new Error('fail'); });
        expect(() => db.writeBooks([{
                id: '1', title: 'Test Book',
                author: 'fdsfs',
                year: 0,
                genre: 'fdsfs',
                description: 'gfdgdg',
                imageUrl: 'gfdgd',
                favorite: false
            }])).toThrow('Failed to write books to database.');
    });
});
