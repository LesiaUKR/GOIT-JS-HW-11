
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import { fatchPixabayAPI } from './fatchPixabayAPI';


const input = document.querySelector('input#search-box');
const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchBtn = document.querySelector('button[type="submit"]');
const finishMessage = document.querySelector('.finish-text');


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoad);

let page = 1;
let perPage = 100;



function onSearch(evt) {
    
    evt.preventDefault()
    const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
    

    if (!searchQuery) {
        Notiflix.Notify.failure('Please enter a search query!');
        clearPage();
        return
    }
    
    // loadMoreBtn.hidden = true;
    // finishMessage.hidden = true;

    fatchPixabayAPI(searchQuery, page = 1, perPage)
        .then(data => {
        if (data.hits.length === 0) {
                Notiflix.Notify.info(
                    'Sorry, there are no images matching your search query. Please try again.')
                clearPage();
                return;
        } else {
                clearPage();
                createGalleryMarkup(data.hits);
                Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                loadMoreBtn.classList.remove('is-hidden')
                lightbox.refresh();
            }
        if (data.totalHits <= perPage) {
            loadMoreBtn.classList.add('is-hidden')
            searchBtn.disabled = true;
            finishMessage.classList.remove('is-hidden')
            }
        })
        
        .catch(error => {
                console.error(error);
                Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
    }); 
}

function onLoad() {
    const searchQuery = input.value.trim();
    page += 1;

    fatchPixabayAPI(searchQuery, page, perPage)
     .then(data => {

        createGalleryMarkup(data.hits)
        let totalPages = data.totalHits / perPage
     
        if (page >= totalPages) {
            loadMoreBtn.classList.add('is-hidden')
            finishMessage.classList.remove('is-hidden')
           Notiflix.Notify.info("We're sorry, but you've reached the end of search results.") 
        }
             lightbox.refresh();
    })
     .catch(error => {
                console.error(error);
                Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.');
    })
}


function createGalleryMarkup(pictures) {
    const markup = pictures.map(({
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
