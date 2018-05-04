const storageItem = 'library';
const books = JSON.parse(localStorage.getItem(storageItem)) || [];

const generateId = (book) => (book.title + book.author).toLowerCase();
const saveChanges = () => localStorage.setItem(storageItem, JSON.stringify(books));

export default class BookApi {
  static addBook(book) {
    book.id = generateId(book);

    const bookIndex = books.findIndex(b => b.id == book.id);

    if (~bookIndex) {
      return false;
    }

    books.push(book);
    saveChanges();
    return true;
  }

  static editBook(book, prevBookId) {
    book.id = generateId(book);

    // check if book after editing has the same id of already existing book
    if (~books.findIndex(b => b.id == book.id)) {
      return false;
    }

    const bookIndex = books.findIndex(b => b.id == prevBookId.id);
    books.splice(bookIndex, 1, book);
    saveChanges();
    return true;
  }

  static removeBook(bookId) {
    const bookIndex = books.findIndex(b => b.id == bookId);

    books.splice(bookIndex, 1);
    saveChanges();
  }

  static getBooks() {
    return Object.assign([], books);
  }
};
