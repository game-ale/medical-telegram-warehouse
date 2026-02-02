with source as (
    select * from {{ source('raw', 'yolo_detections') }}
),

renamed as (
    select
        id,
        message_id,
        channel_name,
        image_path,
        detected_object,
        cast(confidence_score as numeric) as confidence_score,
        image_category,
        loaded_at
    from source
)

select * from renamed
