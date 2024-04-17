const routeButton = document.getElementById('route');
const routeLength = document.getElementById('route-length');

let map = L.map('bigMap').setView([48.148, 17.107], 4);
let route;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let photos;

fetch('../images.json')
	.then(response => response.json())
	.then(data => {
        photos = data.images;
        const places = getAllPhotosForPlace();
        addMarkers(places)
        photos.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        })
});

function getAllPhotosForPlace() {
    const places = {};
    photos.forEach(photo => {
        if(!Object.keys(places).includes(photo.place)) {
            places[photo.place] = [photo.path];
        } else {
            places[photo.place].push(photo.path);
        }
    })
    return places;
}

function addMarkers(places) {
    const markedPlaces = [];
    photos.forEach(photo => {
        if (!markedPlaces.includes(photo.place)) {
            L.marker([photo.latitude, photo.longitude]).addTo(map).bindPopup(getPopupContent(places, photo.place), {
                maxWidth: 560
            });
            markedPlaces.push(photo.place);
        }
    })
}

function getPopupContent(places, place) {
    const gallery = document.createElement('div');
    gallery.classList.add('popup-gallery');

    if (places[place].length === 1) {
        createImage(gallery, places[place]);
        photos.forEach((photo, index) => {
            if (photo.place === place) {
                const name = document.createElement('h4');
                name.innerHTML = photos[index].name;
                const description = document.createElement('p');
                description.innerHTML = photos[index].description;
                const date = document.createElement('p');
                date.innerHTML = new Intl.DateTimeFormat('sk-Sk').format(new Date(photos[index].date));
                gallery.appendChild(name);
                gallery.appendChild(description);
                gallery.appendChild(date);
            }
        })
    } else {
        places[place].forEach(path => {
            createImage(gallery, path)
        })
    }

    return gallery;
}

function createImage(gallery, path) {
    image = document.createElement('img');
    image.src = '../' + path;
    image.classList.add('popup-image');
    gallery.appendChild(image);
}

routeButton.addEventListener('click', showRoute);

function showRoute() {
    let markers = [];

    if (route) {
        map.removeControl(route);
        route = 0;
        routeLength.innerHTML = '';
    } else {
        photos.forEach(photo => {
        markers.push(L.latLng(photo.latitude, photo.longitude));
        }) 

        route = L.Routing.control({
            waypoints: markers
        }).addTo(map);

        route.on('routesfound', (event) => {
            const summary = event.routes[0].summary;
            routeLength.innerHTML = `Dĺžka trasy, ktorú treba prejsť je ${Math.round(summary.totalDistance / 1000)}km`;
        });
    }
    
}

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