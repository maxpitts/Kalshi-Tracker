# 🔥 Kalshi Terminal - Unusual Markets Tracker

A beautiful, real-time terminal for tracking unusual activity on **Kalshi** prediction markets. Think "Unusual Whales" but for Kalshi.

## ⚡ Features

- 🔥 **Unusual Activity Detection** - Spot markets with high volume spikes & price swings
- 📊 **Real-time Kalshi Data** - Live market information from Kalshi API
- 🎨 **Beautiful Terminal UI** - Bloomberg-inspired design with purple/blue theme
- ⚡ **Advanced Filtering** - Search, sort, and filter by category
- 📈 **Live Statistics** - Total volume, price movements, activity scores
- 🔄 **Auto-refresh** - Updates every 5 minutes automatically

## 🚀 Quick Start

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/kalshi-terminal.git
   cd kalshi-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Kalshi credentials:
   ```
   PORT=3000
   KALSHI_EMAIL=your_kalshi_email@example.com
   KALSHI_PASSWORD=your_kalshi_password
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Try the Demo (No Setup)

Just open `kalshi-terminal.html` in your browser to see the interface with demo data!

## 🌐 Deploy to Cloud

### Railway (Recommended - Free)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click the button above or go to [Railway](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select this repo
4. Add environment variables:
   - `KALSHI_EMAIL`
   - `KALSHI_PASSWORD`
5. Deploy!

### Vercel / Render

See full deployment guide in `DEPLOYMENT-GUIDE.md`

## 📁 Project Structure

```
kalshi-terminal/
├── server.js              # Backend API server
├── package.json           # Dependencies
├── public/
│   └── index.html        # Frontend terminal UI
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── kalshi-terminal.html  # Standalone demo version
```

## 🎨 Customization

### Change Colors
Edit CSS in `public/index.html`:
```css
:root {
    --accent-purple: #ba55d3;
    --accent-blue: #00d4ff;
}
```

### Adjust Unusual Detection
Edit `server.js`:
```javascript
const isUnusual = volumeChange > 100 || priceChange > 10;
```

## 🔐 Security

- ✅ API keys in environment variables (never in code)
- ✅ `.env` excluded from Git
- ✅ Server-side API calls only

## 📊 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `KALSHI_EMAIL` | Your Kalshi account email | Yes |
| `KALSHI_PASSWORD` | Your Kalshi password | Yes |
| `PORT` | Server port (default: 3000) | No |

## 🐛 Troubleshooting

**"Kalshi login failed"**
- Check credentials in `.env`
- Verify Kalshi account is active

**"No markets showing"**
- Check browser console (F12)
- Verify environment variables are set

## 📚 Documentation

- `GETTING-STARTED.md` - Setup guide
- `DEPLOYMENT-GUIDE.md` - Deploy to cloud
- `DEPLOY-ON-WHOP.md` - Monetize your terminal

## 🛠️ Tech Stack

- Node.js + Express
- Vanilla JavaScript
- Kalshi Trade API v2
- Custom CSS (terminal aesthetic)

## 📄 License

MIT License

---

**⭐ Star this repo if you find it useful!**

Built for Kalshi traders 🚀
