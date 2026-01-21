with raw_detections as (
    select * from {{ source('raw', 'yolo_detections') }}
),

flattened as (
    select
        message_id,
        channel_name,
        jsonb_array_elements(detection_data) as detection
    from raw_detections
)

select
    message_id,
    channel_name,
    detection->>'class' as class_name,
    cast(detection->>'confidence' as float) as confidence,
    detection->>'bbox' as bbox
from flattened
