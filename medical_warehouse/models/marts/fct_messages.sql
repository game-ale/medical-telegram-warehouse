with stg as (
    select * from {{ ref('stg_telegram_messages') }}
),

dim_channels as (
    select * from {{ ref('dim_channels') }}
),

dim_dates as (
    select * from {{ ref('dim_dates') }}
)

select
    stg.message_id,
    dim_channels.channel_key,
    dim_dates.date_key,
    stg.message_text,
    stg.message_length,
    stg.views as view_count,
    stg.forwards as forward_count,
    stg.has_media,
    stg.image_path
from stg
left join dim_channels on stg.channel_name = dim_channels.channel_name
left join dim_dates on date_trunc('day', stg.message_date)::date = dim_dates.full_date
