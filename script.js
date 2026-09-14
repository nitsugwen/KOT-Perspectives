// SELECTION
const carouselContainer = document.getElementById('carousel');
const galleryModal = document.getElementById('galleryModal');
const openGalleryBtn = document.getElementById('openGallery');
const homeBtn = document.getElementById('homeBtn');
const galleryTabs = document.getElementById('galleryTabs');
const galleryContainer = document.getElementById('gallerySectionsContainer');

// LIGHTBOX INFOS
const lightboxModal = document.getElementById('lightboxModal');
const closeLightboxBtn = document.getElementById('closeLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// STATE VARIABLES
const CATEGORIES = ['Portraits', 'Travel', 'Events', 'Nature']; 
let slides = [];
let photosData = [];
let currentGalleryList = [];
let currentIndex = 0;
let slideInterval;
let currentLightboxIndex = 0;
const INTERVAL_TIME = 2500;

// HELPER FUNCTION
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// GALLERY DATA
function initPortfolio() {

  const randomizedSlides = shuffleArray(carouselSlidesData);

  carouselContainer.innerHTML = randomizedSlides.map((item, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}" data-category="${item.category}" style="background-image: url('${item.image}');">
      <div class="slide-overlay">
        <h2 class="slide-title">${item.title}</h2>
        <p class="slide-description">${item.description}</p>
      </div>
    </div>
  `).join('');

  slides = Array.from(document.querySelectorAll('.slide'));
  photosData = carouselSlidesData.map(item => ({
    url: item.image,
    title: item.title,
    description: item.description,
    category: item.category
  }));

  startAutoSlide();
}

// SLIDESHOW
function showSlide(index) {
  if (!slides.length) return;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  if (!slides.length) return; 
  currentIndex = (currentIndex + 1) % slides.length; 
  showSlide(currentIndex); 
}

function startAutoSlide() {
  stopAutoSlide(); 
  slideInterval = setInterval(nextSlide, INTERVAL_TIME); 
}

function stopAutoSlide() {
  clearInterval(slideInterval); 
}

// TOGGLE
openGalleryBtn.addEventListener('click', () => {
  renderDividedGallery('All'); 
  galleryModal.classList.add('open'); 
  stopAutoSlide(); 
});

homeBtn.addEventListener('click', () => {
  galleryModal.classList.remove('open'); 
  setTimeout(() => {
    startAutoSlide(); 
  }, 300); 
});

// FILTER CATEGORY
galleryTabs.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab-btn')) { 
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); 
    e.target.classList.add('active'); 
    
    const filter = e.target.getAttribute('data-filter'); 
    renderDividedGallery(filter); 
  }
});

// PHOTOS CATEGORY
function renderDividedGallery(filter) {
  galleryContainer.innerHTML = ''; 

  const categoriesToRender = (filter === 'All')  
    ? CATEGORIES  
    : CATEGORIES.filter(cat => cat === filter); 

  let visiblePhotos = [];

  categoriesToRender.forEach(category => {
    const categoryPhotos = photosData.filter(photo => photo.category === category); 

    if (categoryPhotos.length === 0) return; 

    const division = document.createElement('div'); 
    division.className = 'category-division'; 

    const title = document.createElement('h3'); 
    title.className = 'category-title'; 
    title.innerText = category; 
    division.appendChild(title); 

    const grid = document.createElement('div'); 
    grid.className = 'gallery-grid'; 

    categoryPhotos.forEach((photo) => {
      visiblePhotos.push(photo);
      const currentIndexInView = visiblePhotos.length - 1;

      const item = document.createElement('div'); 
      item.className = 'gallery-item'; 
      item.innerHTML = `
        <img src="${photo.url}" alt="${photo.title}">
        <div class="gallery-item-info">${photo.title}</div>
      `; 

      item.addEventListener('click', () => {
        openLightbox(currentIndexInView, visiblePhotos); 
      });

      grid.appendChild(item); 
    });

    division.appendChild(grid); 
    galleryContainer.appendChild(division); 
  });
}

// IMAGE ZOOM
function openLightbox(index, activeList = photosData) {
  currentGalleryList = activeList;
  currentLightboxIndex = index; 
  
  updateLightboxContent();

  lightboxModal.classList.add('open'); 

  backToTopBtn.classList.remove('show');
}

function updateLightboxContent() {
  const photo = currentGalleryList[currentLightboxIndex]; 

  lightboxImg.classList.add('switching'); 

  setTimeout(() => {
    lightboxImg.src = photo.url; 
    lightboxTitle.innerText = photo.title; 
    lightboxDesc.innerText = photo.description; 
    lightboxImg.classList.remove('switching'); 
  }, 150); 
}

lightboxPrev.addEventListener('click', () => {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryList.length) % currentGalleryList.length; 
  updateLightboxContent(); 
});

lightboxNext.addEventListener('click', () => {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryList.length; 
  updateLightboxContent(); 
});

closeLightboxBtn.addEventListener('click', () => {
  lightboxModal.classList.remove('open'); 
  toggleBackToTop();
});

lightboxModal.addEventListener('click', (e) => {
  if (e.target === lightboxModal) { 
    lightboxModal.classList.remove('open'); 
    toggleBackToTop();
  }
});

// KEYBOARD NAVIGATION
document.addEventListener('keydown', (e) => {
  if (lightboxModal.classList.contains('open')) {
    if (e.key === 'ArrowRight') {
      currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryList.length;
      updateLightboxContent();
    } else if (e.key === 'ArrowLeft') {
      currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
      updateLightboxContent();
    } else if (e.key === 'Escape') {
      lightboxModal.classList.remove('open');
      toggleBackToTop();
    }
  } else if (galleryModal.classList.contains('open')) {
    if (e.key === 'Escape') {
      galleryModal.classList.remove('open');
      setTimeout(() => {
        startAutoSlide();
      }, 300);
    }
  }
});

document.addEventListener('DOMContentLoaded', initPortfolio); 

// BACK TO TOP
const backToTopBtn = document.getElementById('backToTopBtn'); 

function toggleBackToTop() {
  if (lightboxModal.classList.contains('open')) {
    backToTopBtn.classList.remove('show');
    return;
  }

  const modalScrollTop = galleryModal.scrollTop; 
  const pageScrollTop = window.scrollY || document.documentElement.scrollTop; 

  if (modalScrollTop > 300 || pageScrollTop > 300) { 
    backToTopBtn.classList.add('show'); 
  } else {
    backToTopBtn.classList.remove('show'); 
  }
}

// MOBILE ADJUSTMENTS
window.addEventListener('scroll', toggleBackToTop); 
galleryModal.addEventListener('scroll', toggleBackToTop); 

// BACK TO TOP
backToTopBtn.addEventListener('click', () => {
  if (galleryModal.classList.contains('open')) { 
    galleryModal.scrollTo({ top: 0, behavior: 'smooth' }); 
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
});