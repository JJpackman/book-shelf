import 'bootstrap';
import '../sass/main.scss';
import '../img/logo.png';
import BookApi from './api/booksApi';

const editBook = (e) => {
  let bookId = $(e.target).parent('.book').attr('data-book-id');
  let book = BookApi.getBooks().find(b => b.id == bookId);

  $('#modal-add-book-form').serializeArray().forEach(v => {
    $(`#modal-add-book-form #book-${v.name}`).val(book[v.name]);
  });

  let modalAdd = $('#modal-add-book');
  modalAdd.attr('data-book-id', bookId);

  modalAdd.modal('show');
};

const removeBook = (e) => {
  let bookId = $(e.target).parent('.book').attr('data-book-id');
  BookApi.removeBook(bookId);
};

const bookView = (book) => {
  return [
    $(`<img src="${book.cover}" class="img-fluid"/>`),
    $(`<h4>${book.title}</h4>`),
    $(`<p>${book.author}</p>`),
    $(`<p>${book.year}</p>`),
    $(`<button class="btn btn-outline-primary float-left">Edit book</button>`).on('click', editBook),
    $(`<button class="btn btn-outline-warning float-right">Remove book</button>`).on('click', removeBook)
  ];
};

const renderBook = (book, edit = false, prevBookId = null) => {
  let bookContainer = $(`<div class="col-sm-6 book col-md-3 text-center" data-book-id="${book.id}"></div>`);

  if (edit) {
    let alreadyAddedBook = $(`.book[data-book-id="${prevBookId}"]`);
    bookContainer.append(...bookView(book));
    alreadyAddedBook.replaceWith(bookContainer);
  } else {
    $(bookContainer).append(...bookView(book));
    $('.book-catalog').append(bookContainer);
  }
};

const addBook = () => {
  let book = {};
  let form = $('#modal-add-book-form');
  let modalAdd = $('#modal-add-book');
  let dataId = modalAdd.attr('data-book-id');

  form.serializeArray().forEach((v) => book[v.name] = v.value);

  if (dataId) {
    BookApi.editBook(book, dataId);
    renderBook(book, true, dataId);
    modalAdd.modal('hide');
    modalAdd.removeAttr('data-book-id');
  } else if (BookApi.addBook(book)) {
    renderBook(book);
    modalAdd.modal('hide');
  }
};

$(document).ready(() => {
  $('#modal-add-book-btn').on('click', addBook);
  $('#modal-add-book').on('hide.bs.modal', () => {
    $('#modal-add-book-form').trigger('reset');
  });
});


