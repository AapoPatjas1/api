document.getElementById("generate-quote").addEventListener("click", function() {
    // Hae satunnainen ohjelmointivitsi
    fetch('https://programming-quotesapi.vercel.app/api/random')
        .then(response => response.json())  // Käsitellään API:n vastaus JSON-muodossa
        .then(data => {
            console.log(data);  // Tarkistetaan, mitä API palauttaa konsolissa

            // Tarkistetaan, että vitsi löytyy vastauksesta
            if (data && data.en && data.author) {
                // Näytetään satunnainen vitsi HTML-elementissä
                document.getElementById("quote").innerText = `"${data.en}" - ${data.author}`;
            } else {
                // Jos vitsiä ei löydy, näytetään virheviesti
                document.getElementById("quote").innerText = "Ei saatu vitsiä, kokeile myöhemmin!";
            }
        })
        .catch(error => {
            console.error('Virhe vitsin hakemisessa:', error);
            document.getElementById("quote").innerText = "Virhe yhteydessä, yritä myöhemmin!";
        });

    // Hae useampi ohjelmointivitsi (bulk API)
    fetch('https://programming-quotesapi.vercel.app/api/bulk')//consolelogissa vitsit 
        .then((response) => response.json())
        .then((quotes) => {
            const quotesList = document.getElementById("quotes-list");
            quotesList.innerHTML = "";  

          
            if (quotes && quotes.length > 0) {
                quotes.forEach((quote) => {
                   
                    const listItem = document.createElement("li");
                    listItem.innerText = `"${quote.en}" - ${quote.author}`;
                    quotesList.appendChild(listItem);  // Lisää se listaan
                });
            } else {
                quotesList.innerHTML = "Ei saatu useita vitsauksia, kokeile myöhemmin!";
            }
        })
        .catch((error) => {
            console.error("Virhe useiden vitsien hakemisessa:", error);
            document.getElementById("quotes-list").innerText = "Virhe useiden vitsien hakemisessa!";
        });
});
