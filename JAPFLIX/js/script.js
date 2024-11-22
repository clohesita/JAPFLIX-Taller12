let moviesArray = [];
let moviesList = document.getElementById('lista');
let offcanvasTitle = document.getElementById('offcanvas-title');
let offcanvasBody = document.getElementById('offcanvas-body-movies');

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // URL del JSON con los datos de las películas
    let peliculasJSON = 'https://japceibal.github.io/japflix_api/movies-data.json';

    // Obtén los datos de las películas de la API
    getJSONData(peliculasJSON).then(function(respObj) {
        if (respObj.status === "ok") {
            moviesArray = respObj.data;
            console.log("Datos cargados correctamente:", moviesArray); // Para depuración
        }
    });

    // Evento de búsqueda
    document.getElementById('btnBuscar').addEventListener('click', function() {
        let userSearchInput = document.getElementById('inputBuscar').value.toLowerCase();
        searchMovies(userSearchInput, moviesArray);
    });
});

// Función para filtrar las películas según la búsqueda
function searchMovies(searchInput, array) {
    moviesList.innerHTML = ""; // Limpiar la lista

    const newMoviesArray = array.filter(element => {
        const genresText = element.genres.map(genre => genre.name.toLowerCase()).join(" ");
        return (
            element.title.toLowerCase().includes(searchInput) ||
            element.tagline.toLowerCase().includes(searchInput) ||
            element.overview.toLowerCase().includes(searchInput) ||
            genresText.includes(searchInput)
        );
    });

    if (newMoviesArray.length > 0) {
        showMovies(newMoviesArray);
    } else {
        moviesList.innerHTML += `<div class="alert alert-danger" role="alert">No se encontraron resultados para su búsqueda.</div>`;
    }
}

// Función para mostrar las películas
function showMovies(movies) {
    moviesList.innerHTML = ""; // Limpiar la lista

    movies.forEach(element => {
        const stars = element.vote_average / 2; // Calcular las estrellas (dividiendo por 2)
        const starRating = getStarRating(stars); // Obtener las estrellas

        const movieItem = createMovieItem(element, starRating); // Crear el item de película
        moviesList.appendChild(movieItem); // Agregarlo a la lista
    });
}

// Función para crear el elemento de la película
function createMovieItem(movie, starRating) {
    const movieItem = document.createElement('a');
    movieItem.classList.add('list-group-item', 'list-group-item-action', 'custom-color');
    movieItem.setAttribute('href', '#offcanvasMovie');
    movieItem.setAttribute('role', 'button');
    movieItem.setAttribute('data-bs-toggle', 'offcanvas');
    movieItem.setAttribute('onclick', `generateOffcanvas(${movie.id})`);

    movieItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between flex-column flex-sm-row">
            <h5 class="mb-1">${movie.title}</h5>
            <small class="text-muted">${starRating}</small>
        </div>
        <p class="mb-1">${movie.tagline}</p>
    `;
    
    return movieItem;
}

// Función para obtener el formato de estrellas
function getStarRating(stars) {
    const fullStars = Math.floor(stars); // Estrellas llenas
    const halfStars = (stars - fullStars) >= 0.5 ? 1 : 0; // Media estrella
    const emptyStars = 5 - fullStars - halfStars; // Estrellas vacías

    let starRating = '';
    for (let i = 0; i < fullStars; i++) {
        starRating += '<i class="fa fa-star checked"></i>';
    }
    if (halfStars) {
        starRating += '<i class="fa fa-star-half-alt checked"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starRating += '<i class="fa fa-star"></i>';
    }
    return starRating;
}

// Función para generar el contenido del offcanvas (detalles de la película)
function generateOffcanvas(id) {
    const clickedMovie = moviesArray.find(element => element.id === id);
    if (clickedMovie) {
        const { title, genres, overview, release_date, runtime, budget, revenue } = clickedMovie;
        const genresList = genres.map(genre => genre.name).join(' - '); // Géneros concatenados
        const year = release_date.slice(0, 4); // Año de lanzamiento

        // Crear el contenido del offcanvas con la información
        offcanvasTitle.innerHTML = `<h5 class="offcanvas-title" id="offcanvasMovieLabel">${title}</h5>`;
        offcanvasBody.innerHTML = `
            <div> 
                <small class="text-muted">${genresList}</small> 
                <br>${overview}
            </div>
            <div class="dropdown mt-3">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    More
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item disabled" href="#">Year: ${year}</a></li>
                    <li><a class="dropdown-item disabled" href="#">Runtime: ${runtime} min</a></li>
                    <li><a class="dropdown-item disabled" href="#">Budget: USD ${budget}</a></li>
                    <li><a class="dropdown-item disabled" href="#">Revenue: USD ${revenue}</a></li>
                </ul>
            </div>
        `;
    }
}

// Función para obtener los datos JSON
let getJSONData = function(url) {
    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(response => {
            return { status: 'ok', data: response };
        })
        .catch(error => {
            return { status: 'error', data: error };
        });
};
