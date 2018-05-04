import BookView from "./appView";
import BookApi from "./api/booksApi";

const AppCtrl = (() => {
  const _view = Symbol();
  const _editHandler = Symbol();
  const _removeHandler = Symbol();
  const _addHandler = Symbol();
  const _api = Symbol();

  const isFormValid = (form) => form[0].checkValidity();
  const hideBookIdentityErrorMsg = () => $('#book-identity-error').removeClass('is-invalid').addClass('d-none');
  const showBookIdentityErrorMsg = () => $('#book-identity-error').addClass('is-invalid').removeClass('d-none');

  class AppController {
    constructor() {
      this[_editHandler] = this[_editHandler].bind(this);
      this[_removeHandler] = this[_removeHandler].bind(this);
      this[_addHandler] = this[_addHandler].bind(this);
      this.init = this.init.bind(this);

      this[_view] = new BookView(
        '.book-catalog',
        $(`<div class="col-sm-6 col-lg-3 text-center"></div>`),
        this[_editHandler],
        this[_removeHandler]
      );
    }

    init() {
      $(document).ready(() => {
        $('#modal-add-book-btn').on('click', this[_addHandler]);

        $('#modal-add-book').on('hide.bs.modal', () => {
          $('#modal-add-book-form').trigger('reset').removeClass('was-validated');
          hideBookIdentityErrorMsg();
        });

        BookApi.getBooks().forEach(b => this[_view].render(b));
      });
    }

    [_editHandler](e) {
      let bookId = $(e.target).closest('.book').attr('data-book-id');
      let book = BookApi.getBooks().find(b => b.id == bookId);

      $('#modal-add-book-form').serializeArray().forEach(v => {
        $(`#modal-add-book-form #book-${v.name}`).val(book[v.name]);
      });

      let modalAdd = $('#modal-add-book');
      modalAdd.attr('data-book-id', bookId);

      modalAdd.modal('show');
    }

    [_removeHandler](e) {
      let book = $(e.target).closest('.book');
      let bookId = book.attr('data-book-id');
      BookApi.removeBook(bookId);
      book.parent().remove(); // book container wrap a book
    }

    [_addHandler]() {
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
        this[_view].render(book, true, dataId);
        modalAdd.modal('hide');
        modalAdd.removeAttr('data-book-id');
      } else if (BookApi.addBook(book)) {
        this[_view].render(book);
        modalAdd.modal('hide');
      } else {
        showBookIdentityErrorMsg();
        form.addClass('was-validated');
      }
    }
  }

  return AppController;
})();

export default AppCtrl;

