# Dagster Pipeline Documentation

## Overview

The Medical Data Warehouse pipeline is orchestrated using Dagster, providing automated scheduling, monitoring, and failure handling for the entire ETL process.

**Pipeline File:** `pipeline.py`

---

## Pipeline Architecture

### Operations (Ops)

The pipeline consists of 4 sequential operations:

```
1. scrape_telegram_data
        ↓
2. load_raw_to_postgres
        ↓
3. run_dbt_transformations
        ↓
4. run_yolo_enrichment
```

#### Op 1: `scrape_telegram_data`
- **Purpose:** Scrape messages and images from Telegram channels
- **Calls:** `src/scraper.py`
- **Outputs:** Raw JSON files and images in `data/raw/`
- **Logs:** Channels scraped, messages collected

#### Op 2: `load_raw_to_postgres`
- **Purpose:** Load scraped data into PostgreSQL
- **Calls:** `scripts/load_to_postgres.py`
- **Outputs:** Data in `raw.telegram_messages` table
- **Logs:** Number of rows inserted

#### Op 3: `run_dbt_transformations`
- **Purpose:** Transform raw data into analytical models
- **Calls:** `scripts/dbt_wrapper.py run` and `test`
- **Outputs:** Tables in `public_marts` schema
- **Logs:** Models built, tests passed

#### Op 4: `run_yolo_enrichment`
- **Purpose:** Classify images and enrich data
- **Calls:** `src/yolo_detect.py` → `scripts/load_yolo_to_postgres.py`
- **Outputs:** `fct_image_detections` table updated
- **Logs:** Images processed, detections loaded

---

## Running the Pipeline

### 1. Start Dagster UI

```powershell
dagster dev -f pipeline.py
```

**Expected Output:**
```
Launching Dagster services...
Serving dagster-webserver on http://127.0.0.1:3000 in process 12345
```

### 2. Access the UI

Open your browser and navigate to:
```
http://localhost:3000
```

### 3. Navigate to the Job

1. In the left sidebar, click **"Jobs"**
2. Click on **"medical_data_pipeline"**
3. You'll see the job graph showing all 4 ops connected

### 4. Run the Pipeline Manually

**Option A: Via UI**
1. Click the **"Launchpad"** tab
2. Click **"Launch Run"** button
3. Monitor progress in real-time

**Option B: Via CLI**
```powershell
dagster job execute -f pipeline.py -j medical_data_pipeline
```

---

## Scheduling

The pipeline is configured to run automatically:

**Schedule:** Daily at 2:00 AM (Africa/Addis_Ababa timezone)

**Cron Expression:** `0 2 * * *`

### Enable the Schedule

1. In Dagster UI, go to **"Schedules"**
2. Find **"daily_pipeline_schedule"**
3. Toggle it **ON**

### View Schedule Runs

- Go to **"Runs"** tab to see all executions
- Filter by schedule to see automated runs

---

## Monitoring & Logs

### Viewing Logs

1. Click on any pipeline run
2. Click on individual ops to see their logs
3. Logs show:
   - Start time
   - Output from scripts
   - Success/failure status
   - Error messages (if any)

### Log Levels

Each op logs:
- ✅ **INFO:** Normal progress updates
- ⚠️ **WARNING:** Non-critical issues
- ❌ **ERROR:** Failures that stop the pipeline

---

## Troubleshooting

### Pipeline Fails at Op 1 (Scraping)

**Possible Causes:**
- Telegram session expired
- Network issues
- Invalid channel names

**Solution:**
```powershell
# Test scraper independently
python src/scraper.py
```

### Pipeline Fails at Op 2 (Loading)

**Possible Causes:**
- Database not running
- No data to load

**Solution:**
```powershell
# Check database
docker ps

# Test loader
python scripts/load_to_postgres.py
```

### Pipeline Fails at Op 3 (dbt)

**Possible Causes:**
- SQL errors in models
- Missing source data

**Solution:**
```powershell
# Run dbt manually
python scripts/dbt_wrapper.py run
python scripts/dbt_wrapper.py test
```

### Pipeline Fails at Op 4 (YOLO)

**Possible Causes:**
- No images to process
- YOLO model missing

**Solution:**
```powershell
# Check for images
ls data/raw/images/

# Test YOLO
python src/yolo_detect.py
```

---

## Testing the Pipeline

### Dry Run Test

Test each op independently before running the full pipeline:

```powershell
# 1. Test scraping
python src/scraper.py

# 2. Test loading
python scripts/load_to_postgres.py

# 3. Test dbt
python scripts/dbt_wrapper.py run

# 4. Test YOLO
python src/yolo_detect.py
python scripts/load_yolo_to_postgres.py
```

### Full Pipeline Test

```powershell
# Start Dagster
dagster dev -f pipeline.py

# In browser: http://localhost:3000
# Click "Launchpad" → "Launch Run"
```

---

## Pipeline Configuration

### Environment Variables

The pipeline reads from `.env`:

```env
# Telegram
TG_API_ID=your_api_id
TG_API_HASH=your_api_hash
TG_PHONE=your_phone

# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5433
DB_NAME=medical_warehouse
```

### Modifying the Schedule

Edit `pipeline.py`:

```python
@schedule(
    cron_schedule="0 2 * * *",  # Change this
    job=medical_data_pipeline,
    execution_timezone="Africa/Addis_Ababa"
)
```

**Common Cron Patterns:**
- `0 2 * * *` - Daily at 2 AM
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Weekly on Sunday at midnight
- `*/30 * * * *` - Every 30 minutes

---

## Advanced Features

### Retry Failed Ops

In the Dagster UI:
1. Click on a failed run
2. Click **"Re-execute"**
3. Select **"From failure"** to retry only failed ops

### Backfill Historical Data

```powershell
dagster job backfill -f pipeline.py -j medical_data_pipeline --from 2024-01-01 --to 2024-01-31
```

### Custom Run Configuration

In Launchpad, you can pass custom config:

```yaml
ops:
  scrape_telegram_data:
    config:
      channels: ["CheMed123", "DoctorsET"]
```

---

## Performance Tips

1. **Parallel Execution:** Ops run sequentially by design (dependencies)
2. **Resource Limits:** Monitor memory usage during YOLO processing
3. **Database Connections:** Ensure connection pooling is configured
4. **Logging:** Reduce log verbosity in production

---

## Screenshots Guide

### Required Screenshots for Documentation

1. **Job Graph View**
   - Shows all 4 ops connected
   - Path: Jobs → medical_data_pipeline → Graph

2. **Successful Run**
   - All ops green (completed)
   - Path: Runs → [select run] → Overview

3. **Op Logs**
   - Individual op showing logs
   - Path: Runs → [select run] → [click op]

4. **Schedule Configuration**
   - Daily schedule enabled
   - Path: Schedules → daily_pipeline_schedule

---

## Integration with API

The pipeline populates the database that the FastAPI endpoints query:

```
Pipeline → PostgreSQL → FastAPI
```

After each pipeline run:
- New messages available via `/api/search/messages`
- Updated stats in `/api/channels/{name}/activity`
- Fresh YOLO data in `/api/reports/visual-content`

---

## Production Deployment

### Using Dagster Cloud

1. Sign up at https://dagster.cloud
2. Deploy pipeline:
   ```powershell
   dagster-cloud deploy
   ```

### Self-Hosted

1. Use `dagster-daemon` for scheduling
2. Configure PostgreSQL for Dagster storage
3. Set up monitoring and alerts

---

## Common Commands

```powershell
# Start UI
dagster dev -f pipeline.py

# Execute job
dagster job execute -f pipeline.py -j medical_data_pipeline

# List jobs
dagster job list -f pipeline.py

# Validate pipeline
dagster job validate -f pipeline.py -j medical_data_pipeline
```

---

## Next Steps

1. ✅ Verify pipeline runs successfully end-to-end
2. ✅ Enable daily schedule
3. ✅ Set up monitoring/alerts
4. ✅ Document any custom configurations
5. ✅ Take screenshots for project documentation

---

**Last Updated:** 2026-02-02  
**Dagster Version:** 1.12.11  
**Pipeline File:** `pipeline.py`
