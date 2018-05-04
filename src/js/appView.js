const BookView = (() => {
  const _bookView = Symbol();
  const _container = Symbol();
  const _dest = Symbol();
  const _editHandler = Symbol();
  const _removeHandler = Symbol();

  class BookView {
    constructor(destSelector, containerEl, editHandler, removeHandler) {
      this[_dest] = destSelector;
      this[_container] = containerEl;
      this[_editHandler] = editHandler;
      this[_removeHandler] = removeHandler;
    }

    [_bookView](book) {
      let item = $(`<div class="card book" data-book-id="${book.id}"></div>`);
      let itemContent = $(`<div class="card-body"></div>`);
      itemContent.append(
        $(`<h4 class="card-title">${book.title}</h4>`),
        $(`<p class="card-text">${book.author}</p>`),
        $(`<p class="card-text">${book.year}</p>`),
        $(`<button class="btn btn-outline-primary btn-lg btn-block">Edit book</button>`).on('click', this[_editHandler]),
        $(`<button class="btn btn-outline-warning btn-lg btn-block">Remove book</button>`).on('click', this[_removeHandler])
      );

      return item.append(
        $(`<img src="${book.cover}" class="card-img-top img-fluid" alt="${book.title + ' ' + book.author}"/>`),
        itemContent
      );
    }

    render(book, edit = false, prevBookId = null) {
      let bookContainer = this[_container].clone();

      if (edit) {
        let alreadyAddedBook = $(`.book[data-book-id="${prevBookId}"]`);
        bookContainer.append(this[_bookView](book));
        alreadyAddedBook.parent().replaceWith(bookContainer);
      } else {
        $(bookContainer).append(this[_bookView](book));
        $(this[_dest]).append(bookContainer);
      }
    }
  }

  return BookView;
})();

export default BookView;
