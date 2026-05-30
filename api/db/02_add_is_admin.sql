-- =====================================================================
-- Phase 4 migration — additive, non-destructive.
-- Adds an IS_ADMIN flag to the visitor table for role-based access.
-- Safe to re-run (guards against "column already exists").
-- Does NOT modify queries.sql.
-- =====================================================================

-- Add IS_ADMIN column only if it does not already exist.
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM user_tab_columns
  WHERE table_name = 'VISITOR' AND column_name = 'IS_ADMIN';

  IF v_count = 0 THEN
    EXECUTE IMMEDIATE
      'ALTER TABLE visitor ADD (is_admin NUMBER(1) DEFAULT 0 NOT NULL)';
  END IF;
END;
/

-- Seed: promote the first seeded visitor to admin for demo/testing.
-- Adjust the email below to whichever account you want as admin.
UPDATE visitor SET is_admin = 1 WHERE visitor_id = 100;

COMMIT;

-- Verify
SELECT visitor_id, visitor_name, visitor_email, is_admin
FROM visitor
ORDER BY visitor_id;
