// Funktio, joka suorittaa animehaun Jikan API:lla
function searchAnime() {
    const animeName = document.getElementById('animeInput').value;

    // Tarkistetaan, että käyttäjä on syöttänyt nimen
    if (!animeName) {
        alert('Syötä anime-nimi!');
        return;
    }

    // Rakennetaan URL API-kutsulle
    const url = `https://api.jikan.moe/v4/anime?q=${animeName}&limit=5`;

    // Suoritetaan fetch-pyyntö Jikan API:lle
    fetch(url)
        .then(response => response.json()) // Muutetaan vastaus JSON-muotoon
        .then(data => {
            // Näytetään hakutulokset
            const resultsContainer = document.getElementById('animeResults');
            resultsContainer.innerHTML = ''; // Tyhjennetään aiemmat tulokset

            // Käydään läpi tulokset ja luodaan HTML niistä
            data.data.forEach(anime => {
                const animeCard = document.createElement('div');
                animeCard.classList.add('anime-card');

                animeCard.innerHTML = `
                    <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
                    <h3>${anime.title}</h3>
                    <p>${anime.synopsis ? anime.synopsis.substring(0, 150) + '...' : 'Ei saatavilla synopsista'}</p>
                    <a href="${anime.url}" target="_blank">Lue lisää</a>
                `;

                resultsContainer.appendChild(animeCard);
            });
        })
        .catch(error => {
            console.error('Virhe haettaessa animea:', error);
            alert('Virhe haettaessa animea');
        });
}
