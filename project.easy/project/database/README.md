# Recycle Hub - Complete Database Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup](#database-setup)
4. [Step-by-Step Implementation](#step-by-step-implementation)
5. [Data Population](#data-population)
6. [Testing & Validation](#testing--validation)
7. [Performance Optimization](#performance-optimization)
8. [Maintenance & Monitoring](#maintenance--monitoring)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide provides complete instructions for implementing the Recycle Hub database system, including schema creation, data population, and optimization strategies.

### Database Features
- **Complete User Management** (Normal, Scrap Collectors, Admins)
- **Product Listings** (Thrift, Books, Free Items, Scrap)
- **Transaction Processing** (Orders, Payments, Delivery)
- **Points & Gamification System**
- **Admin Analytics & Monitoring**
- **Security & Audit Logging**

---

## 🔧 Prerequisites

### Required Software
- **PostgreSQL 12+** (Recommended: PostgreSQL 14+)
- **Database Client** (pgAdmin, DBeaver, or psql CLI)
- **Node.js 16+** (for application integration)

### System Requirements
- **RAM**: Minimum 4GB (8GB+ recommended)
- **Storage**: 10GB+ available space
- **Network**: Internet connection for external dependencies

---

## 🗄️ Database Setup

### Step 1: Create Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE recycle_hub;
CREATE USER recycle_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE recycle_hub TO recycle_admin;

-- Connect to the new database
\c recycle_hub;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes
```

### Step 2: Set Database Configuration
```sql
-- Optimize for application workload
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Reload configuration
SELECT pg_reload_conf();
```

---

## 🚀 Step-by-Step Implementation

### Phase 1: Core Schema Creation

#### Step 1: Create Core Tables
```bash
# Execute the main schema file
psql -U recycle_admin -d recycle_hub -f database/schema.sql
```

**Verify Core Tables:**
```sql
-- Check if all tables are created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- admin_logs, categories, favorites, messages, notifications
-- pickup_requests, points_history, product_images, products
-- reviews, transactions, users
```

#### Step 2: Verify Table Structure
```sql
-- Check users table structure
\d users;

-- Check products table structure  
\d products;

-- Check transactions table structure
\d transactions;

-- Verify foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Phase 2: Stored Procedures & Functions

#### Step 3: Install Business Logic Functions
```bash
# Execute stored procedures
psql -U recycle_admin -d recycle_hub -f database/stored_procedures.sql
```

**Verify Functions:**
```sql
-- List all custom functions
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Test a sample function
SELECT * FROM register_user(
    'test@example.com',
    'hashed_password',
    'Test User',
    'normal',
    '1234567890',
    '123 Test St',
    'Test City',
    'Test State',
    '12345'
);
```

### Phase 3: Indexes & Performance

#### Step 4: Create Performance Indexes
```sql
-- Additional performance indexes
CREATE INDEX CONCURRENTLY idx_products_search 
ON products USING gin(to_tsvector('english', title || ' ' || description));

CREATE INDEX CONCURRENTLY idx_products_location_gin 
ON products USING gin(location gin_trgm_ops);

CREATE INDEX CONCURRENTLY idx_users_email_hash 
ON users USING hash(email);

CREATE INDEX CONCURRENTLY idx_transactions_date_status 
ON transactions(created_at, payment_status) 
WHERE payment_status IN ('pending', 'completed');

-- Verify indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 📊 Data Population

### Step 5: Insert Sample Data

#### Categories
```sql
INSERT INTO categories (name, description) VALUES
('Clothing', 'Clothes, shoes, and accessories'),
('Furniture', 'Home and office furniture'),
('Electronics', 'Electronic devices and gadgets'),
('Books', 'Books, magazines, and educational materials'),
('Home & Garden', 'Home decor and gardening items'),
('Sports & Recreation', 'Sports equipment and recreational items');
```

#### Sample Users
```sql
-- Admin user
SELECT register_user(
    'admin@gmail.com',
    '$2b$10$hash_for_admin',
    'Admin User',
    'admin',
    '+91-9999999999',
    'Admin Office, Tech Park',
    'Mumbai',
    'Maharashtra',
    '400001'
);

-- Normal users
SELECT register_user(
    'priya@gmail.com',
    '$2b$10$hash_for_priya',
    'Priya Sharma',
    'normal',
    '+91-9876543210',
    '123 Green Street',
    'Mumbai',
    'Maharashtra',
    '400002'
);

-- Scrap collectors
SELECT register_user(
    'collector@gmail.com',
    '$2b$10$hash_for_collector',
    'Rahul Kumar',
    'scrap_collector',
    '+91-9876543211',
    '456 Recycle Road',
    'Delhi',
    'Delhi',
    '110001'
);
```

#### Sample Products
```sql
-- Get user and category IDs for sample products
DO $$
DECLARE
    user_id UUID;
    category_id UUID;
BEGIN
    -- Get a normal user ID
    SELECT id INTO user_id FROM users WHERE email = 'priya@gmail.com';
    
    -- Get clothing category ID
    SELECT id INTO category_id FROM categories WHERE name = 'Clothing';
    
    -- Insert sample thrift item
    INSERT INTO products (title, description, price, category_id, listing_type, condition, seller_id, location)
    VALUES (
        'Vintage Leather Jacket',
        'Classic brown leather jacket in excellent condition. Perfect for fall weather.',
        2500.00,
        category_id,
        'thrift',
        'excellent',
        user_id,
        'Mumbai, Maharashtra'
    );
END $$;
```

### Step 6: Verify Data Population
```sql
-- Check data counts
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL  
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions;

-- Verify user types distribution
SELECT user_type, COUNT(*) as count 
FROM users 
GROUP BY user_type;

-- Check product listing types
SELECT listing_type, COUNT(*) as count 
FROM products 
GROUP BY listing_type;
```

---

## ✅ Testing & Validation

### Step 7: Functional Testing

#### Test User Registration
```sql
-- Test normal user registration
SELECT * FROM register_user(
    'testuser@example.com',
    'hashed_password_123',
    'Test User',
    'normal',
    '+91-9999888877',
    '789 Test Avenue',
    'Bangalore',
    'Karnataka',
    '560001'
);
```

#### Test Product Creation
```sql
-- Test product listing
SELECT * FROM create_product_listing(
    'Test Product',
    'This is a test product description',
    999.99,
    'Electronics',
    'thrift',
    'good',
    (SELECT id FROM users WHERE email = 'testuser@example.com'),
    'Bangalore, Karnataka',
    12.9716,
    77.5946,
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
);
```

#### Test Points System
```sql
-- Test points awarding
SELECT * FROM award_points(
    (SELECT id FROM users WHERE email = 'testuser@example.com'),
    50,
    'free_donation',
    'Test free item donation',
    NULL
);

-- Verify points were awarded
SELECT points, total_donations 
FROM users 
WHERE email = 'testuser@example.com';
```

### Step 8: Performance Testing
```sql
-- Test search performance
EXPLAIN ANALYZE 
SELECT * FROM search_products(
    'jacket',
    'all',
    'all', 
    'all',
    NULL,
    NULL,
    NULL,
    'relevance',
    20,
    0
);

-- Test analytics performance
EXPLAIN ANALYZE
SELECT * FROM get_platform_analytics(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE
);
```

---

## ⚡ Performance Optimization

### Step 9: Query Optimization

#### Analyze Query Performance
```sql
-- Enable query statistics
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
SELECT pg_reload_conf();

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

#### Optimize Frequently Used Queries
```sql
-- Create materialized view for analytics
CREATE MATERIALIZED VIEW mv_platform_stats AS
SELECT 
    COUNT(CASE WHEN user_type != 'admin' THEN 1 END) as total_users,
    COUNT(CASE WHEN user_type = 'scrap_collector' THEN 1 END) as total_collectors,
    (SELECT COUNT(*) FROM products WHERE is_available = true) as total_products,
    (SELECT COUNT(*) FROM transactions) as total_transactions,
    (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE payment_status = 'completed') as total_revenue
FROM users;

-- Refresh materialized view (run periodically)
REFRESH MATERIALIZED VIEW mv_platform_stats;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_mv_platform_stats ON mv_platform_stats (total_users);
```

### Step 10: Database Maintenance
```sql
-- Set up automatic vacuum and analyze
ALTER TABLE users SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE products SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE transactions SET (autovacuum_vacuum_scale_factor = 0.05);

-- Manual maintenance (run weekly)
VACUUM ANALYZE users;
VACUUM ANALYZE products;
VACUUM ANALYZE transactions;

-- Update table statistics
ANALYZE;
```

---

## 🔧 Maintenance & Monitoring

### Step 11: Set Up Monitoring

#### Create Monitoring Views
```sql
-- Database size monitoring
CREATE VIEW v_database_size AS
SELECT 
    pg_size_pretty(pg_database_size('recycle_hub')) as database_size,
    pg_size_pretty(pg_total_relation_size('users')) as users_table_size,
    pg_size_pretty(pg_total_relation_size('products')) as products_table_size,
    pg_size_pretty(pg_total_relation_size('transactions')) as transactions_table_size;

-- Active connections monitoring
CREATE VIEW v_active_connections AS
SELECT 
    datname,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity 
WHERE datname = 'recycle_hub';
```

#### Set Up Automated Cleanup
```sql
-- Create cleanup function
CREATE OR REPLACE FUNCTION automated_cleanup()
RETURNS void AS $$
BEGIN
    -- Clean up old notifications
    DELETE FROM notifications 
    WHERE created_at < CURRENT_DATE - INTERVAL '30 days' 
    AND is_read = true;
    
    -- Archive old transactions
    UPDATE transactions 
    SET delivery_status = 'archived'
    WHERE created_at < CURRENT_DATE - INTERVAL '1 year' 
    AND payment_status = 'completed';
    
    -- Update statistics
    ANALYZE;
    
    RAISE NOTICE 'Automated cleanup completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (add to cron or application scheduler)
-- SELECT automated_cleanup();
```

### Step 12: Backup Strategy
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="recycle_hub_backup_$DATE.sql"

# Create backup
pg_dump -U recycle_admin -h localhost recycle_hub > "$BACKUP_DIR/$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "recycle_hub_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Connection Problems
```sql
-- Check connection limits
SHOW max_connections;
SELECT count(*) FROM pg_stat_activity;

-- Increase connections if needed
ALTER SYSTEM SET max_connections = 200;
SELECT pg_reload_conf();
```

#### Issue 2: Slow Queries
```sql
-- Identify slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements 
WHERE mean_time > 1000  -- queries taking more than 1 second
ORDER BY mean_time DESC;

-- Check missing indexes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND n_distinct > 100;
```

#### Issue 3: Disk Space Issues
```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Clean up if needed
SELECT automated_cleanup();
VACUUM FULL;  -- Use with caution, locks tables
```

---

## 📈 Performance Benchmarks

### Expected Performance Metrics
- **User Registration**: < 100ms
- **Product Search**: < 200ms
- **Transaction Processing**: < 500ms
- **Analytics Queries**: < 1s
- **Concurrent Users**: 100+ simultaneous connections

### Monitoring Queries
```sql
-- Check query performance
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch
FROM pg_stat_user_tables;

-- Monitor index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## 🎯 Next Steps

1. **Application Integration**: Connect your Node.js/React application
2. **Security Hardening**: Implement row-level security (RLS)
3. **Scaling**: Consider read replicas for high traffic
4. **Monitoring**: Set up automated alerts and dashboards
5. **Testing**: Implement comprehensive test suites

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review PostgreSQL documentation
3. Consult the application logs
4. Contact the development team

---

**Database Implementation Complete! 🎉**

Your Recycle Hub database is now ready for production use with full functionality, optimization, and monitoring capabilities.