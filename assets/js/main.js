let allMovies = [];
let currentPage = 1;
let rowsPerPage = 8;
// Get Genre List
getGenreList();
function getGenreList() {
    const genreMenuList = document.getElementById('genreMenuList');
    const genreSelect = document.getElementById('genre');
    fetch('https://69f2cbc1b15130b9735329a9.mockapi.io/api/genres')
        .then(response => response.json())
        .then(genres => {            
            genreMenuList.innerHTML = `
                <li><a class="dropdown-item" href="#" onclick="getAllMovies()">All Genres</a></li>
                <li><hr class="dropdown-divider"></li>
            `;
            genres.forEach(genre => {
                genreMenuList.innerHTML += `
                    <li><a class="dropdown-item" href="#" onclick="filterMovieByGenre('${genre.name}')">${genre.name}</a></li>
                `;
                genreSelect.innerHTML += `<option value="${genre.name}">${genre.name}</option>`;
            });
        });
}

// Filter Movie By Genre
async function filterMovieByGenre(genreName) {
    await fetch('https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies')
        .then(response => response.json())
        .then(movies => {
            allMovies = movies.filter(movie => movie.genre === genreName);
            currentPage = 1;
            displayPaginationMovies();
        });
}

// Start rating
function getStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            starsHtml += '<i class="bi bi-star-fill text-warning me-1"></i>';
        } else {
            starsHtml += '<i class="bi bi-star text-secondary me-1"></i>';
        }
    }
    return starsHtml;
}

// Display Movies
function displayMovies(movies) {
    const movieContainer = document.getElementById('movieCard');
    movieContainer.innerHTML = "";
    if (movies.length === 0) {
        movieContainer.innerHTML = `<div class="col-12 text-center text-white"><h3>No movies found in this genre.</h3></div>`;
        return;
    }
    movies.forEach(movie => {
        const myCard = `
            <div class="col-6 col-md-4 col-xl-3">
                <div class="movie-card">
                    <div class="card-actions">
                        <button class="btn-action edit" onclick="openEditModal(${movie.id})"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn-action delete" onclick="openDeleteModal(${movie.id}, '${movie.title}')"><i class="bi bi-trash"></i></button>
                    </div>
                    <div onclick="detailMovie(${movie.id})" style="cursor: pointer;">
                        <div class="poster-wrapper" style="position: relative; width: 100%; height: 350px; overflow: hidden;">
                            <img src="${movie.poster}" alt="${movie.title}" style="width: 100%; height: 100%; object-fit: cover;">
                            <div class="rating-badge" style="position: absolute; top: 10px; right: 10px;">
                                <i class="bi bi-star-fill me-1"></i>${movie.rating}
                            </div>
                        </div>
                        <div class="p-3">
                            <h6 class="fw-bold mb-1 text-truncate">${movie.title}</h6>
                            <p class="small text-white mb-0">${movie.genre}</p>
                            <div class="movie-stars">
                                ${getStars(movie.rating)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        movieContainer.innerHTML += myCard;
    });
}

// get Movies 
getAllMovies();
async function getAllMovies() {
    await fetch(' https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies')
    .then(response => response.json())
    .then(movies => {
        allMovies = movies;
        displayPaginationMovies();
    });
}

// Pagination
function displayPaginationMovies() {
    const movieContainer = document.getElementById('movieCard');
    movieContainer.innerHTML = "";
    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let paginatedItems = allMovies.slice(start, end);
    displayMovies(paginatedItems); 
    setupPagination();
}
function setupPagination() {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = "";

    let pageCount = Math.ceil(allMovies.length / rowsPerPage);
    for (let i = 1; i <= pageCount; i++) {
        let li = document.createElement('li');
        li.className = 'page-item';
        if (i === currentPage) {
            li.classList.add('active');
        }
        li.innerHTML = `<button class="page-link">${i}</button>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            displayPaginationMovies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationElement.appendChild(li);
    }
}

// Open Modal Create Movie
function openAddModal() {
    const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
    const modalTitle = document.getElementById('modalTitle').textContent = "Add Movie";
    document.getElementById('btnSave').textContent = "Create Movie";
    document.getElementById('title').value = "";
    document.getElementById('genre').value = "";
    document.getElementById('rating').value = "";
    document.getElementById('description').value = "";
    document.getElementById('releaseDate').value = "";
    document.getElementById('posterFile').value = "";

    clearAllErrors();
    movieModal.show();
}

// Open Modal Update Movie
let editId = null;
let originalMovieData = {};
async function openEditModal(id) {
    const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
    editId = id;
    await fetch(`https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies/${id}`)
        .then(response => response.json())
        .then(movie => {
            const modalTitle = document.getElementById('modalTitle').textContent = "Edit Movie";
            const btnSave = document.getElementById('btnSave').textContent = "Update Movie";
            const title = document.getElementById('title').value = movie.title;
            const genre = document.getElementById('genre').value = movie.genre;
            const rating = document.getElementById('rating').value = Number(movie.rating);
            const description = document.getElementById('description').value = movie.description;
            const releaseDate = document.getElementById('releaseDate').value = movie.releaseDate;
            const poster = document.getElementById('posterFile').value = movie.poster;
            originalMovieData ={
                title: movie.title,
                genre: movie.genre,
                rating: Number(movie.rating),
                description: movie.description,
                releaseDate: movie.releaseDate,
                poster: movie.poster
            }
            document.getElementById('btnSave').disabled = true;
        });

    clearAllErrors();
    movieModal.show();
}

// Disabled Update Button
function checkIfDataChanged() {
    const modalTitle = document.getElementById('modalTitle').textContent;
    if (modalTitle === "Add Movie") {
        document.getElementById('btnSave').disabled = false;
        return;
    }
    const currentData = getMoviePayload();
    const isChanged = 
        currentData.title !== originalMovieData.title ||
        currentData.genre !== originalMovieData.genre ||
        currentData.rating !== originalMovieData.rating ||
        currentData.description !== originalMovieData.description ||
        currentData.releaseDate !== originalMovieData.releaseDate ||
        currentData.poster !== originalMovieData.poster;
    document.getElementById('btnSave').disabled = !isChanged;
}

// Save button  
function saveMovie() {
    const modalTitle = document.getElementById('modalTitle').textContent;
    if (modalTitle === "Add Movie") {
        createMovie();
    } else if (modalTitle === "Edit Movie") {
        updateMovie();
    }
}

// detail Movie 
function detailMovie(id) {
    window.location.href = `pages/detailMovie.html?id=${id}`;
}

// Get Movie Payload
function getMoviePayload() {
    return {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        rating: Number(document.getElementById('rating').value),
        releaseDate: document.getElementById('releaseDate').value,
        poster: document.getElementById('posterFile').value.trim()
    };
}

// Validate Movie Form
function validateMovieForm() {
    const fields = ['title', 'genre', 'rating', 'description', 'releaseDate', 'posterFile'];
    let isValid = true;
    clearAllErrors();

    const title = document.getElementById('title').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const rating = document.getElementById('rating').value;
    const description = document.getElementById('description').value.trim();
    const releaseDate = document.getElementById('releaseDate').value;
    const poster = document.getElementById('posterFile').value.trim();

    if (!title) {
        showError('title', 'Please enter a movie title!');
        isValid = false;
    }
    if (!genre) {
        showError('genre', 'Please select a movie genre!');
        isValid = false;
    }
    if (!rating || rating < 0 || rating > 5) {
        showError('rating', 'Rating must be between 0 and 5!');
        isValid = false;
    }
    if (!poster) {
        showError('posterFile', 'Please enter a poster image URL!');
        isValid = false;
    }
    if (!description) {
        showError('description', 'Please enter a movie description!');
        isValid = false;
    }
    if (!releaseDate) {
        showError('releaseDate', 'Please select a release date!');
        isValid = false;
    }
    return isValid;
}

// Show error
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorMsg = document.getElementById(inputId + 'Error');
    if (input) input.classList.add('is-invalid');
    if (errorMsg) errorMsg.innerText = message;
}

// Clear All Errors
function clearAllErrors() {
    const fields = ['title', 'genre', 'rating', 'description', 'releaseDate', 'posterFile'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        const errorMsg = document.getElementById(field + 'Error');
        if (input) input.classList.remove('is-invalid');
        if (errorMsg) errorMsg.innerText = '';
    });
}

// Real-time Validation
function initRealTimeValidation() {
    const fields = ['title', 'genre', 'rating', 'description', 'releaseDate', 'posterFile'];
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', function() {
                if (this.value.trim() !== "") {
                    this.classList.remove('is-invalid');
                    const errorMsg = document.getElementById(field + 'Error');
                    if (errorMsg) errorMsg.innerText = '';
                }
                checkIfDataChanged();
            });
        }
    });
}
initRealTimeValidation();

// Create Movie 
async function createMovie() {
    if (!validateMovieForm()) return;
    const payload = getMoviePayload();

    await fetch(' https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            closeModal();
            if (data) {
                reloadPage();
            } else {
                console.log('Failed to create movie. Please try again.');
            }
        })
}

// Update Movie 
async function updateMovie() {
    if (!validateMovieForm()) return;
    const payload = getMoviePayload();

    await fetch(`https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies/${editId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            closeModal();
            if (data) {
                reloadPage();
            } else {
                console.log('Failed to update movie. Please try again.');
            }
        });   
}

// close modal 
function closeModal() {
    const modalElement = document.getElementById('movieModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
}

// Delete Movie 
let deleteMovieId = null;
function openDeleteModal(id, title) {
    deleteMovieId = id;
    document.getElementById('deleteMovieName').innerText = title;
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Confirm Delete 
async function confirmDelete() {
    await fetch(`https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies/${deleteMovieId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: deleteMovieId })
    })
        .then(response => response.json())
        .then(data => {
            reloadPage();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Reload Page 
function reloadPage() {
    setTimeout(() => {
        location.reload();
    }, 100);
}