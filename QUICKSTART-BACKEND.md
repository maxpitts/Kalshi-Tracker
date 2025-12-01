# 🚀 Quick Start - Secure Backend Version

## What You Get

✅ **Secure API keys** - Keys stay on the server, not exposed in browser
✅ **Real Kalshi & Polymarket data** - Live market information
✅ **Production ready** - Can deploy to Heroku, Railway, Render, etc.

---

## Run Locally (3 minutes)

### Step 1: Install Node.js
Download from: https://nodejs.org (get LTS version)

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure API keys
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` file:
```
PORT=3000
KALSHI_EMAIL=your_kalshi_email@example.com
KALSHI_PASSWORD=your_kalshi_password
```

### Step 4: Start the server
```bash
npm start
```

### Step 5: Open in browser
Go to: http://localhost:3000

**Done!** Your terminal is running with real data 🎉

---

## Deploy to Cloud (10 minutes)

### Option A: Railway (Easiest - Free)

1. **Sign up** at https://railway.app
2. **Click** "Start a New Project"
3. **Select** "Deploy from GitHub repo"
4. **Connect** your GitHub account
5. **Push** this code to a GitHub repo
6. **Select** your repo in Railway
7. **Add environment variables**:
   - `KALSHI_EMAIL` = your email
   - `KALSHI_PASSWORD` = your password
8. **Deploy!** Railway auto-detects and builds

Your site will be live at: `https://your-app.up.railway.app`

### Option B: Render (Free)

1. **Sign up** at https://render.com
2. **New** → Web Service
3. **Connect** GitHub repo
4. **Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment**:
   - Add `KALSHI_EMAIL`
   - Add `KALSHI_PASSWORD`
6. **Create Web Service**

Your site will be live at: `https://your-app.onrender.com`

### Option C: Heroku

1. **Install** Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-app-name`
4. **Set config**:
   ```bash
   heroku config:set KALSHI_EMAIL=your_email@example.com
   heroku config:set KALSHI_PASSWORD=your_password
   ```
5. **Deploy**:
   ```bash
   git push heroku main
   ```

Your site will be live at: `https://your-app-name.herokuapp.com`

---

## File Structure

```
unusual-markets/
├── server.js           # Backend API server
├── package.json        # Node.js dependencies
├── .env               # Your API keys (DON'T COMMIT!)
├── .env.example       # Template for .env
└── public/
    └── index.html     # Frontend terminal interface
```

---

## API Endpoints

Once running, you have these endpoints:

- `GET /` - Frontend app
- `GET /api/markets` - All markets (Kalshi + Polymarket)
- `GET /api/kalshi/markets` - Kalshi markets only
- `GET /api/polymarket/markets` - Polymarket markets only
- `GET /health` - Server health check

---

## Security

✅ **API keys are server-side only** - Not exposed in browser
✅ **Environment variables** - Keys in `.env`, never in code
✅ **Token caching** - Kalshi token reused for 23 hours
✅ **CORS enabled** - Can call from any frontend

---

## Troubleshooting

**"Module not found"**
```bash
npm install
```

**"Kalshi login failed"**
- Check your email/password in `.env`
- Make sure Kalshi account is active

**"Port already in use"**
Change PORT in `.env`:
```
PORT=8080
```

**"Can't connect to API"**
- Check server is running: `npm start`
- Check URL: `http://localhost:3000`
- Check browser console for errors

---

## Next Steps

1. ✅ Get it running locally
2. 🚀 Deploy to Railway/Render
3. 📊 Customize the frontend
4. 🔔 Add webhooks/notifications
5. 📈 Track historical data

---

## Need Help?

Check the full DEPLOYMENT-GUIDE.md for detailed instructions on:
- Different hosting platforms
- Custom domain setup
- SSL certificates
- Scaling and performance
- Adding more features

Enjoy your prediction market terminal! 🔥
