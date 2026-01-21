from dagster import Definitions, load_assets_from_modules, define_asset_job, ScheduleDefinition
from . import assets

all_assets = load_assets_from_modules([assets])

medical_pipeline_job = define_asset_job("medical_pipeline", selection="*")

# Run the pipeline daily at midnight
daily_schedule = ScheduleDefinition(
    job=medical_pipeline_job,
    cron_schedule="0 0 * * *",
)

defs = Definitions(
    assets=all_assets,
    jobs=[medical_pipeline_job],
    schedules=[daily_schedule]
)
