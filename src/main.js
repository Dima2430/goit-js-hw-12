import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

let page = 1;
let totalPages = 0;
let query = '';
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');
let lightbox;

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.elements.query.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'block';
  gallery.innerHTML = '';
  fetchAndRender();
  form.reset();
});
loadMoreButton.addEventListener('click', async e => {
  fetchAndRender();
});
function fetchFotos(q) {
  const PARAMS = {
    key: '42392659-652aaf55959599f1a779f61b5',
    q,
    image_type: 'photo',
    orientation: 'horizontal',
    safeSearch: true,
    per_page: 20,
    page,
  };
  return axios.get(`https://pixabay.com/api/`, {
    params: PARAMS,
  });
}
function render({
  largeImageURL,
  tags,
  webformatURL,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <a href="${largeImageURL}" class="gallery-link">
      <figure>
        <img src="${webformatURL}" alt="${tags}" class="gallery-image">
        <figcaption class="gallery__figcaption">
          <div class="image-item">Likes <span class="image-elem">${likes}</span></div>
          <div class="image-item">Views <span class="image-elem">${views}</span></div>
          <div class="image-item">Comments <span class="image-elem">${comments}</span></div>
          <div class="image-item">Downloads <span class="image-elem">${downloads}</span></div>
        </figcaption>
      </figure>
    </a>
  `;
}

async function fetchAndRender() {
  try {
    const response = await fetchFotos(query);
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;

    if (page === 1) {
      totalPages = Math.ceil(totalHits / 20);
    }

    if (hits.length === 0) {
      iziToast.info({
        title: 'Info',
        message: 'No results found.',
        position: 'topRight',
      });
      loadMoreButton.style.display = 'none';
      return;
    }

    gallery.insertAdjacentHTML('beforeend', hits.map(render).join(''));

    if (!lightbox) {
      lightbox = new SimpleLightbox('.gallery a');
    } else {
      lightbox.refresh();
    }

    if (page >= totalPages) {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: 'No more results to show.',
        position: 'topRight',
      });
    } else {
      loadMoreButton.style.display = 'block';
    }

    page++;
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Try again later.',
      position: 'topRight',
    });
  } finally {
    loader.style.display = 'none';
  }
}
