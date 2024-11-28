// Hae satunnainen kissarotu
document.getElementById("getRandomBreedButton").addEventListener("click", function() {
    fetch("https://api.thecatapi.com/v1/breeds")// toi alempi linkki ei suostu toimimaa tässä
        .then(response => response.json())
        .then(data => {
            const randomBreed = data[Math.floor(Math.random() * data.length)].name;
            document.getElementById("catBreed").textContent = `Satunnainen kissarotu: ${randomBreed}`;
        })
        .catch(error => console.log("Virhe haettaessa rotua", error));
});

// Hae satunnainen kissafakta
document.getElementById("getCatFactButton").addEventListener("click", function() {
    fetch("https://catfact.ninja/fact")
        .then(response => response.json())
        .then(data => {
            const fact = data.fact;
            document.getElementById("catFact").textContent = `Satunnainen kissan fakta: ${fact}`;
        })
        .catch(error => console.log("Virhe haettaessa faktaa", error));
});
