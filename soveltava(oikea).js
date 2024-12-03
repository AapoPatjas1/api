const fetchCovidData = async () => {
    const country = document.getElementById("countryInput").value.trim();
    const url = `https://disease.sh/v3/covid-19/countries/${country}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Display data in the results section
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = `
            <p><strong>Country:</strong> ${data.country}</p>
            <p><strong>Cases:</strong> ${data.cases}</p>
            <p><strong>Deaths:</strong> ${data.deaths}</p>
            <p><strong>Recovered:</strong> ${data.recovered}</p>
            <img src="${data.countryInfo.flag}" alt="Flag of ${data.country}" style="width:100px;">
        `;
    } catch (error) {
        console.error("Error fetching COVID data:", error.message);
        document.getElementById("results").innerHTML = `<p style="color:red;">Error fetching data: ${error.message}</p>`;
    }
};
