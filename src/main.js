// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";



const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
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
 
    gallery.innerHTML = '';
  
    getImage(queryInput).then(({ hits }) => {
        if (hits.length > 0) {
            const galleryHTML = hits.map(createGallery).join('');
            gallery.innerHTML = galleryHTML;
            
            lightbox = new SimpleLightbox(`.gallery-link`);
          lightbox.refresh();
          loader.style.display = 'none';
           
        }else {
            iziToast.info({
                title: 'Info',
                message: 'Unfortunately, no images were found for your search. Please try again!',
                position: 'topRight',
            });
        }
    })
  form.reset();
  
})

function getImage(q) {
    const PARAMS = {
        key: '42392659-652aaf55959599f1a779f61b5',
        q,
        image_type: 'photo',
        orientation: 'horizontal',
        safeSearch: true,
    }
    const url = BASE_URL + '?' + new URLSearchParams(PARAMS).toString();
    return fetch(url).then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .catch(error => {
            iziToast.error({
                title: 'Error',
                message: 'There seems to be a problem with your internet connection. Please check and try again.',
                position: 'topRight',
            });
            throw error;
        })
      .finally(() => {
     loader.style.display = 'none';
  })
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