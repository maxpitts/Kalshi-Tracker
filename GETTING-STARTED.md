# 🚀 Getting Started - Kalshi Terminal

## What Is This?

A beautiful terminal-style web app that tracks unusual activity on Kalshi prediction markets. Think "Unusual Whales" but for Kalshi.

**Features:**
- 🔥 Detects markets with unusual volume/price spikes
- 📊 Real-time Kalshi market data
- 🎨 Beautiful Bloomberg-terminal inspired design
- ⚡ Fast filtering and search

---

## Option 1: Try It Now (No Setup)

**Just want to see what it looks like?**

1. Open `kalshi-terminal.html` in your browser
2. That's it!

This version uses fake demo data to show you the interface.

---

## Option 2: Use Real Kalshi Data

**Want real market data from Kalshi?**

### Step 1: Install Node.js
Download from: https://nodejs.org (get the LTS version)

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Add your Kalshi login
Create a file called `.env`:
```
PORT=3000
KALSHI_EMAIL=your_email@example.com
KALSHI_PASSWORD=your_password
```

### Step 4: Run it
```bash
npm start
```

### Step 5: Open in browser
Go to: http://localhost:3000

**You're done!** 🎉 You'll see real Kalshi markets with live data.

---

## Option 3: Deploy Online (Make It Public)

**Want to access it from anywhere?**

### Railway (Easiest - Free)

1. Go to https://railway.app
2. Sign up (it's free)
3. Click "New Project" → "Deploy from GitHub"
4. Push your code to GitHub
5. Connect your repo to Railway
6. Add environment variables:
   - `KALSHI_EMAIL` = your Kalshi email
   - `KALSHI_PASSWORD` = your Kalshi password
7. Deploy!

Your site will be live at: `https://your-app.up.railway.app`

### Render (Also Free)

1. Go to https://render.com
2. Sign up
3. "New Web Service"
4. Connect your GitHub repo
5. Add environment variables (same as above)
6. Deploy!

---

## How It Works

### The Design
- **Purple theme** - Kalshi brand colors
- **Terminal aesthetic** - Grid background, scanlines, neon glow
- **Smooth animations** - Cards slide in, hover effects, pulsing alerts

### Unusual Detection
Markets are flagged as "unusual" when:
- Volume change > 100% in 24 hours
- Price change > ±10% 

### What You See
- **Current price** - Market price in cents
- **24h volume** - Trading volume
- **Price change** - Up/down percentage
- **Activity score** - 0-100 hotness metric

---

## File Structure

```
kalshi-terminal/
├── kalshi-terminal.html     # Standalone version (demo data)
├── server.js                # Backend API server
├── package.json             # Dependencies
├── .env                     # Your credentials (don't commit!)
└── public/
    └── index.html           # Frontend (connects to backend)
```

---

## Where Do API Keys Go?

Create a `.env` file in the root folder:

```
KALSHI_EMAIL=your_email@example.com
KALSHI_PASSWORD=your_password
```

**Important:** This file stays on your computer (or server). It's never exposed to users.

---

## Customization

### Change Colors
Edit the CSS in `public/index.html`:
```css
:root {
    --accent-purple: #ba55d3;   /* Primary color */
    --accent-blue: #00d4ff;     /* Secondary color */
}
```

### Change Thresholds
Edit `server.js`:
```javascript
// Define what counts as "unusual"
const isUnusual = volumeChange > 100 || priceChange > 10;
```

### Change Refresh Rate
Edit `public/index.html`:
```javascript
setInterval(async () => {
    // Refresh markets
}, 300000);  // 5 minutes = 300000ms
```

---

## Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org

**"Kalshi login failed"**
- Check your email/password in `.env`
- Make sure your Kalshi account is active

**"Port already in use"**
- Change `PORT=3000` to `PORT=8080` in `.env`

**"No markets showing"**
- Check browser console (F12) for errors
- Make sure server is running: `npm start`

---

## Next Steps

Once you have it running:

1. ✅ Customize the design
2. 🚀 Deploy to Railway or Render
3. 📊 Add custom filters for categories you care about
4. 🔔 Set up alerts (future feature)
5. 📈 Track your favorite markets

---

## Support

Having issues? Check:
- README-MAIN.md - Full documentation
- QUICKSTART-BACKEND.md - Detailed setup
- DEPLOYMENT-GUIDE.md - Deployment help

---

## Summary

**Fastest way to get started:**
```bash
npm install
cp .env.example .env
# Edit .env with your Kalshi credentials
npm start
# Open http://localhost:3000
```

That's it! Enjoy your Kalshi terminal 🔥
