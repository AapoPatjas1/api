const apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhmODNlZjg5LTdjZGUtNDY3Zi04YjgzLWViMTI0NThkZDgyYiIsImlhdCI6MTczMzIxMzc2MCwic3ViIjoiZGV2ZWxvcGVyLzhhNDM1MTE5LTBhODQtMGQzNC0zNWRmLWIxNzlmMjZhMWJhZiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTk1LjE0OC4zOS41MCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.r4PUMGVFnmlHkaXNYtUu0CE1webEoYFEYTMSxkmv5YuRqdysoV8YZf8KTed8aLzckICnIRb-nwDvcq2V2DzJJA"; // Vaihda tähän oma API-avaimesi

async function getPlayerStats() {
    const playerTag = document.getElementById('playerTag').value.trim();
    
    if (!playerTag || !playerTag.startsWith("#")) {
        document.getElementById('result').innerHTML = "Syötä oikea pelitunnus, joka alkaa # merkillä.";
        return;
    }
    
    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url1 = `https://api.brawlstars.com/v1/players/${playerTag}`;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy-URL
    const targetUrl = 'https://api.brawlstars.com/v1/players/%23' + '20CQLYP2C'; // Pelaajan URL
    
    const url = proxyUrl + targetUrl; // Yhdistetään proxy ja kohde-URL
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Virhe:', error));

        const data = await response.json();

        if (data.error) {
            document.getElementById('result').innerHTML = `Virhe: ${data.error.message}`;
        } else {
            document.getElementById('result').innerHTML = `
                <h2>Pelaajan Tiedot:</h2>
                <p><strong>Nimi:</strong> ${data.name}</p>
                <p><strong>Tunnus:</strong> ${data.tag}</p>
                <p><strong>Leveleitä:</strong> ${data.trophies}</p>
                <p><strong>Pelityyli:</strong> ${data.club ? data.club.name : 'Ei klubia'}</p>
                <p><strong>Pelaajataso:</strong> ${data.expLevel}</p>
            `;
        }
}
