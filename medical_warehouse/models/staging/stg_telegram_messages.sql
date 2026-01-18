
with raw_data as (
    select * from {{ source('raw', 'telegram_messages') }}
),

flattened as (
    select
        message_id,
        channel_name,
        cast(date as timestamp) as message_date,
        -- Extract fields from JSONB
        cast(message_data->>'views' as integer) as view_count,
        cast(message_data->>'forwards' as integer) as forward_count,
        cast(message_data->>'message_text' as text) as message_text,
        cast(message_data->>'has_media' as boolean) as has_media,
        message_data->>'image_path' as image_path
    from raw_data
)

select
    *,
    LENGTH(message_text) as message_length
from flattened
where message_id is not null
