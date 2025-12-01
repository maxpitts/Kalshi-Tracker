// server.js - Backend proxy for Unusual Markets
// Keeps your API keys secure server-side

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve the HTML file

// API Configuration from environment variables
const KALSHI_EMAIL = process.env.KALSHI_EMAIL;
const KALSHI_PASSWORD = process.env.KALSHI_PASSWORD;

// Cache for Kalshi token
let kalshiToken = null;
let tokenExpiry = null;

// Login to Kalshi and get token
async function getKalshiToken() {
    // Return cached token if still valid
    if (kalshiToken && tokenExpiry && Date.now() < tokenExpiry) {
        return kalshiToken;
    }

    try {
        const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: KALSHI_EMAIL,
                password: KALSHI_PASSWORD
            })
        });

        if (!response.ok) {
            throw new Error(`Kalshi login failed: ${response.status}`);
        }

        const data = await response.json();
        kalshiToken = data.token;
        
        // Token typically valid for 24 hours, cache for 23 hours to be safe
        tokenExpiry = Date.now() + (23 * 60 * 60 * 1000);
        
        return kalshiToken;
    } catch (error) {
        console.error('Kalshi authentication error:', error);
        throw error;
    }
}

// Endpoint: Fetch Kalshi markets
app.get('/api/kalshi/markets', async (req, res) => {
    try {
        if (!KALSHI_EMAIL || !KALSHI_PASSWORD) {
            return res.json({ 
                success: false, 
                message: 'Kalshi credentials not configured',
                markets: [] 
            });
        }

        const token = await getKalshiToken();
        
        const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets?limit=100&status=active', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Kalshi API error: ${response.status}`);
        }

        const data = await response.json();
        const markets = data.markets || [];

        // Transform to our format
        const transformedMarkets = markets.map(m => ({
            id: m.ticker,
            platform: 'Kalshi',
            title: m.title || 'Unknown Market',
            category: m.category || 'Other',
            currentPrice: ((m.last_price || 0) * 100).toFixed(1),
            volume24h: m.volume_24h || 0,
            trades24h: m.open_interest || 0,
            url: `https://kalshi.com/markets/${m.ticker}`
        }));

        res.json({
            success: true,
            markets: transformedMarkets
        });

    } catch (error) {
        console.error('Error fetching Kalshi markets:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            markets: []
        });
    }
});

// Endpoint: Fetch all markets (Kalshi only)
app.get('/api/markets', async (req, res) => {
    try {
        // Fetch only Kalshi markets
        const kalshiRes = await fetch(`http://localhost:${PORT}/api/kalshi/markets`).then(r => r.json());
        
        let allMarkets = kalshiRes.markets || [];

        // Calculate price changes, volume changes, and unusual activity
        // Note: This is simplified - in production you'd track historical data
        allMarkets = allMarkets.map(m => {
            // Simulate price and volume changes (replace with real historical data)
            const priceChange = (Math.random() * 30 - 15).toFixed(1);
            const volumeChange = (Math.random() * 350 - 20).toFixed(0);
            
            const isUnusual = Math.abs(parseFloat(volumeChange)) > 100 || 
                             Math.abs(parseFloat(priceChange)) > 10;
            
            const hotnessScore = Math.min(100, Math.floor(
                (Math.abs(parseFloat(volumeChange)) / 2) + 
                (Math.abs(parseFloat(priceChange)) * 3)
            ));

            return {
                ...m,
                priceChange,
                volumeChange,
                unusual: isUnusual,
                hotnessScore
            };
        });

        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            count: allMarkets.length,
            markets: allMarkets
        });

    } catch (error) {
        console.error('Error fetching markets:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            markets: []
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        kalshiConfigured: !!(KALSHI_EMAIL && KALSHI_PASSWORD)
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║         Unusual Markets API Server (Kalshi)               ║
║                                                          ║
║  Server running on: http://localhost:${PORT}              ║
║                                                          ║
║  Endpoints:                                              ║
║  GET  /api/markets         - All Kalshi markets          ║
║  GET  /api/kalshi/markets  - Kalshi markets              ║
║  GET  /health              - Health check                ║
║                                                          ║
║  Frontend: http://localhost:${PORT}                       ║
╚══════════════════════════════════════════════════════════╝

Kalshi credentials: ${KALSHI_EMAIL && KALSHI_PASSWORD ? '✓ Configured' : '✗ Not configured'}

Ready to serve markets! 🚀
    `);
});
