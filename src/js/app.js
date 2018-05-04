import 'bootstrap';
import '../sass/main.scss';
import '../img/logo.png';
import BookApi from './api/booksApi';

const editBook = (e) => {
  let bookId = $(e.target).closest('.book').attr('data-book-id');
  let book = BookApi.getBooks().find(b => b.id == bookId);

  $('#modal-add-book-form').serializeArray().forEach(v => {
    $(`#modal-add-book-form #book-${v.name}`).val(book[v.name]);
  });

  let modalAdd = $('#modal-add-book');
  modalAdd.attr('data-book-id', bookId);

  modalAdd.modal('show');
};

const removeBook = (e) => {
  let book = $(e.target).closest('.book');
  let bookId = book.attr('data-book-id');
  BookApi.removeBook(bookId);
  book.parent().remove(); // book container wrap a book
};

const bookView = (book) => {
  let item = $(`<div class="card book" data-book-id="${book.id}"></div>`);
  let itemContent = $(`<div class="card-body"></div>`);
  itemContent.append(
    $(`<h4 class="card-title">${book.title}</h4>`),
    $(`<p class="card-text">${book.author}</p>`),
    $(`<p class="card-text">${book.year}</p>`),
    $(`<button class="btn btn-outline-primary btn-lg btn-block">Edit book</button>`).on('click', editBook),
    $(`<button class="btn btn-outline-warning btn-lg btn-block">Remove book</button>`).on('click', removeBook)
  );

  return item.append(
    $(`<img src="${book.cover}" class="card-img-top img-fluid" alt="${book.title + ' ' + book.author}"/>`),
    itemContent
  );
};

const renderBook = (book, edit = false, prevBookId = null) => {
  let bookContainer = $(`<div class="col-sm-6 col-lg-3 text-center"></div>`);

  if (edit) {
    let alreadyAddedBook = $(`.book[data-book-id="${prevBookId}"]`);
    bookContainer.append(bookView(book));
    alreadyAddedBook.parent().replaceWith(bookContainer);
  } else {
    $(bookContainer).append(bookView(book));
    $('.book-catalog').append(bookContainer);
  }
};

const isFormValid = (form) => form[0].checkValidity();

const addBook = () => {
  let book = {};
  let form = $('#modal-add-book-form');
  let modalAdd = $('#modal-add-book');
  let dataId = modalAdd.attr('data-book-id');

  if (!isFormValid(form)) {
    form.addClass('was-validated');
    return;
  }

  form.serializeArray().forEach((v) => book[v.name] = v.value);

  if (dataId && BookApi.editBook(book, dataId)) {
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
    $('#modal-add-book-form').trigger('reset').removeClass('was-validated');
  });

  BookApi.getBooks().forEach(b => renderBook(b));
});
