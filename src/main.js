import axios from 'axios';

const API_KEY = '49228326-f0295c59acbd8047419a0b87e';
const BASE_URL = 'https://pixabay.com/api/';

let currentPage = 1;
let currentQuery = '';

const searchBtn = document.getElementById('searchBtn');
const searchQuery = document.getElementById('searchQuery');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

searchBtn.addEventListener('click', () => {
  currentQuery = searchQuery.value;
  currentPage = 1;
  gallery.innerHTML = '';
  fetchImages();
});

loadMoreBtn.addEventListener('click', () => {
  currentPage += 1;
  fetchImages();
});

async function fetchImages() {
  try {
    loadingSpinner.style.display = 'block';
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: currentQuery,
        page: currentPage,
        per_page: 40,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (currentPage * 40 >= totalHits) {
      loadMoreBtn.style.display = 'none';
      gallery.innerHTML += `<p>We're sorry, but you've reached the end of search results</p>`;
    } else {
      loadMoreBtn.style.display = 'block';
    }

    displayImages(images);
    scrollPage();
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loadingSpinner.style.display = 'none';
  }
}

function displayImages(images) {
  const imageElements = images
    .map(image => {
      return `<div class="gallery-item">
              <img src="${image.webformatURL}" alt="${image.tags}" data-large="${image.largeImageURL}" />
              <div class="info">
          <p>Likes: ${image.likes}</p>
          <p>Views: ${image.views}</p>
          <p>Comments: ${image.comments}</p>
          <p>Downloads: ${image.downloads}</p>
        </div>
            </div>`;
    })
    .join('');

  gallery.innerHTML += imageElements;
  initializeLightbox();
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery-item img', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}
function scrollPage() {
  const lastImage = gallery.lastElementChild;
  if (lastImage) {
    const { top } = lastImage.getBoundingClientRect();
    window.scrollBy({
      top: top + lastImage.offsetHeight * 2,
      behavior: 'smooth',
    });
  }
}
