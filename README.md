# Simplify Money - KuberAI-like Gold Investment APIs

This project emulates the KuberAI gold investment workflow from the Simplify Money app. It provides two main APIs that work together to detect gold-related queries, provide investment advice, and facilitate digital gold purchases.

## Features

- **KuberAI-like Chat**: Detects gold investment queries and provides factual answers with nudges to purchase digital gold
- **Digital Gold Purchase**: Records user details and purchase transactions in MongoDB
- **Intent Detection**: Rule-based gold keyword detection with optional OpenAI integration
- **Database Integration**: MongoDB Atlas for user and purchase data persistence

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Validation**: Zod
- **AI**: OpenAI (optional, with rule-based fallback)
- **Environment**: dotenv

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd apis_simplifymoney
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
   OPENAI_API_KEY=sk-your-openai-key  # Optional
   ```

3. **Start the server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

## API Documentation

### 1. Chat Endpoint 

**POST** `/api/chat`

Detects gold-related queries, provides investment advice, and nudges users toward digital gold purchase.

#### Request Body
```json
{
  "message": "How to invest in gold?",
  "userContext": {
    "name": "Asha",
    "email": "asha@example.com",
    "phone": "9999999999"
  }
}
```

#### Response (Gold Intent Detected)
```json
{
  "intent": "gold_investment",
  "answer": "You can invest in gold via Digital Gold for liquidity, SGBs for interest + tax benefits, or ETFs for market exposure.",
  "nudge": "Want me to proceed with a digital gold purchase for you?",
  "followUp": {
    "cta": "proceed_to_digital_gold_purchase",
    "endpoint": "/api/purchase/digital-gold",
    "payloadExample": {
      "user": {
        "name": "Asha",
        "email": "asha@example.com",
        "phone": "9999999999"
      },
      "purchase": {
        "amountInINR": 1000
      }
    }
  }
}
```

#### Response (Non-Gold Query)
```json
{
  "intent": "generic",
  "answer": "I can help with gold investments. Ask me about gold price, how to buy, or SGBs."
}
```

### 2. Digital Gold Purchase Endpoint

**POST** `/api/purchase/digital-gold`

Records a digital gold purchase transaction and creates/updates user profile.

#### Request Body
```json
{
  "user": {
    "name": "Asha",
    "email": "asha@example.com",
    "phone": "9999999999"
  },
  "purchase": {
    "amountInINR": 1500
  }
}
```

#### Response
```json
{
  "message": "Digital gold purchase successful",
  "orderId": "DG-1703123456789-123456",
  "amountInINR": 1500,
  "goldGrams": 0.2134,
  "pricePerGramINR": 7025,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Asha",
    "email": "asha@example.com"
  }
}
```

## Complete Flow Example

### Step 1: Ask about gold investment
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  --data '{
    "message": "What is the best way to invest in gold today?",
    "userContext": {
      "name": "Asha",
      "email": "asha@example.com",
      "phone": "9999999999"
    }
  }'
```

### Step 2: Purchase digital gold
```bash
curl -X POST http://localhost:4000/api/purchase/digital-gold \
  -H "Content-Type: application/json" \
  --data '{
    "user": {
      "name": "Asha",
      "email": "asha@example.com",
      "phone": "9999999999"
    },
    "purchase": {
      "amountInINR": 1500
    }
  }'
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### GoldPurchase Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  amountInINR: Number (required),
  goldGrams: Number (required),
  pricePerGramINR: Number (required),
  orderId: String (required, unique),
  status: String (enum: ["success", "failed"]),
  createdAt: Date,
  updatedAt: Date
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/simplifymoney` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | - |

### LLM Behavior

- **With OpenAI API Key**: Uses GPT-4o-mini for intelligent responses
- **Without OpenAI API Key**: Falls back to rule-based responses for gold queries
- **Intent Detection**: Always uses rule-based keyword matching for gold-related queries

## Deployment

### Render (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `PORT`: `4000`
   - `MONGODB_URI`: Your Atlas connection string
   - `OPENAI_API_KEY`: Your OpenAI key (optional)
5. Set build command: `npm install`
6. Set start command: `npm start`

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

## Testing

### Health Check
```bash
curl http://localhost:4000/health
```

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server

## Notes

- Gold prices are currently mocked (base: ₹7000/gram ± ₹100 variation)
- In production, integrate with a real gold price provider
- User emails are used as unique identifiers for upsert operations
- All timestamps are automatically managed by Mongoose

## Reviewers

To test the APIs:

1. **Health Check**: `GET /health`
2. **Chat Flow**: `POST /api/chat` with gold-related message
3. **Purchase Flow**: `POST /api/purchase/digital-gold` with user details and amount

The complete flow demonstrates:
- Gold intent detection and factual responses
- User nudging toward digital gold purchase
- Database persistence of user and purchase data
- Proper error handling and validation
