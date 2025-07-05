# Recycle Hub Database - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- PostgreSQL 12+ installed
- Database client (psql, pgAdmin, etc.)
- Basic SQL knowledge

### Step 1: Create Database (2 minutes)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE recycle_hub;
CREATE USER recycle_admin WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE recycle_hub TO recycle_admin;

# Connect to new database
\c recycle_hub;

# Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Deploy Schema (2 minutes)
```bash
# Execute schema file
psql -U recycle_admin -d recycle_hub -f database/schema.sql

# Deploy stored procedures
psql -U recycle_admin -d recycle_hub -f database/stored_procedures.sql
```

### Step 3: Verify Installation (1 minute)
```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Test admin login
SELECT * FROM users WHERE email = 'admin@gmail.com';

-- Check sample data
SELECT listing_type, COUNT(*) FROM products GROUP BY listing_type;
```

## ✅ You're Ready!

Your Recycle Hub database is now operational with:
- ✅ Complete schema deployed
- ✅ Admin user configured
- ✅ Sample data loaded
- ✅ All features functional

### Next Steps:
1. Connect your application
2. Configure environment variables
3. Test all functionality
4. Deploy to production

### Need Help?
- Check `database/README.md` for detailed guide
- Review `database/deployment-checklist.md` for production
- Consult troubleshooting section for issues