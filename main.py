"""
Kalshi Terminal - FastAPI Backend
PRO flow-based analysis for prediction markets
"""

import os
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
import base64

# ==========================================
# CONFIGURATION
# ==========================================
KALSHI_API_KEY_ID = os.getenv("KALSHI_API_KEY_ID", "")
KALSHI_PRIVATE_KEY_PEM = os.getenv("KALSHI_PRIVATE_KEY", "")
BASE_URL = "https://api.elections.kalshi.com"

app = FastAPI(title="Kalshi Terminal")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# AUTHENTICATION
# ==========================================

def sign_request(method: str, path: str) -> Dict[str, str]:
    """Sign Kalshi API request using RSA private key"""
    if not KALSHI_PRIVATE_KEY_PEM or not KALSHI_API_KEY_ID:
        return {}
    
    try:
        # Parse private key
        private_key = serialization.load_pem_private_key(
            KALSHI_PRIVATE_KEY_PEM.encode(),
            password=None,
            backend=default_backend()
        )
        
        # Create signature
        timestamp = str(int(datetime.now().timestamp() * 1000))
        path_without_query = path.split('?')[0]
        msg_string = timestamp + method + path_without_query
        
        signature = private_key.sign(
            msg_string.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        
        signature_b64 = base64.b64encode(signature).decode()
        
        return {
            "KALSHI-ACCESS-KEY": KALSHI_API_KEY_ID,
            "KALSHI-ACCESS-SIGNATURE": signature_b64,
            "KALSHI-ACCESS-TIMESTAMP": timestamp
        }
    except Exception as e:
        print(f"❌ Error signing request: {e}")
        return {}

# ==========================================
# KALSHI API FUNCTIONS
# ==========================================

async def fetch_kalshi_markets() -> List[Dict[str, Any]]:
    """Fetch markets from Kalshi API with pagination"""
    all_markets = []
    cursor = None
    page_count = 0
    max_pages = 3  # Limit for speed
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        while page_count < max_pages:
            path = f"/trade-api/v2/markets?limit=1000"
            if cursor:
                path += f"&cursor={cursor}"
            
            headers = sign_request("GET", path)
            if not headers:
                print("❌ Could not sign request - check API keys")
                break
            
            try:
                response = await client.get(BASE_URL + path, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                markets = data.get("markets", [])
                all_markets.extend(markets)
                
                cursor = data.get("cursor")
                page_count += 1
                
                print(f"📄 Fetched page {page_count}: {len(markets)} markets (total: {len(all_markets)})")
                
                if not cursor:
                    break
                    
            except Exception as e:
                print(f"❌ Error fetching markets: {e}")
                break
    
    print(f"✅ Total markets fetched: {len(all_markets)}")
    return all_markets

# ==========================================
# PRO FLOW ANALYSIS
# ==========================================

def analyze_market_flow(market: Dict[str, Any]) -> Dict[str, Any]:
    """
    PRO flow-based analysis for a single market
    Returns enhanced market data with flow indicators
    """
    # Extract base data
    ticker = market.get("ticker", "")
    title = market.get("title", "Unknown Market")
    last_price_dollars = float(market.get("last_price_dollars", 0))
    current_price = last_price_dollars * 100  # Convert to cents
    
    volume = market.get("volume", 0) or market.get("liquidity", 0) or 0
    open_interest = market.get("open_interest", 0) or 0
    
    # Calculate price change
    price_change = 0.0
    prev_yes_bid_dollars = market.get("previous_yes_bid_dollars")
    if prev_yes_bid_dollars and float(prev_yes_bid_dollars) > 0:
        prev_price = float(prev_yes_bid_dollars) * 100
        if prev_price > 0 and current_price > 0:
            price_change = ((current_price - prev_price) / prev_price) * 100
    
    # Validate price change
    if not (abs(price_change) < 1000):  # Sanity check
        price_change = 0.0
    
    # PRO ANALYSIS: Spread calculation (liquidity indicator)
    yes_bid = market.get("yes_bid", 0) or 0
    yes_ask = market.get("yes_ask", 0) or 0
    spread = (yes_ask - yes_bid) / 100 if yes_ask > yes_bid else 0
    tight_spread = 0 < spread < 0.04  # Tight spread = good liquidity
    
    # PRO ANALYSIS: Volume imbalance (whale detection)
    volume_to_oi = volume / open_interest if open_interest > 0 else 0
    has_imbalance = volume_to_oi > 0.3  # 30%+ recent volume vs OI = action
    
    # PRO ANALYSIS: Liquidity score (0-100)
    liquidity_score = min(100, 
        (40 if tight_spread else 0) + 
        (volume / 100) + 
        (open_interest / 50)
    )
    
    # Mark as UNUSUAL (whale territory)
    is_unusual = (
        volume > 100000 or  # Whale territory
        (tight_spread and volume > 50000) or  # Liquid + active
        (has_imbalance and volume > 30000)  # Flow detected
    )
    
    return {
        "id": ticker,
        "platform": "Kalshi",
        "title": title,
        "currentPrice": round(current_price, 1),
        "priceChange": round(price_change, 1),
        "volume24h": volume,
        "trades24h": open_interest,
        "unusual": is_unusual,
        "rawVolume": volume,
        # PRO metrics
        "spread": round(spread, 4),
        "tightSpread": tight_spread,
        "hasImbalance": has_imbalance,
        "liquidityScore": round(liquidity_score)
    }

# ==========================================
# API ENDPOINTS
# ==========================================

@app.get("/api/markets")
async def get_markets():
    """
    Get top trending markets with PRO flow analysis
    Filters for high-volume markets and scores by liquidity
    """
    try:
        # Fetch all markets
        raw_markets = await fetch_kalshi_markets()
        
        if not raw_markets:
            return {
                "success": False,
                "markets": [],
                "message": "No markets fetched from Kalshi API"
            }
        
        # Filter for trending markets (>$5k volume)
        trending_markets = [
            m for m in raw_markets
            if float(m.get("last_price_dollars", 0)) > 0 
            and (m.get("volume", 0) or m.get("liquidity", 0) or 0) > 5000
        ]
        
        print(f"🔥 Filtered {len(raw_markets)} → {len(trending_markets)} trending markets (>$5k volume)")
        
        # Apply PRO flow analysis
        analyzed_markets = [analyze_market_flow(m) for m in trending_markets]
        
        # Sort by liquidity score (best flow indicators first)
        analyzed_markets.sort(key=lambda x: x["liquidityScore"], reverse=True)
        
        # Take top 50
        top_markets = analyzed_markets[:50]
        
        print(f"✅ Showing top {len(top_markets)} markets by liquidity & flow")
        
        return {
            "success": True,
            "markets": top_markets,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Error processing markets: {e}")
        return {
            "success": False,
            "markets": [],
            "message": str(e)
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "has_api_keys": bool(KALSHI_API_KEY_ID and KALSHI_PRIVATE_KEY_PEM)
    }

# ==========================================
# SERVE FRONTEND
# ==========================================

# Mount static files
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/")
async def serve_frontend():
    """Serve the main HTML page"""
    return FileResponse("public/index.html")

# ==========================================
# STARTUP
# ==========================================

@app.on_event("startup")
async def startup_event():
    print("=" * 60)
    print("🔥 Kalshi Terminal - FastAPI Backend")
    print("=" * 60)
    print(f"📡 Kalshi API: {BASE_URL}")
    print(f"🔑 API Key ID: {'✅ Set' if KALSHI_API_KEY_ID else '❌ Missing'}")
    print(f"🔐 Private Key: {'✅ Set' if KALSHI_PRIVATE_KEY_PEM else '❌ Missing'}")
    print("=" * 60)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
