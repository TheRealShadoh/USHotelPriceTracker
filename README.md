# 🏨 Theme Park Hotel Price Tracker

A beautiful, simple React app to track and compare hotel prices from Disney and Universal Studios theme parks. Find the cheapest days and hotels with an intuitive, modern interface.

## Features

- 🎪 Track hotels from both Disney and Universal Studios
- 📊 Compare prices across 30 days
- 💰 Identify cheapest days to book
- ⭐ Highlight the most affordable hotels
- 📱 Beautiful, responsive design
- 🐳 Easy Docker deployment

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

### Manual Setup

#### Prerequisites
- Node.js 20+
- npm or yarn

#### Development

**Start the backend server:**
```bash
cd server
npm install
npm run dev
```

**In another terminal, start the frontend:**
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

#### Production Build

**Build backend:**
```bash
cd server
npm install
npm run build
npm start
```

**Build frontend:**
```bash
cd client
npm install
npm run build
npm run preview
```

## Project Structure

```
├── client/              # React frontend (Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx     # Main app component
│   │   └── types.ts    # TypeScript type definitions
│   ├── package.json
│   └── Dockerfile
├── server/             # Express backend API
│   ├── src/
│   │   └── index.ts    # Main server file
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml  # Docker orchestration
└── README.md          # This file
```

## API Endpoints

- `GET /api/hotels` - Get all hotels with pricing data (cached for 6 hours)
- `GET /api/hotels/:id` - Get a specific hotel by ID
- `POST /api/refresh` - Manually refresh the hotel cache
- `GET /api/health` - Health check endpoint

## Hotel Data

The backend includes realistic pricing data for:

### Disney Hotels
- Animal Kingdom Lodge (Deluxe) - Base: $280/night
- Art of Animation Resort (Value) - Base: $130/night
- Polynesian Village Resort (Deluxe) - Base: $280/night
- Caribbean Beach Resort (Moderate) - Base: $180/night

### Universal Studios Hotels
- Loews Portofino Bay Hotel (Deluxe) - Base: $250/night
- Hard Rock Hotel (Deluxe) - Base: $250/night
- Loews Royal Pacific Resort (Deluxe) - Base: $250/night
- Universal's Aventura Hotel (Moderate) - Base: $160/night

## Integrating Real Pricing Data

The app currently uses realistic simulated pricing that includes:
- **Weekday/Weekend Pricing**: Weekends cost ~15% more than weekdays
- **Seasonal Variations**: Holiday periods (Spring Break, Summer, Thanksgiving, Christmas) have premium pricing (25% higher)
- **Random Variance**: Daily variations to simulate real market conditions
- **Caching**: Data is cached for 6 hours to avoid excessive API calls

To integrate real hotel pricing data, follow these steps:

### Option 1: Makcorps Hotel API (Recommended for Free Tier)

1. Sign up for free at https://www.makcorps.com/
2. Get your API key from the dashboard
3. Add to `server/.env`:
   ```
   MAKCORPS_API_KEY=your_api_key_here
   ```
4. Update `server/src/hotelService.ts` to call Makcorps API in the `fetchRealHotelData()` function

### Option 2: Booking.com Affiliate API

1. Register as an affiliate at https://partner.booking.com/
2. Request API access with your hotel property codes
3. Add to `server/.env`:
   ```
   BOOKING_AFFILIATE_ID=your_affiliate_id_here
   ```
4. Implement the Booking.com API call in `hotelService.ts`

### Option 3: Web Scraping (Expedia/Hotels.com)

Use libraries like:
- `cheerio` for HTML parsing
- `puppeteer` for JavaScript-heavy sites
- `axios` for HTTP requests

Example implementation in `hotelService.ts`:
```typescript
import axios from 'axios'
import cheerio from 'cheerio'

async function scrapeExistedData() {
  const response = await axios.get('https://www.expedia.com/...')
  const $ = cheerio.load(response.data)
  // Parse hotel prices from HTML
}
```

## Price Caching

- Data is cached in memory for **6 hours**
- Manual refresh available via `POST /api/refresh`
- Cache automatically expires and refreshes on next request

## Development Environment Setup

```bash
# Copy environment template
cp server/.env.example server/.env

# Edit with your API keys (if using real data)
nano server/.env

# Install dependencies
npm install

# Run development servers
npm run dev
```

## Future Enhancements

- Real-time price scraping from official websites
- Database integration for persistent historical data
- User alerts for price drops
- Historical price trends and analysis
- Email/SMS notifications for deals
- Booking integration

## License

MIT
