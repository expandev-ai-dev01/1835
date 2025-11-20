-- =====================================================
-- Database Migration: Initial Schema
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_repositoryname]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
-- =====================================================

-- =====================================================
-- SYSTEM TABLES (Infrastructure)
-- =====================================================

-- Create system health check table to verify migration success
CREATE TABLE [dbo].[system_health] (
    [id] INT IDENTITY(1,1) NOT NULL,
    [check_date] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [status] NVARCHAR(50) NOT NULL DEFAULT 'OK'
);
GO

ALTER TABLE [dbo].[system_health]
ADD CONSTRAINT [pkSystemHealth] PRIMARY KEY CLUSTERED ([id]);
GO

-- =====================================================
-- FEATURE TABLES
-- =====================================================
-- Add your feature tables here (e.g., purchases, categories)
-- Remember to use [dbo] schema and camelCase column names
-- Example:
-- CREATE TABLE [dbo].[purchases] (...);
-- GO
