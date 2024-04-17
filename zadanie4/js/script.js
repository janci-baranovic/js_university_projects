const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const overlay = document.getElementById('overlay');
const activeImage = document.getElementById('active-image');
const activeName = document.getElementById('active-name');
const activeDescription = document.getElementById('active-description');
const activeDate = document.getElementById('date');
const buttonRight = document.getElementById('right');
const buttonLeft = document.getElementById('left');
const search = document.getElementById('search');
const images = document.getElementsByClassName('image');
const SlideShowButton = document.getElementById('slide-show');

let photos;
let marker = {};
let map = L.map('map');
let slideShowFlag = 0;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('images.json')
	.then(response => response.json())
	.then(data => {
		photos = data.images;
		renderImages();
});

const renderImages = () => {
	photos.forEach((photo, index) => {
		const image = document.createElement('div');
		image.classList.add('image');
		image.style.backgroundImage = `url(${photo.path})`;
		image.setAttribute('data-img-id', index);
		image.addEventListener('click', showBigImage);

		gallery.appendChild(image);
	})
}

const showBigImage = (event) => {
	const imageId = event.target.dataset.imgId;
	const latitude = photos[imageId].latitude;
	const longitude = photos[imageId].longitude;
	const url = event.target.style.backgroundImage;
	activeImage.src = url.substring(5, url.length - 2);
	activeImage.dataset.imgId = event.target.dataset.imgId;
	activeName.innerHTML = photos[imageId].name;
	activeDescription.innerHTML = photos[imageId].description;
	activeDate.innerHTML = getNiceDate(imageId);
	overlay.style.display = 'flex';

	setNewMarker(latitude, longitude);
}

const swipeImage = (imageId) => {
	const latitude = photos[imageId].latitude;
	const longitude = photos[imageId].longitude;

	activeImage.src = photos[imageId].path;
	activeName.innerHTML = photos[imageId].name;
	activeDescription.innerHTML = photos[imageId].description;
	activeDate.innerHTML = getNiceDate(imageId);

	setNewMarker(latitude, longitude);
}

buttonLeft.addEventListener('click', () => {
	activeImage.dataset.imgId = activeImage.dataset.imgId - 1;
	if (activeImage.dataset.imgId < 0) {
		activeImage.dataset.imgId = photos.length - 1;
	}

	swipeImage(activeImage.dataset.imgId);
})

const slideRight = () => {
	activeImage.dataset.imgId = Number(activeImage.dataset.imgId) + 1;
	if (activeImage.dataset.imgId == photos.length) {
		activeImage.dataset.imgId = 0;
	}

	swipeImage(activeImage.dataset.imgId)

	if (slideShowFlag) {
		setTimeout(slideRight, 3000);
	}
}

buttonRight.addEventListener('click', slideRight);

function getNiceDate(imageId) {
	const niceDate = new Date(photos[imageId].date);
	return new Intl.DateTimeFormat('sk-Sk').format(niceDate);
}

function setNewMarker(latitude, longitude) {
	if (map.hasLayer(marker)) {
		map.removeLayer(marker);
	}
	marker = new L.Marker(new L.LatLng(latitude, longitude));
	map.setView([latitude, longitude], 10);
	map.addLayer(marker);
}

overlay.addEventListener('click', (event) => {
	if (event.target == overlay) {
		overlay.style.display = 'none';
		slideShowFlag = 0;
	}
});

search.addEventListener('keyup', () => {
	query = search.value.toLowerCase();
	photos.forEach((photo, index) => {
		if ( photo.name.toLowerCase().includes(query) || photo.description.toLowerCase().includes(query) ) {
			images.item(index).style.display = 'block';
		} else {
			images.item(index).style.display = 'none';
		}
	})
})

SlideShowButton.addEventListener('click', () => {
	if (slideShowFlag) {
		slideShowFlag = 0
	} else {
		slideShowFlag = 1;
	setTimeout(slideRight, 3000);
	}
});

document.addEventListener('DOMContentLoaded', () => {

  	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  	$navbarBurgers.forEach( el => {
    	el.addEventListener('click', () => {

      		const target = el.dataset.target;
      		const $target = document.getElementById(target);

      		el.classList.toggle('is-active');
      		$target.classList.toggle('is-active');

	    });
  	});
});