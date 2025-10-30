-- 007_metrics_log.sql
CREATE TABLE IF NOT EXISTS metrics_logs (
  id SERIAL PRIMARY KEY,
  metric_name TEXT,
  metric_value NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);