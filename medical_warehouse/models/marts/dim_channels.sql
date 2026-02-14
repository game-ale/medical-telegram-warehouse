with stg as (
    select * from {{ ref('stg_telegram_messages') }}
)

select
    {{ dbt_utils.generate_surrogate_key(['channel_name']) }} as channel_key,
    channel_name,
    -- Simple logic for type based on known channels, else 'General'
    case
        when channel_name ilike '%pharma%' then 'Pharmaceutical'
        when channel_name ilike '%cosmetics%' then 'Cosmetics'
        when channel_name ilike '%chemed%' then 'Medical'
        when channel_name ilike '%doctors%' then 'Medical'
        else 'General'
    end as channel_type,
    min(message_date) as first_post_date,
    max(message_date) as last_post_date,
    count(*) as total_posts,
    avg(views) as avg_views
from stg
group by 1, 2, 3
