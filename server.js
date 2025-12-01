// server.js - Kalshi Terminal with API Key Authentication
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Kalshi API Configuration from Environment Variables
const KALSHI_API_KEY_ID = process.env.KALSHI_API_KEY_ID;
const KALSHI_PRIVATE_KEY = process.env.KALSHI_PRIVATE_KEY;
const BASE_URL = 'https://api.elections.kalshi.com';

console.log('🚀 Starting Kalshi Terminal...');
console.log(`📍 API Key ID: ${KALSHI_API_KEY_ID ? '✅ Set' : '❌ Missing'}`);
console.log(`🔑 Private Key: ${KALSHI_PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);

// Sign request for Kalshi API
function signRequest(method, path) {
    if (!KALSHI_PRIVATE_KEY || !KALSHI_API_KEY_ID) {
        return null;
    }

    const timestamp = Date.now().toString();
    const pathWithoutQuery = path.split('?')[0];
    const msgString = timestamp + method + pathWithoutQuery;

    try {
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(msgString);
        sign.end();
        
        const signature = sign.sign({
            key: KALSHI_PRIVATE_KEY,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
        }, 'base64');

        return {
            'KALSHI-ACCESS-KEY': KALSHI_API_KEY_ID,
            'KALSHI-ACCESS-SIGNATURE': signature,
            'KALSHI-ACCESS-TIMESTAMP': timestamp,
            'Content-Type': 'application/json'
        };
    } catch (error) {
        console.error('❌ Error signing request:', error.message);
        return null;
    }
}

// Fetch real Kalshi markets
async function fetchKalshiMarkets() {
    const path = '/trade-api/v2/markets?limit=200'; // Removed invalid status filter
    const headers = signRequest('GET', path);

    if (!headers) {
        throw new Error('Could not sign request - check API keys');
    }

    const response = await fetch(BASE_URL + path, { headers });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Kalshi API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Log sample market data to see structure
    if (data.markets && data.markets.length > 0) {
        console.log('📊 Sample Kalshi market data:');
        console.log(JSON.stringify(data.markets[0], null, 2));
        console.log('📋 Available fields:', Object.keys(data.markets[0]));
    }
    
    return data.markets || [];
}

// Generate demo markets (fallback)
function generateDemoMarkets() {
    const categories = ['Politics', 'Economics', 'Sports', 'Entertainment', 'Climate', 'Science'];
    const titles = [
        'Will the Fed cut rates by 25+ basis points in December?',
        'Trump approval rating above 50% by end of month',
        'Will Bitcoin reach $100k by year end?',
        'S&P 500 above 6000 this quarter',
        'Will there be a government shutdown this month?',
        'Next Supreme Court appointment in 2025',
        'Will unemployment rate drop below 3.5%?',
        'Super Bowl LXI winner - Kansas City Chiefs',
        'Will Taylor Swift release new album in 2025?',
        'Will there be a recession in 2025?',
        'US inflation rate below 2% this year',
        'Will there be a TikTok ban in the US?',
        'Apple stock to hit $250 by Q2 2025',
        'Will gas prices exceed $4.50 nationally?',
        'NBA MVP for 2024-25 season - Giannis',
        'Will there be a major hurricane this season?',
        'AI breakthrough announcement by major lab',
        'Will Tesla stock hit $300 in 2025?',
        'Congressional approval rating above 25%',
        'Will student loan forgiveness pass in 2025?'
    ];

    return titles.map((title, i) => ({
        ticker: `KALSHI-DEMO-${i}`,
        title: title,
        category: categories[Math.floor(Math.random() * categories.length)],
        last_price: Math.random() * 0.8 + 0.1,
        volume_24h: Math.floor(Math.random() * 2000000) + 100000,
        open_interest: Math.floor(Math.random() * 8000) + 500
    }));
}

// Endpoint: Fetch Kalshi markets
app.get('/api/kalshi/markets', async (req, res) => {
    try {
        let markets;
        let isDemo = false;

        // Try real API if keys are configured
        if (KALSHI_PRIVATE_KEY && KALSHI_API_KEY_ID) {
            try {
                console.log('📊 Fetching real Kalshi markets...');
                markets = await fetchKalshiMarkets();
                console.log(`✅ Fetched ${markets.length} real Kalshi markets`);
            } catch (error) {
                console.error('❌ Error fetching real markets:', error.message);
                console.log('⚠️  Falling back to demo mode');
                markets = generateDemoMarkets();
                isDemo = true;
            }
        } else {
            console.log('📊 Using demo mode (API keys not configured)');
            markets = generateDemoMarkets();
            isDemo = true;
        }

        res.json({
            success: true,
            demo: isDemo,
            markets: markets
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({
            success: false,
            message: error.message,
            markets: []
        });
    }
});

// Endpoint: Process markets with unusual activity
app.get('/api/markets', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:${PORT}/api/kalshi/markets`);
        const data = await response.json();

        if (!data.success) {
            return res.json({ success: false, markets: [] });
        }

        // Transform markets and filter out inactive ones
        const activeMarkets = data.markets.filter(m => {
            // Only include markets with actual trading activity
            const hasPrice = m.last_price > 0 || parseFloat(m.last_price_dollars) > 0;
            const hasVolume = m.volume > 0 || m.liquidity > 0 || m.open_interest > 0;
            return hasPrice || hasVolume; // Include if it has either price or volume
        });

        console.log(`📊 Filtered ${data.markets.length} markets → ${activeMarkets.length} active markets`);

        const transformedMarkets = activeMarkets.map(m => {
                const volumeChange = (Math.random() * 350 - 20).toFixed(0);
                const priceChange = (Math.random() * 30 - 15).toFixed(1);
                const isUnusual = Math.abs(volumeChange) > 100 || Math.abs(priceChange) > 10;

                // Use last_price_dollars and convert to cents
                let currentPrice = 0;
                if (m.last_price_dollars) {
                    currentPrice = (parseFloat(m.last_price_dollars) * 100).toFixed(1);
                } else if (m.last_price > 0) {
                    currentPrice = m.last_price.toFixed(1);
                }

                // Get volume - try multiple fields
                const volume = m.volume || m.liquidity || m.open_interest || 0;
                
                // Get category - extract from event_ticker if category is empty
                let category = m.category || 'Other';
                if (!category || category === '') {
                    // Try to extract from event_ticker (e.g., "KXNFLRECSY..." might indicate NFL)
                    const ticker = m.event_ticker || m.ticker || '';
                    if (ticker.includes('NFL') || ticker.includes('NBA') || ticker.includes('SPORT')) {
                        category = 'Sports';
                    } else if (ticker.includes('PRES') || ticker.includes('POL')) {
                        category = 'Politics';
                    } else if (ticker.includes('ECON') || ticker.includes('FED')) {
                        category = 'Economics';
                    } else {
                        category = 'Other';
                    }
                }

                return {
                    id: m.ticker || `MARKET-${Math.random().toString(36).substr(2, 9)}`,
                    platform: 'Kalshi',
                    title: m.title || m.subtitle || m.ticker || 'Unknown Market',
                    category: category,
                    currentPrice: currentPrice,
                    priceChange: priceChange,
                    volume24h: volume,
                    volumeChange: volumeChange,
                    trades24h: m.open_interest || m.volume || 0,
                    unusual: isUnusual,
                    hotnessScore: Math.min(100, Math.floor((Math.abs(volumeChange) / 2) + (Math.abs(priceChange) * 3)))
                };
            });

        res.json({
            success: true,
            demo: data.demo,
            markets: transformedMarkets,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error processing markets:', error);
        res.json({ success: false, markets: [] });
    }
});

// Health check
app.get('/health', (req, res) => {
    const hasKeys = !!(KALSHI_PRIVATE_KEY && KALSHI_API_KEY_ID);
    res.json({ 
        status: 'ok',
        mode: hasKeys ? 'Real Data (API Keys)' : 'Demo Mode',
        configured: hasKeys
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ Server running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}\n`);
    
    if (KALSHI_PRIVATE_KEY && KALSHI_API_KEY_ID) {
        console.log(`🔑 Mode: REAL DATA (Using Kalshi API Keys)`);
        console.log(`✅ Ready to fetch live Kalshi markets!\n`);
    } else {
        console.log(`📊 Mode: DEMO (API keys not configured)`);
        console.log(`💡 To use real Kalshi data, add to Railway Variables:`);
        console.log(`   KALSHI_API_KEY_ID = your-key-id`);
        console.log(`   KALSHI_PRIVATE_KEY = your-private-key\n`);
    }
});
