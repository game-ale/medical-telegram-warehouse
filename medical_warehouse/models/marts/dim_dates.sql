
{{ config(materialized='table') }}

with dates as (
    select distinct cast(message_date as date) as full_date
    from {{ ref('stg_telegram_messages') }}
)

select
    {{ dbt_utils.generate_surrogate_key(['full_date']) }} as date_key,
    full_date,
    extract(year from full_date) as year,
    extract(month from full_date) as month,
    to_char(full_date, 'Month') as month_name,
    extract(day from full_date) as day,
    extract(dow from full_date) as day_of_week,
    extract(quarter from full_date) as quarter,
    case
        when extract(dow from full_date) in (0, 6) then true
        else false
    end as is_weekend
from dates
