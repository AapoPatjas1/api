// server.js

const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

// Serve static files (e.g., HTML, CSS, JS) from the "public" folder
app.use(express.static('public'));

// API route to fetch player data
app.get('/api/player/:tag', async (req, res) => {
    const playerTag = req.params.tag;
    const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhmODNlZjg5LTdjZGUtNDY3Zi04YjgzLWViMTI0NThkZDgyYiIsImlhdCI6MTczMzIxMzc2MCwic3ViIjoiZGV2ZWxvcGVyLzhhNDM1MTE5LTBhODQtMGQzNC0zNWRmLWIxNzlmMjZhMWJhZiIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTk1LjE0OC4zOS41MCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.r4PUMGVFnmlHkaXNYtUu0CE1webEoYFEYTMSxkmv5YuRqdysoV8YZf8KTed8aLzckICnIRb-nwDvcq2V2DzJJA'; // Replace with your actual API key

    const url = `https://api.brawlstars.com/v1/players/%23${playerTag}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        
        // Return the data to the frontend
        if (response.ok) {
            res.json(data);
        } else {
            res.status(400).json({ error: 'Player not found or invalid API request' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch player data' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
