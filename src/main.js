// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
import axios from 'axios';

let currentQuery = '';
let currentPage = 1;
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more')
loader.style.display = 'none';
const BASE_URL = 'https://pixabay.com/api/';
let lightbox;
form.addEventListener('submit', e => {
  e.preventDefault();
  loader.style.display = 'block';
    const queryInput = e.target.elements.query.value.trim();
    if (queryInput.length < 3) {
         iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query with at least 3 characters.',
      position: 'topRight',
         });
       loader.style.display = 'none';
    return;
  }
  loadMoreButton.style.display = 'none';
  currentQuery = queryInput;
  currentPage = 1;
    gallery.innerHTML = '';
  
    getImage(currentQuery, currentPage).then(({ hits }) => {
        if (hits.length > 0) {
            const galleryHTML = hits.map(createGallery).join('');
            gallery.innerHTML = galleryHTML;
            
            lightbox = new SimpleLightbox(`.gallery-link`);
          lightbox.refresh();
          loader.style.display = 'none';
          loadMoreButton.style.display = 'block';
          
        }else {
            iziToast.info({
                title: 'Info',
                message: 'Unfortunately, no images were found for your search. Please try again!',
                position: 'topRight',
            });
           loadMoreButton.style.display = 'none';
        }
    })
  form.reset();
  
})


loadMoreButton.addEventListener('click', async () => {
  loader.style.display = 'block';
  currentPage += 1;
  const { hits } = await getImage(currentQuery, currentPage);
  const galleryHTML = hits.map(createGallery).join('');
  gallery.insertAdjacentHTML('beforeend', galleryHTML);
  lightbox.refresh();
  loader.style.display = 'none';
  if (hits.length === 0) {
    loadMoreButton.style.display = 'none';
    iziToast.info({
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
  // window.scrollTo({
  //   top: document.body.scrollHeight,
  //   behavior: 'smooth',
  // });
  window.scrollBy({
      top: document.querySelector('.gallery-image').getBoundingClientRect().height * 2,
      behavior: 'smooth'
    });
});
async function getImage(q,page = 1) {
    const PARAMS = {
        key: '42392659-652aaf55959599f1a779f61b5',
        q,
        image_type: 'photo',
        orientation: 'horizontal',
      safeSearch: true,
         per_page: 15,
        page,
    }
    const url = BASE_URL + '?' + new URLSearchParams(PARAMS).toString();
    try {
        const res = await axios.get(url);
        if (res.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return res.data;
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'There seems to be a problem with your internet connection. Please check and try again.',
            position: 'topRight',
        });
        throw error;
    } finally {
        loader.style.display = 'none';
    }
}
function createGallery({
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