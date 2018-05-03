const books = [];

const generateId = (book) => (book.title + book.author).toLowerCase();

export default class BookApi {
  static addBook(book) {
    book.id = generateId(book);

    const bookIndex = books.findIndex(b => b.id == book.id);

    if (~bookIndex) {
      return false;
    }

    books.push(book);
    return true;
  }

  static editBook(book, prevBookId) {
    book.id = generateId(book);
    const bookIndex = books.findIndex(b => b.id == prevBookId.id);

    books.splice(bookIndex, 1, book);
  }

  static removeBook(bookId) {
    const bookIndex = books.findIndex(b => b.id == bookId);

    books.splice(bookIndex, 1);
  }

  static getBooks() {
    return Object.assign([], books);
  }
};
