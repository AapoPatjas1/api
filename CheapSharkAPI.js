const API_URL = "https://www.cheapshark.com/api/1.0";

async function searchGames() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const response = await fetch(`${API_URL}/games?title=${query}&limit=6`);
    const games = await response.json();

    const resultsContainer = document.getElementById("gameResults");
    resultsContainer.innerHTML = ""; // Tyhjennä edelliset tulokset

    games.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
            <img src="${game.thumb}" alt="${game.external}" />
            <h3>${game.external}</h3>
        `;
        card.onclick = () => showGameDetails(game.gameID); // Lähetä gameID funktiolle
        resultsContainer.appendChild(card);
    });
}

async function showGameDetails(gameID) {
    const response = await fetch(`${API_URL}/games?id=${gameID}`);
    const gameDetailsData = await response.json();

    const detailsContainer = document.getElementById("gameDetails");
    detailsContainer.innerHTML = `
        <h2>${gameDetailsData.info.title}</h2>
        <img src="${gameDetailsData.info.thumb}" alt="${gameDetailsData.info.title}" />
        <p><strong>Alin hinta koskaan:</strong> ${gameDetailsData.cheapestPriceEver.price} USD</p>
        <h3>Nykyiset tarjoukset</h3>
    `;

    // Näytetään tarjoukset
    gameDetailsData.deals.forEach(deal => {
        const offer = document.createElement("div");
        offer.className = "offer";
        offer.innerHTML = `
            <span>${deal.storeID}</span>
            <img src="https://www.cheapshark.com/img/stores/icons/${deal.storeID}.png" alt="Store logo">
            <span><strong>Tarjoushinta:</strong> ${deal.price} USD</span>
            <span><del>${deal.retailPrice} USD</del></span>
        `;
        detailsContainer.appendChild(offer);
    });

    detailsContainer.style.display = "block";
}
