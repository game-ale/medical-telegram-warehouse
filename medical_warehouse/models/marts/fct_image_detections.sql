with stg_yolo as (
    select * from {{ ref('stg_yolo_detections') }}
),

dim_channels as (
    select * from {{ ref('dim_channels') }}
),

fct_messages as (
    select message_id, date_key FROM {{ ref('fct_messages') }}
)

select
    stg_yolo.message_id,
    dim_channels.channel_key,
    fct_messages.date_key,
    stg_yolo.detected_object,
    stg_yolo.confidence_score,
    stg_yolo.image_category,
    stg_yolo.image_path
from stg_yolo
-- Join dim_channels on channel_name (present in staging)
left join dim_channels on stg_yolo.channel_name = dim_channels.channel_name
-- Join fct_messages to get the date_key (it already has it)
inner join fct_messages on stg_yolo.message_id = fct_messages.message_id
