
{{ config(materialized='table') }}

with staging as (
    select * from {{ ref('stg_telegram_messages') }}
),
dim_channels as (
    select * from {{ ref('dim_channels') }}
),
dim_dates as (
    select * from {{ ref('dim_dates') }}
)

select
    staging.message_id,
    dim_channels.channel_key,
    dim_dates.date_key,
    staging.message_text,
    staging.message_length,
    staging.view_count,
    staging.forward_count,
    staging.has_media
from staging
left join dim_channels on staging.channel_name = dim_channels.channel_name
left join dim_dates on cast(staging.message_date as date) = dim_dates.full_date
