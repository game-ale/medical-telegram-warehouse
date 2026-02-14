with source as (
    select * from {{ source('raw', 'telegram_messages') }}
),

renamed as (
    select
        id as raw_id,
        message_id,
        channel_name,
        cast(message_date as timestamp) as message_date,
        -- Handle null text
        coalesce(message_text, '') as message_text,
        cast(views as integer) as views,
        cast(forwards as integer) as forwards,
        cast(has_media as boolean) as has_media,
        image_path,
        loaded_at,
        -- Calculated fields
        length(coalesce(message_text, '')) as message_length
    from source
    where message_id is not null
)

select * from renamed
