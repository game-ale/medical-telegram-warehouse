{{ config(materialized='table') }}

with detections as (
    select * from {{ ref('stg_yolo_detections') }}
),
messages as (
    select * from {{ ref('fct_messages') }}
)

select
    detections.message_id,
    messages.channel_key,
    messages.date_key,
    detections.detected_class,
    detections.confidence_score,
    detections.image_category
from detections
inner join messages on detections.message_id = messages.message_id
