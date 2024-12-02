const API_BASE = 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range';

async function analyzeMarket() {
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
    }

    const from = Math.floor(new Date(startDate).getTime() / 1000);
    const to = Math.floor(new Date(endDate).getTime() / 1000) + 3600;

    try {
        const response = await fetch(`${API_BASE}?vs_currency=eur&from=${from}&to=${to}`);
        const data = await response.json();

        if (!data.prices || data.prices.length === 0) {
            document.getElementById('results').innerText = 'No data available for the selected date range.';
            return;
        }

        const prices = data.prices.map(([timestamp, price]) => ({ date: new Date(timestamp).toISOString().split('T')[0], price }));
        const volumes = data.total_volumes.map(([timestamp, volume]) => ({ date: new Date(timestamp).toISOString().split('T')[0], volume }));

        displayResults(prices, volumes);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch data. Please try again.');
    }
}

function displayResults(prices, volumes) {
    const longestBearishTrend = findLongestBearishTrend(prices);
    const highestVolume = findHighestVolume(volumes);
    const bestBuySell = findBestBuySellDays(prices);

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Analysis Results</h2>
        <p><strong>Longest Bearish Trend:</strong> ${longestBearishTrend} days</p>
        <p><strong>Highest Volume:</strong> ${highestVolume.date} (${highestVolume.volume.toFixed(2)} EUR)</p>
        <p><strong>Best Buy/Sell Days:</strong> ${
            bestBuySell
                ? `Buy on ${bestBuySell.buyDate} and Sell on ${bestBuySell.sellDate}`
                : 'No profitable opportunities'
        }</p>
    `;
}

function findLongestBearishTrend(prices) {
    let maxStreak = 0, currentStreak = 0;

    for (let i = 1; i < prices.length; i++) {
        if (prices[i].price < prices[i - 1].price) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    return maxStreak;
}

function findHighestVolume(volumes) {
    return volumes.reduce((max, day) => (day.volume > max.volume ? day : max), volumes[0]);
}

function findBestBuySellDays(prices) {
    let minPrice = prices[0].price;
    let minDate = prices[0].date;
    let maxProfit = 0;
    let bestBuyDate = null;
    let bestSellDate = null;

    for (let i = 1; i < prices.length; i++) {
        const profit = prices[i].price - minPrice;

        if (profit > maxProfit) {
            maxProfit = profit;
            bestBuyDate = minDate;
            bestSellDate = prices[i].date;
        }

        if (prices[i].price < minPrice) {
            minPrice = prices[i].price;
            minDate = prices[i].date;
        }
    }

    return maxProfit > 0 ? { buyDate: bestBuyDate, sellDate: bestSellDate } : null;
}
