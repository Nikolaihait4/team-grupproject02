import { fetchPopularBooks, fetchCategoryBooks } from './js/fetchBooks';

async function renderPopularBooks() {
  const genresList = document.getElementById('bookList');
  const popularBooksData = await fetchPopularBooks();

  genresList.innerHTML = popularBooksData
    .map(({ list_name, books }) => {
      const initialBooks = books.slice(0, 5);
      const booksHTML = initialBooks.map(book => createBookHTML(book)).join('');

      return `
        <div class="category-block">
          <h2 class="category-title">${list_name}</h2>
          <div class="book-row">${booksHTML}</div>
          <button class="see-more-btn">See More</button>
        </div>
      `;
    })
    .join('');

  const seeMoreButtons = document.querySelectorAll('.see-more-btn');
  seeMoreButtons.forEach(button => {
    const categoryTitle = button
      .closest('.category-block')
      .querySelector('.category-title').textContent;
    button.dataset.category = categoryTitle;
    button.addEventListener('click', showMoreBooks);
  });
}

function createBookHTML(book) {
  return `
    <div class="book-card">
      <img class="book-image" src="${book.book_image}" alt="${book.title}">
      <div class="book-info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
      </div>
    </div>
  `;
}

async function showMoreBooks(event) {
  const button = event.target;
  const categoryBlock = button.closest('.category-block');
  const bookRow = categoryBlock.querySelector('.book-row');

  if (!categoryBlock.dataset.loaded) {
    const categoryName = button.dataset.category;
    const categoryBooksData = await fetchCategoryBooks(categoryName);

    const remainingBooksHTML = categoryBooksData
      .map(book => createBookHTML(book))
      .join('');

    bookRow.insertAdjacentHTML('beforeend', remainingBooksHTML);
    categoryBlock.dataset.loaded = true;
  }

  const hiddenBooks = bookRow.querySelectorAll('.hidden-book');
  hiddenBooks.forEach(book => book.classList.remove('hidden-book'));
  button.style.display = 'none';
}

renderPopularBooks();
