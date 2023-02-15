
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { fatchPixabayAPI } from './fatchPixabayAPI';


const input = document.querySelector('input#search-box');
const searchBtn = document.querySelector('button[type="submit"]');
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery')
console.log(gallery);

let page = 0;
let perPage = 40;


searchForm.addEventListener('submit', onSearch);

function onSearch(evt) {
    
    evt.preventDefault()
    const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
    page = 1;
    console.log(searchQuery)

    if (!searchQuery) {
        clearPage();
        return
    }
    fatchPixabayAPI(searchQuery, page, perPage).then(data => {
        if (data.hits === 0) {
            Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.')
                clearPage();
                return;
        } else {
                clearPage();
                createGalleryMarkup(data.hits);
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
    }
       )
}


function createGalleryMarkup(data) {
    const markup = data.map(({
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
        downloads }) => `
    <li class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}">
      <div class="gallery__photo-card">
         <img class="gallery__image"src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </div>
      <div class="gallery__info">
         <p class="info__item">
             <b>Likes</b><br>${likes}
         </p>
         <p class="info__item">
             <b>Views</b><br>${views}
         </p>
         <p class="info__item">
             <b>Comments</b><br>${comments}
         </p>
        <p class="info__item">
             <b>Downloads</b><br>${downloads}
         </p>
      </div>
         </a>
     </li>`).join('');
     
     gallery.insertAdjacentHTML('beforeend', markup);
}

const lightboxOpts = {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
};

const lightbox = new SimpleLightbox('.gallery .gallery__link', lightboxOpts);

function clearPage() {
  gallery.innerHTML = '';
}
