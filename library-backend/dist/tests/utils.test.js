"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('paginate', () => {
    const array = [1, 2, 3, 4, 5];
    it('should return correct page slice', () => {
        expect((0, utils_1.paginate)(array, 1, 2)).toEqual([1, 2]);
        expect((0, utils_1.paginate)(array, 2, 2)).toEqual([3, 4]);
        expect((0, utils_1.paginate)(array, 3, 2)).toEqual([5]);
    });
    it('should return empty array if page out of range', () => {
        expect((0, utils_1.paginate)(array, 10, 2)).toEqual([]);
    });
});
describe('generateFileName', () => {
    it('should return filename with proper extension', () => {
        const filename = (0, utils_1.generateFileName)('image.png');
        expect(filename).toMatch(/^image-\d+-\d+\.png$/);
    });
    it('should generate unique filenames', () => {
        const f1 = (0, utils_1.generateFileName)('file.jpg');
        const f2 = (0, utils_1.generateFileName)('file.jpg');
        expect(f1).not.toEqual(f2);
    });
});
