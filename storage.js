import { finishedBooks, unfinishedBooks } from './data.js';

const STORAGE_KEY = 'books';

class Book {
  /**
   * Constructor class book
   * @param {number} id
   * @param {string} title
   * @param {string} author
   * @param {number} year
   * @param {boolean} isComplete
   */
  constructor(id, title, author, year, isComplete) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.year = year;
    this.isComplete = isComplete;
  }
}

/**
 * Fungsi yang digunakan untuk pre-populate data
 */
const prepopulateDataOnFirstLoad = () => {
  if (!localStorage) return;
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...finishedBooks, ...unfinishedBooks])
    );
  }
};

/**
 * Fungsi yang digunakan untuk menambahkan book ke storage books
 * @param {Book} book
 * @returns {boolean}
 */
const addBookToStorage = (book) => {
  if (!localStorage) return false;
  const books = getBooksFromStorage();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...books, book]));
  return true;
};

/**
 * Fungsi untuk mengubah book yang ada di storage
 * @param {Book} newBook
 * @returns {boolean}
 */
const updateBookInStorage = (newBook) => {
  if (!localStorage) return false;
  const books = getBooksFromStorage();
  const oldBookIndex = books.findIndex((item) => item.id === newBook.id);
  if (oldBookIndex === -1) return false;
  books[oldBookIndex] = newBook;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  return true;
};

/**
 * Fungsi digunakan untuk menghapus buku berdasarkan id
 * @param {number} bookId
 * @returns {boolean}
 */
const deleteBookFromStorage = (bookId) => {
  if (!localStorage) return false;
  const books = getBooksFromStorage();
  const filteredBooks = books.filter((item) => item.id !== bookId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
  return true;
};

/**
 * Fungsi yang digunakan untuk mendapatkan books dari storage
 * @returns {Book[]}
 */
const getBooksFromStorage = () => {
  if (!localStorage) return [];
  const books = localStorage.getItem(STORAGE_KEY);
  if (!books) return [];
  const jsonArr = JSON.parse(books);
  return jsonArr
    .map(
      (jsonObj) =>
        new Book(
          jsonObj.id,
          jsonObj.title,
          jsonObj.author,
          jsonObj.year,
          jsonObj.isComplete
        )
    )
    .sort((a, b) => (a.title < b.title ? -1 : 1));
};

export {
  Book,
  prepopulateDataOnFirstLoad,
  addBookToStorage,
  updateBookInStorage,
  deleteBookFromStorage,
  getBooksFromStorage,
};
