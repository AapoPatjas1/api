document.getElementById("getDogImageButton").addEventListener("click", function () {
    const breed = document.getElementById("dogBreed").value;

    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch dog image");
            }
            return response.json();
        })
        .then(data => {
            const imageUrl = data.message;
            const imgElement = document.getElementById("dogImage");
            imgElement.src = imageUrl;
            imgElement.style.display = "block"; 
        })
        .catch(error => {
            console.error("Error fetching the dog image:", error);
            alert("Failed to fetch dog image. Please try again.");
        });
});
