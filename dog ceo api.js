document.getElementById("getDogImageButton").addEventListener("click", function() {
    const breed = document.getElementById("dogBreed").value;

    fetch(`https://dog.ceo/api/breeds/image/random?breed=${breed}`)
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.message;
            const imgElement = document.getElementById("dogImage");
            imgElement.src = imageUrl;
            imgElement.style.display = "block"; 
        })
        .catch(error => {
            console.error("Virhe haettaessa kuvaa", error);
        });
});
