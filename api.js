const locationButton = document.getElementById('locationButton'); 
const resultDiv = document.getElementById('result');

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                resultDiv.innerHTML = `
                    <p>Leveysaste: ${latitude}</p>
                    <p>Pituusaste: ${longitude}</p>
                `;
            },
            (error) => {
                resultDiv.innerHTML = `<p>Virhe sijainnin haussa: ${error.message}</p>`;
            }
        );
    } else {
        resultDiv.innerHTML = "<p>Selaimesi ei tue sijainnin hakemista.</p>";
    }
});
