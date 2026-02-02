# Medical Data Warehouse API Documentation

## 📖 Overview

The Medical Data Warehouse API provides REST endpoints to query and analyze Telegram medical channel data. Built with FastAPI, it exposes insights from the data warehouse including message analytics, channel statistics, and YOLO-based image classification results.

**Base URL:** `http://127.0.0.1:8000`

**Interactive Documentation:** `http://127.0.0.1:8000/docs` (Swagger UI)

---

## 🚀 Quick Start

### 1. Start the API Server

```powershell
# Navigate to project directory
cd C:\tele\medical-telegram-warehouse

# Start the server
uvicorn api.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

### 2. Verify API is Running

Open your browser and visit:
- **Swagger UI:** http://127.0.0.1:8000/docs
- **Root Endpoint:** http://127.0.0.1:8000/

---

## 📡 API Endpoints

### 1. Root Endpoint

**GET** `/`

Returns a welcome message.

**Example Request:**
```bash
curl http://127.0.0.1:8000/
```

**Response:**
```json
{
  "message": "Welcome to the Medical Data Warehouse API. Go to /docs for testing."
}
```

---

### 2. Top Products Report

**GET** `/api/reports/top-products`

Returns the most frequently mentioned keywords/products in messages.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 10 | Number of top keywords to return |

**Example Requests:**
```bash
# Get top 10 products (default)
curl http://127.0.0.1:8000/api/reports/top-products

# Get top 5 products
curl "http://127.0.0.1:8000/api/reports/top-products?limit=5"
```

**Response:**
```json
[
  {
    "keyword": "telegram",
    "frequency": 207
  },
  {
    "keyword": "pharmacy",
    "frequency": 116
  },
  {
    "keyword": "delivery",
    "frequency": 117
  }
]
```

**Response Schema:**
```typescript
[
  {
    keyword: string,      // The mentioned keyword
    frequency: integer    // Number of times mentioned
  }
]
```

---

### 3. Channel Activity

**GET** `/api/channels/{channel_name}/activity`

Returns aggregated statistics for a specific Telegram channel.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel_name` | string | Yes | Name of the Telegram channel |

**Example Requests:**
```bash
# Get CheMed123 channel stats
curl http://127.0.0.1:8000/api/channels/CheMed123/activity

# Get DoctorsET channel stats
curl http://127.0.0.1:8000/api/channels/DoctorsET/activity

# Get EAHCI channel stats
curl http://127.0.0.1:8000/api/channels/EAHCI/activity
```

**Success Response (200):**
```json
{
  "channel_name": "CheMed123",
  "total_messages": 98,
  "avg_views": 1234.56,
  "first_post_date": "2022-12-13T00:00:00",
  "last_post_date": "2023-02-10T00:00:00"
}
```

**Error Response (404):**
```json
{
  "detail": "Channel not found"
}
```

**Response Schema:**
```typescript
{
  channel_name: string,         // Channel identifier
  total_messages: integer,      // Total number of posts
  avg_views: float,            // Average views per post
  first_post_date: datetime,   // Date of first post
  last_post_date: datetime     // Date of most recent post
}
```

---

### 4. Message Search

**GET** `/api/search/messages`

Searches messages by keyword (case-insensitive full-text search).

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Search keyword (min 1 character) |
| `limit` | integer | No | 20 | Maximum number of results |

**Example Requests:**
```bash
# Search for "product"
curl "http://127.0.0.1:8000/api/search/messages?query=product"

# Search for "pharmacy" with limit
curl "http://127.0.0.1:8000/api/search/messages?query=pharmacy&limit=5"

# Search for "delivery"
curl "http://127.0.0.1:8000/api/search/messages?query=delivery&limit=10"
```

**Response:**
```json
{
  "total": 2,
  "data": [
    {
      "message_id": 123,
      "channel_name": "CheMed123",
      "message_date": "2023-01-15T10:30:00",
      "message_text": "New product available for delivery...",
      "view_count": 1500
    },
    {
      "message_id": 456,
      "channel_name": "DoctorsET",
      "message_date": "2023-01-20T14:15:00",
      "message_text": "Check out our latest product range",
      "view_count": 2300
    }
  ]
}
```

**Response Schema:**
```typescript
{
  total: integer,              // Number of results returned
  data: [
    {
      message_id: integer,     // Unique message identifier
      channel_name: string,    // Source channel
      message_date: datetime,  // When message was posted
      message_text: string,    // Message content (may be null)
      view_count: integer      // Number of views (may be null)
    }
  ]
}
```

---

### 5. Visual Content Statistics

**GET** `/api/reports/visual-content`

Returns image classification statistics by channel (based on YOLO object detection).

**No Parameters Required**

**Example Request:**
```bash
curl http://127.0.0.1:8000/api/reports/visual-content
```

**Response:**
```json
[
  {
    "channel_name": "CheMed123",
    "image_category": "product_display",
    "count": 19
  },
  {
    "channel_name": "CheMed123",
    "image_category": "promotional",
    "count": 13
  },
  {
    "channel_name": "DoctorsET",
    "image_category": "lifestyle",
    "count": 32
  },
  {
    "channel_name": "lobelia4cosmetics",
    "image_category": "product_display",
    "count": 65
  }
]
```

**Image Categories:**
| Category | Description |
|----------|-------------|
| `promotional` | Images with people (confidence > 0.8), likely promotional content |
| `product_display` | Images showing products (bottles, books, etc.) |
| `lifestyle` | Images with people (confidence 0.4-0.8), lifestyle context |
| `other` | No significant objects detected or low confidence |

**Response Schema:**
```typescript
[
  {
    channel_name: string,      // Channel identifier
    image_category: string,    // Classification category
    count: integer            // Number of images in this category
  }
]
```

---

## 🧪 Testing the API

### Method 1: Swagger UI (Recommended for Beginners)

1. Open browser: http://127.0.0.1:8000/docs
2. Click on any endpoint to expand
3. Click **"Try it out"**
4. Fill in parameters (if required)
5. Click **"Execute"**
6. View response below

**Screenshot locations in Swagger UI:**
- Each endpoint shows request/response schemas
- You can test directly in the browser
- No additional tools needed

---

### Method 2: PowerShell/curl

```powershell
# Test all endpoints
curl http://127.0.0.1:8000/api/reports/top-products
curl http://127.0.0.1:8000/api/channels/CheMed123/activity
curl "http://127.0.0.1:8000/api/search/messages?query=product&limit=5"
curl http://127.0.0.1:8000/api/reports/visual-content
```

---

### Method 3: Python Script

Use the provided test script:

```powershell
python scripts/test_api.py
```

Or create your own:

```python
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Test Top Products
response = requests.get(f"{BASE_URL}/api/reports/top-products?limit=5")
print(json.dumps(response.json(), indent=2))

# Test Channel Activity
response = requests.get(f"{BASE_URL}/api/channels/CheMed123/activity")
print(json.dumps(response.json(), indent=2))

# Test Message Search
response = requests.get(
    f"{BASE_URL}/api/search/messages",
    params={"query": "product", "limit": 3}
)
print(json.dumps(response.json(), indent=2))

# Test Visual Content
response = requests.get(f"{BASE_URL}/api/reports/visual-content")
print(json.dumps(response.json(), indent=2))
```

---

## 🔧 Configuration

### Environment Variables

The API reads database credentials from `.env`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5433          # Changed from 5432 to avoid conflict
DB_NAME=medical_warehouse
```

### Database Connection

The API connects to PostgreSQL and queries these tables:
- `public_marts.fct_messages` - Fact table for messages
- `public_marts.dim_channels` - Dimension table for channels
- `public_marts.dim_dates` - Dimension table for dates
- `public_marts.fct_image_detections` - Fact table for YOLO results

---

## ⚠️ Troubleshooting

### API Won't Start

**Problem:** Port 8000 already in use

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <process_id> /F

# Restart API
uvicorn api.main:app --reload --port 8000
```

---

### Database Connection Error

**Problem:** `database "medical_warehouse" does not exist`

**Solution:**
```powershell
# Check if Docker container is running
docker ps

# If not running, start it
docker-compose up -d

# Verify database exists
docker exec -it medical_postgres psql -U postgres -l
```

---

### Port Conflict with Local PostgreSQL

**Problem:** API connects to wrong PostgreSQL instance

**Solution:**
1. Check `.env` file has `DB_PORT=5433`
2. Check `docker-compose.yml` maps to `5433:5432`
3. Restart Docker: `docker-compose down && docker-compose up -d`
4. Restart API

---

### Empty Results

**Problem:** Endpoints return empty arrays or 0 results

**Solution:**
```powershell
# Verify data exists in database
docker exec -it medical_postgres psql -U postgres -d medical_warehouse

# Run these queries:
SELECT COUNT(*) FROM public_marts.fct_messages;
SELECT COUNT(*) FROM public_marts.fct_image_detections;
SELECT * FROM public_marts.dim_channels;
```

If counts are 0, you need to:
1. Run scraper: `python src/scraper.py`
2. Load data: `python scripts/load_to_postgres.py`
3. Run dbt: `python scripts/dbt_wrapper.py run`

---

## 📊 Data Flow

```
User Request
    ↓
FastAPI Endpoint
    ↓
SQLAlchemy Query
    ↓
PostgreSQL (public_marts schema)
    ↓
JSON Response
```

---

## 🔐 Security Notes

- **Local Development Only:** This API is configured for localhost
- **No Authentication:** Suitable for development/testing only
- **Production Deployment:** Add authentication, HTTPS, rate limiting

---

## 📚 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Swagger UI:** http://127.0.0.1:8000/docs
- **ReDoc:** http://127.0.0.1:8000/redoc
- **Project README:** `README.md`

---

## 🎯 Common Use Cases

### Use Case 1: Find Most Popular Products
```bash
curl "http://127.0.0.1:8000/api/reports/top-products?limit=20"
```

### Use Case 2: Compare Channel Performance
```bash
curl http://127.0.0.1:8000/api/channels/CheMed123/activity
curl http://127.0.0.1:8000/api/channels/DoctorsET/activity
```

### Use Case 3: Search for Specific Topics
```bash
curl "http://127.0.0.1:8000/api/search/messages?query=vaccine&limit=50"
```

### Use Case 4: Analyze Visual Content Strategy
```bash
curl http://127.0.0.1:8000/api/reports/visual-content
```

---

## 📝 Response Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | Resource not found (e.g., channel doesn't exist) |
| 500 | Internal Server Error | Database or server error |

---

## 🔄 API Versioning

Current Version: **v1.0.0**

Future versions will be accessible via:
- `/api/v2/...` (when available)

---

## 💡 Tips

1. **Use Swagger UI** for initial exploration - it's the easiest way to understand the API
2. **Check the database** if you get empty results
3. **Monitor the terminal** where uvicorn is running for debug logs
4. **Use `limit` parameter** to control response size
5. **URL encode** special characters in search queries

---

## 📧 Support

For issues or questions:
1. Check this documentation
2. Review `README.md`
3. Check terminal logs for errors
4. Verify database connection and data

---

**Last Updated:** 2026-02-02  
**API Version:** 1.0.0  
**Framework:** FastAPI 0.109+
