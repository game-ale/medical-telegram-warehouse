with raw_detections as (
    -- Assuming CSV is loaded into a table named yolo_detections in the raw schema
    select * from {{ source('raw', 'yolo_detections') }}
)

select
    cast(message_id as bigint) as message_id,
    image_path,
    detected_class,
    cast(confidence_score as float) as confidence_score,
    image_category
from raw_detections
