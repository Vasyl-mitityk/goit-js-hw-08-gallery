import galleryArr from './gallery-items.js';
// =======================================================================================
// 1) создание разметки галереи изображений:
const refs = {
    gallery: document.querySelector('ul.js-gallery'),
    lightbox: document.querySelector('div.lightbox'),
    closeBtn: document.querySelector('button[data-action="close-lightbox"]'),
    lightboxOverlay: document.querySelector('div.lightbox__overlay'),
    lightboxImage: document.querySelector('img.lightbox__image'),
};

let activeIndex;

// ===========================
// функция получает объект из массива, создает элементы разметки галереи,
// добавляет классы и атрибуты
function createGallery(obj, i) {
    const galleryItem = document.createElement('li');
    galleryItem.classList.add('gallery__item');

    const galleryLink = document.createElement('a');
    galleryLink.classList.add('gallery__link');
    galleryLink.setAttribute('href', obj.original);

    const galleryImage = document.createElement('img');
    galleryImage.classList.add('gallery__image');
    galleryImage.setAttribute('src', obj.preview);
    galleryImage.setAttribute('alt', obj.description);
    galleryImage.dataset.source = obj.original;
    galleryImage.dataset.index = i;
    galleryItem.appendChild(galleryLink).appendChild(galleryImage);
    // console.log(galleryItem);
    return galleryItem;
}

// ===========================
// перебираем массив методом map, создаем разметку для каждого элемента(объекта) массива

const galleryItemsCollection = galleryArr.map((galleryArrItem, i) =>
    createGallery(galleryArrItem, i),
);
// console.log(galleryItemsCollection);

// ===========================
// вешаем разметку внутрь списка ul('js-gallery') - распыляем массив galleryItemsCollection

refs.gallery.append(...galleryItemsCollection);

// =======================================================================================
// 2) Реализация делегирования на галерее ul.js-gallery и получение url большого изображения:
//    - повесить прослушивание клика на ul
refs.gallery.addEventListener('click', onGalleryClick);

//    - при клике в картинку - получить url большого изображения

function onGalleryClick(event) {
    event.preventDefault();
    //    - удостовериться, что пользователь клиекает именно в картинку
    if (event.target.nodeName !== 'IMG') {
        // console.log('кликнули не по картинке, ничего не делаем!');
        return;
    }

    const tagImg = event.target;
    const largeImgURL = tagImg.dataset.source;
    const largeImgALT = tagImg.getAttribute('alt');
    // console.log(largeImgURL);
    // console.log(largeImgALT);

    onOpenModal();

    refs.lightboxImage.setAttribute('alt', largeImgALT);

    setLargeImgURL(largeImgURL);

    activeIndex = getLargeImgActiveIndex();
    //console.log('activeIndex =', activeIndex);
}

function setLargeImgURL(url) {
    refs.lightboxImage.src = url;
}

function removeLargeImgURL() {
    refs.lightboxImage.src = '';
}

function getLargeImgActiveIndex() {
    const largeImgActiveIndex = Number(event.target.dataset.index);
    //console.log('largeImgActiveIndex', largeImgActiveIndex);
    return largeImgActiveIndex;
}

// =======================================================================================
// 3) Открытие модального окна по клику на элементе галереи.
//    Закрытие модального окна по клику на кнопку.
//    Закрытие модального окна по клику на область оверлея div.lightbox__overlay.
//    Закрытие модального окна по нажатию клавиши ESC.

// создание функции открытия модального окна
function onOpenModal() {
    window.addEventListener('keydown', onEscapePress);
    window.addEventListener('keydown', onKeyboardPress);
    refs.lightbox.classList.add('is-open');
}

// создание функции закрытия модального окна
function onCloseModal() {
    window.removeEventListener('keydown', onEscapePress);
    window.removeEventListener('keydown', onKeyboardPress);

    refs.lightbox.classList.remove('is-open');
    removeLargeImgURL();
    refs.lightboxImage.setAttribute('alt', '');
}

// создание функции закрытия модального окна при клике на область оверлея
function onLightboxOverlayClick(event) {
    if (event.target === event.currentTarget) {
        onCloseModal();
    }
}

// создание функции закрытия модального окна при нажатии клавиши ESC
function onEscapePress(event) {
    if (event.code === 'Escape') {
        onCloseModal();
        // console.log('нажали ESC');
    }
}

// закурытие модального окна при клике на кнопку:
refs.closeBtn.addEventListener('click', onCloseModal);

// закурытие модального окна при клике на серую область оверлея:
refs.lightboxOverlay.addEventListener('click', onLightboxOverlayClick);

// =======================================================================================
// 4) // создание функции перелистывания галереи больших изображений при нажатии клавиш "влево" / "вправо"
function onKeyboardPress(event) {
    if (event.code === 'ArrowRight') {
        if (activeIndex >= galleryArr.length - 1) {
            return;
        } else {
            // console.log('нажали клавишу "вправо"');
            activeIndex += 1;
            refs.lightboxImage.src = galleryArr[activeIndex].original;
            refs.lightboxImage.setAttribute(
                'alt',
                galleryArr[activeIndex].description,
            );
            //console.log(activeIndex);
            // console.log(galleryArr[activeIndex].description);
        }
    }

    if (event.code === 'ArrowLeft') {
        if (activeIndex <= 0) {
            return;
        } else {
            // console.log('нажали клавишу "влево"');
            activeIndex -= 1;
            refs.lightboxImage.src = galleryArr[activeIndex].original;
            refs.lightboxImage.setAttribute(
                'alt',
                galleryArr[activeIndex].description,
            );
            //console.log(activeIndex);
            // console.log(galleryArr[activeIndex].description);
        }
    }
}

