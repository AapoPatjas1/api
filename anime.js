// Haku animeja
async function searchAnime() {
    const searchQuery = document.getElementById("searchInput").value;
    const type = document.getElementById("animeType").value;
    const status = document.getElementById("animeStatus").value;
    const rating = document.getElementById("animeRating").value;
    const minScore = document.getElementById("minScore").value || 0;
    const maxScore = document.getElementById("maxScore").value || 10;

    const url = `https://api.jikan.moe/v4/anime?q=${searchQuery}&type=${type}&status=${status}&rating=${rating}&score[gte]=${minScore}&score[lte]=${maxScore}&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayAnimeResults(data.data.slice(0, 6)); 
    } catch (error) {
        console.error("Error fetching anime data:", error);
    }
}

function displayAnimeResults(animes) {
    const animeResults = document.getElementById("animeResults");
    animeResults.innerHTML = ""; 

    animes.forEach(anime => {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.onclick = () => showAnimeDetails(anime.mal_id);

        animeCard.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <p>${anime.title_japanese}</p>
        `;
        animeResults.appendChild(animeCard);
    });
}

async function showAnimeDetails(id) {
    const url = `https://api.jikan.moe/v4/anime/${id}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayAnimeDetailPage(data.data);
    } catch (error) {
        console.error("Error fetching anime details:", error);
    }
}

function displayAnimeDetailPage(anime) {
    const htmlContent = `
        <h2>${anime.title} (${anime.title_japanese})</h2>
        <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
        <p><strong>Synopsis:</strong> ${anime.synopsis}</p>
        <p><strong>Tyyppi:</strong> ${anime.type}</p>
        <p><strong>Jaksojen määrä:</strong> ${anime.episodes !== null ? anime.episodes : "Tieto ei saatavilla"}</p>
        <p><strong>Status:</strong> ${anime.status}</p>
        <p><strong>Julkaisuaika:</strong> ${anime.aired.string}</p>
        <p><strong>Ikäraja:</strong> ${anime.rating}</p>
        <p><strong>Score:</strong> ${anime.score}</p>
        <h3>Ehdotuksia:</h3>
        <div id="animeSuggestions"></div>
    `;
    document.body.innerHTML = htmlContent;

    // Ehdotuksia
    const recommendations = anime.recommendations.slice(0, 4); 
    const suggestionsDiv = document.getElementById("animeSuggestions");
    recommendations.forEach(rec => {
        const recCard = document.createElement("div");
        recCard.classList.add("anime-card");
        recCard.onclick = () => showAnimeDetails(rec.entry.mal_id);

        recCard.innerHTML = `
            <img src="${rec.entry.images.jpg.image_url}" alt="${rec.entry.title}">
            <h3>${rec.entry.title}</h3>
            <p>${rec.entry.title_japanese}</p>
        `;
        suggestionsDiv.appendChild(recCard);
    });
}

async function getRandomAnime() {
    const url = `https://api.jikan.moe/v4/random/anime`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        showAnimeDetails(data.data.mal_id);
    } catch (error) {
        console.error("Error fetching random anime:", error);
    }
}

async function getCurrentlyAiringAnime() {
    const url = `https://api.jikan.moe/v4/anime?status=airing&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayCurrentlyAiringAnime(data.data.slice(0, 8));
    } catch (error) {
        console.error("Error fetching currently airing anime:", error);
    }
}

function displayCurrentlyAiringAnime(animes) {
    const currentlyAiring = document.getElementById("currentlyAiring");
    currentlyAiring.innerHTML = "";

    animes.forEach(anime => {
        const animeCard = document.createElement("div");
        animeCard.classList.add("anime-card");
        animeCard.onclick = () => showAnimeDetails(anime.mal_id);

        animeCard.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <h3>${anime.title}</h3>
            <p>${anime.title_japanese}</p>
        `;
        currentlyAiring.appendChild(animeCard);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getCurrentlyAiringAnime();
});
