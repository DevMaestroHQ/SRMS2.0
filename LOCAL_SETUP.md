# Local Development Setup - No Database Required

## Quick Start

Your University Result Management System now runs completely locally without needing PostgreSQL or any external database. All data is stored in a local JSON file.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment (Optional)
```bash
cp .env.example .env.local
```

### 3. Run the Application
```bash
npm run dev
```

The app will be available at: `http://localhost:5000`

## What Changed

### ✅ **No Database Required**
- Removed PostgreSQL dependency
- All data stored in `data/database.json` file
- JSON file automatically created on first run

### ✅ **Simplified Setup**
- No need to set up database connections
- No environment variables required (defaults provided)
- Works offline completely

### ✅ **Same Features**
- All original features work exactly the same
- Admin dashboard, file uploads, OCR processing
- Student search, PDF downloads
- Semester management, activity tracking

## Default Admin Credentials

- **Email**: `admin@university.edu`
- **Password**: `admin123`

You can change these in the admin profile after logging in.

## File Structure

```
project/
├── data/
│   └── database.json          # All application data
├── uploads/                   # Uploaded student images
├── pdfs/                      # Generated PDF files
├── server/
│   ├── json-storage.ts        # Local JSON database
│   └── storage.ts             # Storage interface
└── .env.local                 # Local environment config
```

## How It Works

### Data Storage
- All data stored in `data/database.json`
- Automatic file creation and management
- Thread-safe read/write operations
- Backup your `data/` folder to preserve data

### File Operations
- Student images uploaded to `uploads/` folder
- PDFs generated in `pdfs/` folder
- OCR processing works the same way
- File cleanup on errors

### Development Features
- Hot reload works perfectly
- All original API endpoints unchanged
- Same authentication and security
- Same admin dashboard and features

## Production Deployment

### Option 1: Keep JSON Storage (Simple)
- Deploy as-is to any platform
- Include `data/database.json` in deployment
- Good for small to medium usage

### Option 2: Add Database Later
- Switch back to PostgreSQL for production
- Change `server/storage.ts` to use `DatabaseStorage`
- Add `DATABASE_URL` environment variable

## File Management

### Backup Data
```bash
# Backup all data
cp -r data/ backup/
cp -r uploads/ backup/
cp -r pdfs/ backup/
```

### Reset Data
```bash
# Delete all data and start fresh
rm -rf data/ uploads/ pdfs/
```

### View Data
```bash
# View current data
cat data/database.json | jq '.'
```

## Troubleshooting

### App Won't Start
- Make sure you ran `npm install`
- Check if port 5000 is available
- Delete `data/database.json` if corrupted

### OCR Not Working
- Check if images are JPG/PNG format
- Ensure images are clear and readable
- Try smaller image files

### Can't Login
- Use default credentials: `admin@university.edu` / `admin123`
- Delete `data/database.json` to reset admin user
- Check console for error messages

## Advantages of JSON Storage

### ✅ **Pros**
- No database setup required
- Works offline
- Easy to backup and restore
- Simple to debug and inspect data
- Fast for small datasets
- No connection issues

### ⚠️ **Considerations**
- Not suitable for very large datasets (1000+ records)
- No concurrent write protection
- File-based storage limitations
- Manual backup required

## Converting Back to Database

If you need to switch back to PostgreSQL later:

1. Keep the current `server/json-storage.ts`
2. Update `server/storage.ts` to use database storage
3. Add `DATABASE_URL` environment variable
4. Run database migrations if needed

The JSON storage can also be used to migrate data to a database later.

## Summary

Your app is now completely self-contained and runs locally without any external dependencies. Perfect for development, testing, and small-scale deployments.