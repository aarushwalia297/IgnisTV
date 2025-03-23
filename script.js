const apiKey = '3432aa9beb668198d4111edfc698b518'; // Your TMDB API Key

// Function to show the selected section
function showSection(section) {
    // Hide all sections
    const sections = ['movies', 'tvShows', 'topRated', 'searchResults'];
    sections.forEach(sectionName => {
        document.getElementById(sectionName).style.display = 'none';
    });

    // Show the selected section
    document.getElementById(section).style.display = 'block';

    // Fetch data depending on the section
    if (section === 'movies') {
        fetchTrendingMovies();
    } else if (section === 'tvShows') {
        fetchTrendingTVShows();
    } else if (section === 'topRated') {
        fetchTopRatedMovies();
        fetchTopRatedTVShows();
    }
}

// Fetch and display trending movies
function fetchTrendingMovies() {
    const apiUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const moviesContainer = document.getElementById('moviesContainer');
            moviesContainer.innerHTML = '';
            data.results.forEach(movie => {
                const movieCard = createMovieCard(movie);
                moviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

// Fetch and display trending TV shows
function fetchTrendingTVShows() {
    const apiUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tvShowsContainer = document.getElementById('tvShowsContainer');
            tvShowsContainer.innerHTML = '';
            data.results.forEach(show => {
                const showCard = createShowCard(show);
                tvShowsContainer.appendChild(showCard);
            });
        })
        .catch(error => console.error('Error fetching trending TV shows:', error));
}

// Fetch and display top-rated movies
function fetchTopRatedMovies() {
    const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const topRatedMoviesContainer = document.getElementById('topRatedMoviesContainer');
            topRatedMoviesContainer.innerHTML = '';
            data.results.forEach(movie => {
                const movieCard = createMovieCard(movie);
                topRatedMoviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => console.error('Error fetching top-rated movies:', error));
}

// Fetch and display top-rated TV shows
function fetchTopRatedTVShows() {
    const apiUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const topRatedTVShowsContainer = document.getElementById('topRatedTVShowsContainer');
            topRatedTVShowsContainer.innerHTML = '';
            data.results.forEach(show => {
                const showCard = createShowCard(show);
                topRatedTVShowsContainer.appendChild(showCard);
            });
        })
        .catch(error => console.error('Error fetching top-rated TV shows:', error));
}

// Create Movie Card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.setAttribute('onclick', `openModal(${movie.id}, 'movie')`);  // Make card clickable
    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.overview}</p>
    `;
    return card;
}

// Create Show Card
function createShowCard(show) {
    const card = document.createElement('div');
    card.classList.add('show-card');
    card.setAttribute('onclick', `openModal(${show.id}, 'tv')`);  // Make card clickable
    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
        <h3>${show.name}</h3>
        <p>${show.overview}</p>
    `;
    return card;
}

// Open modal with movie/show details
function openModal(id, type) {
    const apiUrl = type === 'movie' 
        ? `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos` 
        : `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=videos`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById('movieModal');
            const movieTitle = document.getElementById('movieTitle');
            const movieOverview = document.getElementById('movieOverview');
            const movieTrailer = document.getElementById('movieTrailer');
            const movieRating = document.getElementById('movieRating');

            movieTitle.textContent = data.title || data.name;
            movieOverview.textContent = data.overview;
            movieRating.textContent = `Rating: ${data.vote_average}`;

            // Get the trailer video
            const trailer = data.videos.results.find(video => video.type === 'Trailer');
            if (trailer) {
                movieTrailer.src = `https://www.youtube.com/embed/${trailer.key}`;
            }

            modal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching movie/show details:', error));
}

// Close Modal
function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
}

// Search Functionality
function searchContent() {
    const query = document.getElementById('searchInput').value;
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    // If query is empty, hide the search results section
    if (query.trim() === '') {
        document.getElementById('searchResults').style.display = 'none';
        return;
    }

    const searchUrl = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            searchResultsContainer.innerHTML = ''; // Clear previous search results

            if (data.results.length === 0) {
                searchResultsContainer.innerHTML = `<p>No results found</p>`;
            } else {
                data.results.forEach(result => {
                    if (result.media_type === 'movie') {
                        const movieCard = createMovieCard(result);
                        searchResultsContainer.appendChild(movieCard);
                    } else if (result.media_type === 'tv') {
                        const showCard = createShowCard(result);
                        searchResultsContainer.appendChild(showCard);
                    }
                });
            }

            // Show search results section
            document.getElementById('searchResults').style.display = 'block';
        })
        .catch(error => console.error('Error searching content:', error));
}

// Initial Call to show Movies by default
showSection('movies');
