{{ config(materialized='table') }}

with detections as (
    select * from {{ ref('stg_yolo_detections') }}
),
messages as (
    select * from {{ ref('fct_messages') }}
),
dim_channels as (
    select * from {{ ref('dim_channels') }}
),
dim_dates as (
    select * from {{ ref('dim_dates') }}
)

select
    detections.message_id,
    dim_channels.channel_key,
    dim_dates.date_key,
    detections.class_name,
    detections.confidence
from detections
left join messages on detections.message_id = messages.message_id
left join dim_channels on detections.channel_name = dim_channels.channel_name
left join dim_dates on messages.date_key = dim_dates.date_key
