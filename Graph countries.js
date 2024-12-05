const API_URL = 'https://countries.trevorblades.com/';

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  return result.data;
}

async function searchCountry() {
  const countryCode = document.getElementById('countryCode').value.trim().toUpperCase();
  if (!countryCode) return alert('Syötä maan koodi!');

  const query = `
    query getCountry($code: ID!) {
      country(code: $code) {
        name
        capital
      }
    }
  `;

  const data = await fetchGraphQL(query, { code: countryCode });
  const country = data.country;

  const resultContainer = document.getElementById('result');

  if (!country) {
    resultContainer.innerHTML = `<p>Maatunnuksella "${countryCode}" ei löytynyt maata.</p>`;
    return;
  }

  resultContainer.innerHTML = `
    <h2>${country.name}</h2>
    <p><strong>Pääkaupunki:</strong> ${country.capital || 'Ei pääkaupunkia saatavilla'}</p>
  `;
}
