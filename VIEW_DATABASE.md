# How to View the User Database

## Method 1: DB Browser for SQLite (Recommended - GUI)

### Download and Install:
1. Download from: https://sqlitebrowser.org/dl/
2. Install DB Browser for SQLite
3. Open the application

### View Database:
1. Click "Open Database"
2. Navigate to: `D:\Job_Portal_Ecosystem\server\database.sqlite`
3. Click "Browse Data" tab
4. Select "Users" table from dropdown

You can now see all users with their:
- ID, Name, Email
- Skills, Experience
- Preferred Roles, Locations
- Profile completion status
- Created/Updated dates

### Query Users:
Click "Execute SQL" tab and run queries like:
```sql
-- View all users
SELECT * FROM Users;

-- View specific user
SELECT * FROM Users WHERE email = 'bikram8548@gmail.com';

-- Count total users
SELECT COUNT(*) FROM Users;

-- View users with their applications
SELECT u.name, u.email, COUNT(a.id) as application_count
FROM Users u
LEFT JOIN Applications a ON u.id = a.userId
GROUP BY u.id;
```

## Method 2: Command Line (SQLite CLI)

### Install SQLite CLI:
Download from: https://www.sqlite.org/download.html

### View Database:
```bash
# Navigate to server folder
cd server

# Open database
sqlite3 database.sqlite

# View all tables
.tables

# View Users table structure
.schema Users

# Query all users
SELECT * FROM Users;

# Pretty format
.mode column
.headers on
SELECT id, name, email, profileComplete FROM Users;

# Exit
.quit
```

## Method 3: Node.js Script (Programmatic)

I'll create a script for you to view users easily.

## Method 4: API Endpoint (Create Admin Route)

I can create an admin API endpoint to view all users.

## Current Database Location

**File Path:** `D:\Job_Portal_Ecosystem\server\database.sqlite`

You can:
- Copy this file as backup
- Open it with any SQLite viewer
- Query it programmatically

## Quick View Script

Run this command to see all users:
```bash
cd server
node -e "const {User} = require('./models'); const {connectDB} = require('./config/database'); connectDB().then(async () => { const users = await User.findAll({attributes: ['id', 'name', 'email', 'profileComplete', 'createdAt']}); console.table(users.map(u => u.toJSON())); process.exit(0); });"
```
