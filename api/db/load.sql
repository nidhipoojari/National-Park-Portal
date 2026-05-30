-- Wrapper to load the project schema reliably under SQL*Plus.
-- The source script contains blank lines inside multi-line CREATE TABLE
-- statements; SQLBLANKLINES ON keeps those statements intact.
SET SQLBLANKLINES ON
SET DEFINE OFF
SET ECHO OFF
WHENEVER SQLERROR CONTINUE
@/tmp/schema.sql
EXIT
