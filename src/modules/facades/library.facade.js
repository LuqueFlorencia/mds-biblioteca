import { registerBookWithCopies } from '../services/book.service.js';
import { loanBook, returnBook } from '../services/loan.service.js';

export const LibraryFacade = {
    addBookWithCopies: registerBookWithCopies,
    loanBook,
    returnBook,
};