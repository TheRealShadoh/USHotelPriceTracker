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

- `GET /api/hotels` - Get all hotels with pricing data
- `GET /api/hotels/:id` - Get a specific hotel
- `GET /api/health` - Health check

## Hotel Data

The current implementation includes mock data for:

### Disney Hotels
- Animal Kingdom Lodge (Deluxe)
- Art of Animation Resort (Value)
- Polynesian Village Resort (Deluxe)
- Caribbean Beach Resort (Moderate)

### Universal Studios Hotels
- Loews Portofino Bay Hotel (Deluxe)
- Hard Rock Hotel (Deluxe)
- Loews Royal Pacific Resort (Deluxe)
- Universal's Aventura Hotel (Moderate)

## Future Enhancements

- Real-time price scraping from official websites
- Database integration for persistent data
- User alerts for price drops
- Historical price trends and analysis
- Booking integration
- Email notifications

## License

MIT
