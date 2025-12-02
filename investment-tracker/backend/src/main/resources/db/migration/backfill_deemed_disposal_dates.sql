-- Script to backfill deemed disposal dates for existing transactions
-- This script calculates the deemed disposal date (transaction date + 8 years) for all existing transactions
-- 
-- IMPORTANT: After the application starts successfully and creates the deemed_disposal_date column,
-- run this script via H2 Console or your SQL client to populate the dates for existing transactions.
--
-- How to run:
-- 1. Start the application (the column will be created automatically)
-- 2. Go to http://localhost:8080/h2-console
-- 3. Use JDBC URL: jdbc:h2:C:/Gav/workspaces/itr/db for etf app/h2 db
-- 4. Username: sa, Password: (leave empty)
-- 5. Execute this UPDATE statement

-- For H2 Database
UPDATE etf_transaction 
SET deemed_disposal_date = DATEADD('YEAR', 8, transaction_date)
WHERE deemed_disposal_date IS NULL;

-- For PostgreSQL (uncomment if using PostgreSQL)
-- UPDATE etf_transaction 
-- SET deemed_disposal_date = transaction_date + INTERVAL '8 years'
-- WHERE deemed_disposal_date IS NULL;
