import {
  Book,
  prepopulateDataOnFirstLoad,
  addBookToStorage,
  updateBookInStorage,
  deleteBookFromStorage,
  getBooksFromStorage,
} from './storage.js';

const form = document.querySelector('.form');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('input[name="search"]');
const formTitle = document.querySelector('.form-title');
const resetButton = form.querySelector('button[type="reset"]');
const cancelButton = form.querySelector('button[type="button"]');
const titleInput = form.querySelector('input[name="title"]');
const authorInput = form.querySelector('input[name="author"]');
const yearInput = form.querySelector('input[name="year"]');
const isCompleteInput = form.querySelector('input[name="isComplete"]');

const finishedBooks = document.querySelector('.finished-books');
const unfinishedBooks = document.querySelector('.unfinished-books');
const bookEls = document.getElementsByClassName('book');

/**
 * EVENT LISTENER: membuat buku baru
 * @param {SubmitEvent} e
 */
const createBookEventListener = (e) => {
  e.preventDefault();
  const book = new Book(
    Date.now(),
    titleInput.value,
    authorInput.value,
    Number(yearInput.value),
    isCompleteInput.checked
  );
  const isSuccess = addBookToStorage(book);
  if (!isSuccess) return;
  addBookToView(book);
  clearFormInputs();
  alert('Berhasil menambahkan buku baru');
};

/**
 * EVENT LISTENER: mengedit buku
 * @param {SubmitEvent} e
 */
const editBookEventListener = (e) => {
  e.preventDefault();
  const bookId = form.getAttribute('data-book-id');
  const newBook = new Book(
    Number(bookId),
    titleInput.value,
    authorInput.value,
    Number(yearInput.value),
    isCompleteInput.checked
  );
  const isSuccess = updateBookInStorage(newBook);
  if (!isSuccess) return;
  updateView();
  changeFormType({ type: 'create' });
  alert('Berhasil mengubah buku');
};

/**
 * EVENT LISTENER: cancel mengedit buku
 */
const cancelEditEventListener = () => {
  changeFormType({ type: 'create' });
};

/**
 * EVENT LISTENER: Search Input
 * @param {Event} event
 */
const searchInputEventListener = (event) => {
  const searchValue = event.target.value.toLowerCase();
  for (const el of bookEls) {
    const bookTitle = el.querySelector('.book-title').innerText.toLowerCase();
    const bookInfo = el
      .querySelector('.book-information')
      .innerText.toLowerCase();
    if (bookTitle.includes(searchValue) || bookInfo.includes(searchValue)) {
      el.classList.remove('hide');
    } else {
      el.classList.add('hide');
    }
  }
};

/**
 * Fungsi yang digunakan untuk mengubah tipe form
 * @param {{ type: 'create' } | { type: 'edit', book: Book}} props
 */
const changeFormType = (props) => {
  form.setAttribute('data-formtype', props.type);
  if (props.type === 'create') {
    form.removeAttribute('data-book-id');
    formTitle.innerText = 'Add a book manually';
    clearFormInputs();
    resetButton.classList.remove('hide');
    cancelButton.classList.add('hide');
    form.onsubmit = createBookEventListener;
  } else if (props.type === 'edit') {
    scrollTo({
      behavior: 'smooth',
      left: 0,
      top: 0,
    });
    form.setAttribute('data-book-id', props.book.id);
    formTitle.innerText = 'Edit book';
    titleInput.value = props.book.title;
    authorInput.value = props.book.author;
    yearInput.value = props.book.year;
    isCompleteInput.checked = props.book.isComplete;
    resetButton.classList.add('hide');
    cancelButton.classList.remove('hide');
    form.onsubmit = editBookEventListener;
  }
};

/**
 * Fungsi digunakan untuk mereset seluruh isi form
 */
const clearFormInputs = () => {
  titleInput.value = '';
  authorInput.value = '';
  yearInput.value = '';
  isCompleteInput.checked = false;
};

/**
 * Fungsi digunakan untuk membuat element HTML
 * @param {Book} book
 * @returns {HTMLDivElement}
 */
const createBookEl = (book) => {
  const div = document.createElement('div');
  div.classList.add('book');
  div.innerHTML = `
    <h3 class="book-title">${book.title}</h3>
    <p class="book-information">${book.author} (${book.year})</p>
    <div class="book-action">
      <button type="button" class="btn move-btn">
        ${book.isComplete ? 'To Read' : 'Finished'}
      </button>
      <button type="button" class="btn btn-ico edit-btn">
        <i class="bx bx-edit"></i>
      </button>
      <button type="button" class="btn btn-ico delete-btn">
        <i class="bx bx-trash"></i>
      </button>
    </div>
  `;
  const moveBtn = div.querySelector('.move-btn');
  const editBtn = div.querySelector('.edit-btn');
  const deleteBtn = div.querySelector('.delete-btn');

  moveBtn.addEventListener('click', () => {
    const newBook = new Book(
      book.id,
      book.title,
      book.author,
      book.year,
      !book.isComplete
    );
    updateBookInStorage(newBook);
    updateView();
    alert(`Berhasil memindahkan buku ${book.title}`)
  });

  editBtn.addEventListener('click', () => {
    changeFormType({ type: 'edit', book: book });
  });

  deleteBtn.addEventListener('click', () => {
    const confirm = prompt('Type "delete" to confirm', '');
    if (confirm !== 'delete') return;
    const isSuccess = deleteBookFromStorage(book.id);
    if (!isSuccess) return;
    div.remove();
    alert('Berhasil menghapus buku');
  });

  return div;
};

/**
 * Fungsi untuk memperbarui buku pada tampilan secara keseluruhan
 */
const updateView = () => {
  finishedBooks.innerHTML = ``;
  unfinishedBooks.innerHTML = ``;
  const books = getBooksFromStorage();
  books.forEach(addBookToView);
};

/**
 * Fungsi untuk menambahkan buku ke view
 * @param {*} book
 */
const addBookToView = (book) => {
  const bookEl = createBookEl(book);
  if (book.isComplete) {
    finishedBooks.append(bookEl);
  } else {
    unfinishedBooks.append(bookEl);
  }
};

prepopulateDataOnFirstLoad();
updateView();

form.onsubmit = createBookEventListener;
searchForm.onsubmit = (e) => e.preventDefault();
cancelButton.onclick = cancelEditEventListener;
searchInput.oninput = searchInputEventListener;
