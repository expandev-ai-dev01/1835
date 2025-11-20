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

-- Create purchases table
CREATE TABLE [dbo].[purchases] (
    [idPurchase] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [idAccount] INT NOT NULL,
    [productName] NVARCHAR(100) NOT NULL,
    [quantity] DECIMAL(10,3) NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    [totalItemPrice] DECIMAL(10,2) NOT NULL,
    [purchaseDate] DATE NOT NULL,
    [createdAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [updatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [deleted] BIT NOT NULL DEFAULT 0
);
GO

ALTER TABLE [dbo].[purchases]
ADD CONSTRAINT [pkPurchases] PRIMARY KEY NONCLUSTERED ([idPurchase]);
GO

CREATE CLUSTERED INDEX [ixPurchases_Clustered] ON [dbo].[purchases]([createdAt]);
GO

CREATE NONCLUSTERED INDEX [ixPurchases_Account_Date]
ON [dbo].[purchases]([idAccount], [purchaseDate])
INCLUDE ([totalItemPrice])
WHERE [deleted] = 0;
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseCreate]
    @idAccount INT,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @price DECIMAL(10,2),
    @purchaseDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @totalItemPrice DECIMAL(10,2) = ROUND(@quantity * @price, 2);
    DECLARE @newId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO [dbo].[purchases] (
        [idPurchase],
        [idAccount],
        [productName],
        [quantity],
        [price],
        [totalItemPrice],
        [purchaseDate],
        [createdAt],
        [updatedAt],
        [deleted]
    )
    VALUES (
        @newId,
        @idAccount,
        @productName,
        @quantity,
        @price,
        @totalItemPrice,
        @purchaseDate,
        GETUTCDATE(),
        GETUTCDATE(),
        0
    );

    SELECT @newId AS [idPurchase];
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseUpdate]
    @idPurchase UNIQUEIDENTIFIER,
    @idAccount INT,
    @productName NVARCHAR(100),
    @quantity DECIMAL(10,3),
    @price DECIMAL(10,2),
    @purchaseDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchases] WHERE [idPurchase] = @idPurchase AND [idAccount] = @idAccount AND [deleted] = 0)
    BEGIN
        ;THROW 51000, 'purchaseNotFound', 1;
    END;

    DECLARE @totalItemPrice DECIMAL(10,2) = ROUND(@quantity * @price, 2);

    UPDATE [dbo].[purchases]
    SET
        [productName] = @productName,
        [quantity] = @quantity,
        [price] = @price,
        [totalItemPrice] = @totalItemPrice,
        [purchaseDate] = @purchaseDate,
        [updatedAt] = GETUTCDATE()
    WHERE [idPurchase] = @idPurchase
      AND [idAccount] = @idAccount;

    SELECT [idPurchase] FROM [dbo].[purchases] WHERE [idPurchase] = @idPurchase;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseDelete]
    @idPurchase UNIQUEIDENTIFIER,
    @idAccount INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM [dbo].[purchases] WHERE [idPurchase] = @idPurchase AND [idAccount] = @idAccount AND [deleted] = 0)
    BEGIN
        ;THROW 51000, 'purchaseNotFound', 1;
    END;

    UPDATE [dbo].[purchases]
    SET [deleted] = 1,
        [updatedAt] = GETUTCDATE()
    WHERE [idPurchase] = @idPurchase
      AND [idAccount] = @idAccount;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseGet]
    @idPurchase UNIQUEIDENTIFIER,
    @idAccount INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [idPurchase],
        [idAccount],
        [productName],
        [quantity],
        [price],
        [totalItemPrice],
        [purchaseDate],
        [createdAt],
        [updatedAt]
    FROM [dbo].[purchases]
    WHERE [idPurchase] = @idPurchase
      AND [idAccount] = @idAccount
      AND [deleted] = 0;
END;
GO

CREATE OR ALTER PROCEDURE [dbo].[spPurchaseList]
    @idAccount INT,
    @page INT = 1,
    @pageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @offset INT = (@page - 1) * @pageSize;
    DECLARE @currentMonth INT = MONTH(GETDATE());
    DECLARE @currentYear INT = YEAR(GETDATE());

    -- Result Set 1: Metadata & Summary
    SELECT
        (SELECT COUNT(*) FROM [dbo].[purchases] WHERE [idAccount] = @idAccount AND [deleted] = 0) AS [totalRecords],
        ISNULL((SELECT SUM([totalItemPrice]) 
         FROM [dbo].[purchases] 
         WHERE [idAccount] = @idAccount 
           AND [deleted] = 0
           AND MONTH([purchaseDate]) = @currentMonth
           AND YEAR([purchaseDate]) = @currentYear), 0) AS [totalSpentCurrentMonth];

    -- Result Set 2: Data
    SELECT
        [idPurchase],
        [idAccount],
        [productName],
        [quantity],
        [price],
        [totalItemPrice],
        [purchaseDate],
        [createdAt],
        [updatedAt]
    FROM [dbo].[purchases]
    WHERE [idAccount] = @idAccount
      AND [deleted] = 0
    ORDER BY [purchaseDate] DESC, [createdAt] DESC
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END;
GO