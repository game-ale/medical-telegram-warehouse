# EthioMedIntel Startup Guide 🚀

Follow these steps **in order** every time you want to run the application.

## Prerequisites
- Docker Desktop must be installed and running
- Python 3.12+ installed
- Node.js 18+ installed

---

## Step-by-Step Startup Commands

### Step 1: Start PostgreSQL Database
**Open Terminal 1** (in project root: `c:\tele\medical-telegram-warehouse`)

```bash
docker-compose up -d postgres
```

**Wait 5-10 seconds** for the database to fully start.

**Verify it's running:**
```bash
docker ps
```
You should see `medical_postgres` in the list.

---

### Step 2: Start Dagster (Data Pipeline)
**Open Terminal 2** (in project root: `c:\tele\medical-telegram-warehouse`)

```bash
dagster dev -f pipeline.py
```

**Wait for:** `Serving dagster-webserver on http://127.0.0.1:3001`

Leave this terminal running.

---

### Step 3: Start FastAPI Backend
**Open Terminal 3** (in project root: `c:\tele\medical-telegram-warehouse`)

```bash
uvicorn api.main:app --reload --port 8000
```

**Wait for:** `Application startup complete`

Leave this terminal running.

---

### Step 4: Start Next.js Frontend
**Open Terminal 4** (in `c:\tele\medical-telegram-warehouse\frontend`)

```bash
cd frontend
npm run dev
```

**Wait for:** `Ready in X.Xs`

Leave this terminal running.

---

## Access the Application

Once all 4 services are running:

- **Main Application**: http://localhost:3000
- **Search Intelligence**: http://localhost:3000/search
- **Dagster UI**: http://localhost:3001
- **API Docs**: http://localhost:8000/docs

---

## Shutdown Commands

When you're done, shut down in reverse order:

1. **Frontend**: Press `Ctrl+C` in Terminal 4
2. **API**: Press `Ctrl+C` in Terminal 3
3. **Dagster**: Press `Ctrl+C` in Terminal 2
4. **Database**: 
   ```bash
   docker-compose down
   ```

---

## Troubleshooting

### "No Intelligence Matches" when searching
- **Cause**: Database not running
- **Fix**: Run Step 1 again

### API errors or connection refused
- **Cause**: Services started in wrong order
- **Fix**: Shut down all services and restart from Step 1

### Port already in use
- **Fix**: 
  ```bash
  # Find and kill the process using the port
  netstat -ano | findstr :8000
  taskkill /PID <process_id> /F
  ```

---

## Quick Start (All-in-One)

If you want to start everything at once, you can use these commands in separate terminals:

```bash
# Terminal 1
docker-compose up -d postgres && dagster dev -f pipeline.py

# Terminal 2
uvicorn api.main:app --reload --port 8000

# Terminal 3
cd frontend && npm run dev
```

**Note**: Wait 10 seconds after Terminal 1 starts before running Terminal 2.
