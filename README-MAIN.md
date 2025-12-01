# 🔥 Unusual Markets - Kalshi Terminal

A beautiful, real-time terminal for tracking unusual activity on **Kalshi** prediction markets.

## ⚡ Features

- **Real-time Kalshi market tracking** 
- **Unusual activity detection** - Spot high volume spikes & price swings
- **Beautiful terminal UI** - Bloomberg-inspired design with purple/blue theme
- **Advanced filtering** - Search, sort, and filter by category
- **Live statistics** - Total volume, price movements, activity scores
- **Auto-refresh** - Updates every 5 minutes automatically

---

## 🚀 Two Ways to Deploy

### Option 1: Simple HTML (Fastest)

**Perfect for:** Quick demo, local testing, no API needed

- ✅ Single HTML file
- ✅ Open in browser, works immediately  
- ✅ Uses mock data (for demonstration)
- ❌ No real API integration

**Get Started:**
1. Open `kalshi-terminal.html` in your browser
2. Done!

[View simple version →](./kalshi-terminal.html)

---

### Option 2: Secure Backend (Recommended)

**Perfect for:** Production deployment, real data, secure API keys

- ✅ Real Kalshi market data
- ✅ Secure API key management
- ✅ Deploy to Railway, Render, Heroku
- ✅ Production-ready

**Get Started:**
1. Install Node.js
2. Run `npm install`
3. Add API keys to `.env`
4. Run `npm start`

[View backend setup guide →](./QUICKSTART-BACKEND.md)

---

## 📁 Files Included

### Simple Version
```
kalshi-terminal.html          # Standalone web app (mock data)
```

### Backend Version
```
server.js                    # Node.js API server (Kalshi only)
package.json                 # Dependencies
.env.example                 # API key template
public/index.html            # Frontend (connects to backend)
QUICKSTART-BACKEND.md        # Setup instructions
```

### Documentation
```
DEPLOYMENT-GUIDE.md          # Full deployment guide
README-MAIN.md               # This file
```

---

## 🔑 Getting Kalshi API Access

1. Sign up at https://kalshi.com
2. Use your email and password
3. No API key needed - the backend logs in for you

---

## 🎨 Design Features

**Terminal Aesthetic:**
- Animated grid background
- Retro scanline effect  
- Purple/blue neon accents (Kalshi colors)
- Custom fonts (JetBrains Mono + Syne)

**Smooth Animations:**
- Staggered card reveals
- Glowing hover effects
- Pulsing unusual market indicators
- Shimmer effects on volume bars

**Unusual Activity Detection:**
- 🔥 Markets with >100% volume spike
- ⚠️ Markets with >10% price change
- 📊 Activity scores (0-100)

---

## 🌐 Deploy Options

| Platform | Cost | Setup Time | Best For |
|----------|------|------------|----------|
| **Local** | Free | 2 min | Development |
| **Railway** | Free tier | 5 min | Personal projects |
| **Render** | Free tier | 10 min | Side projects |
| **Heroku** | $5-7/mo | 10 min | Production |
| **Vercel** | Free | 5 min | Static sites |
| **Netlify** | Free | 3 min | Static sites |

---

## 📊 API Endpoints (Backend Version)

```
GET  /                        Frontend app
GET  /api/markets             All Kalshi markets
GET  /api/kalshi/markets      Kalshi markets (same as above)
GET  /health                  Server status
```

---

## 🔧 Customization

### Change Colors
Edit CSS variables in the HTML:
```css
:root {
    --accent-green: #00ff88;    /* Primary accent */
    --accent-blue: #00d4ff;     /* Secondary accent */
    --accent-yellow: #ffd700;   /* Unusual markers */
}
```

### Adjust Thresholds
Edit server.js for unusual detection:
```javascript
const isUnusual = volumeChange > 100 || priceChange > 10;
```

### Change Refresh Rate
Update in the frontend:
```javascript
setInterval(async () => {
    // Refresh markets
}, 300000);  // 5 minutes (300000ms)
```

---

## 🛠️ Tech Stack

**Frontend:**
- Pure HTML/CSS/JavaScript
- No framework dependencies
- Custom animations

**Backend:**
- Node.js + Express
- node-fetch for API calls
- dotenv for environment variables

**APIs:**
- Kalshi Trade API v2
- Polymarket CLOB API

---

## 🔐 Security

### ✅ Backend version (Secure)
- API keys stored server-side
- Environment variables
- Never exposed to browser

### ⚠️ Simple version (Insecure)
- No API keys needed (uses mock data)
- Or keys visible in HTML (don't use for production)

---

## 📈 Roadmap

- [ ] Historical price charts
- [ ] Email/SMS alerts for unusual activity
- [ ] User accounts and watchlists
- [ ] Mobile app (React Native)
- [ ] More prediction market platforms
- [ ] WebSocket for real-time updates
- [ ] Machine learning unusual detection

---

## 🤝 Contributing

This is an open-source project! Feel free to:
- Add new features
- Fix bugs
- Improve documentation
- Add more prediction market platforms

---

## 📝 License

MIT License - feel free to use for commercial or personal projects!

---

## 🆘 Support

**Having issues?**

1. Check DEPLOYMENT-GUIDE.md for detailed instructions
2. Check QUICKSTART-BACKEND.md for quick setup
3. Open an issue on GitHub
4. Check server logs for errors

---

## 🎯 Quick Start Commands

**Simple version:**
```bash
# Just open the file!
open kalshi-terminal.html
```

**Backend version:**
```bash
# Install dependencies
npm install

# Configure API keys
cp .env.example .env
# Edit .env with your Kalshi credentials

# Start server
npm start

# Open browser
open http://localhost:3000
```

---

Built with ❤️ for Kalshi traders

**Ready to track unusual markets?** Pick your deployment option above and get started! 🚀
