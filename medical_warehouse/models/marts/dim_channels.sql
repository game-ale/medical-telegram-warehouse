
with staging as (
    select * from {{ ref('stg_telegram_messages') }}
),

channel_stats as (
    select
        channel_name,
        min(message_date) as first_post_date,
        max(message_date) as last_post_date,
        count(*) as total_posts,
        avg(view_count) as avg_views
    from staging
    group by 1
)

select
    {{ dbt_utils.generate_surrogate_key(['channel_name']) }} as channel_key,
    channel_name,
    case
        when lower(channel_name) like '%pharma%' then 'Pharmaceutical'
        when lower(channel_name) like '%cosmetic%' then 'Cosmetics'
        when lower(channel_name) like '%clinic%' or lower(channel_name) like '%medical%' or lower(channel_name) like '%doctor%' then 'Medical'
        else 'General Health'
    end as channel_type,
    first_post_date,
    last_post_date,
    total_posts,
    round(avg_views, 2) as avg_views
from channel_stats
