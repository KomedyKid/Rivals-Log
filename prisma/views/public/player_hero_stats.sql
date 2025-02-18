SELECT
  r.player_id,
  r.hero_id,
  count(r.report_id) AS total_reports,
  COALESCE(avg(r.rating), (0) :: numeric) AS avg_rating,
  count(lr.lord_report_id) AS lord_reports,
  CASE
    WHEN (count(lr.lord_report_id) >= 20) THEN 'Confirmed' :: text
    WHEN (count(lr.lord_report_id) >= 5) THEN 'Likely' :: text
    ELSE 'Unconfirmed' :: text
  END AS lord_status
FROM
  (
    reports r
    LEFT JOIN lord_reports lr ON (
      (
        (r.player_id = lr.player_id)
        AND (r.hero_id = lr.hero_id)
      )
    )
  )
GROUP BY
  r.player_id,
  r.hero_id;