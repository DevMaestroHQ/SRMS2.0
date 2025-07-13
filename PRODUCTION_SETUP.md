# Production Setup Guide

## Changing Default Admin Credentials

### Method 1: Environment Variables (Recommended)

Set these environment variables in your production environment:

```bash
# Required: Admin login credentials
ADMIN_EMAIL=your-admin@university.edu
ADMIN_PASSWORD=your-secure-password-here
ADMIN_NAME=Your Admin Name

# Required: Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

### Method 2: Direct Code Changes

If you can't use environment variables, modify the file `server/storage.ts`:

```typescript
// Change these lines in the initializeDefaultAdmin() method:
const adminEmail = "your-admin@university.edu";  // Change this
const adminPassword = "your-secure-password";     // Change this
const adminName = "Your Admin Name";              // Change this
```

## Security Checklist for Production

✅ **Admin Credentials**
- [ ] Set `ADMIN_EMAIL` to your production email
- [ ] Set `ADMIN_PASSWORD` to a strong password (minimum 12 characters)
- [ ] Set `ADMIN_NAME` to the administrator's name

✅ **JWT Security**
- [ ] Set `JWT_SECRET` to a random 32+ character string
- [ ] Never use the default "your-secret-key-change-in-production"

✅ **Database**
- [ ] Use PostgreSQL production database (not in-memory storage)
- [ ] Set proper `DATABASE_URL` connection string

✅ **Environment Configuration**
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper domain and SSL certificates

## Example Production Environment Variables

```bash
# Admin Configuration
ADMIN_EMAIL=admin@tribhuvan.edu.np
ADMIN_PASSWORD=SecurePass123!@#
ADMIN_NAME=University Administrator

# Security
JWT_SECRET=your-random-32-char-secret-key-here
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/university_results
```

## Deployment Steps

1. **Set Environment Variables** in your hosting platform
2. **Build the Application**: `npm run build`
3. **Start Production Server**: `npm start`
4. **Verify Login** with your new credentials

## Important Notes

- The default credentials (admin@university.edu / admin123) only show in development mode
- In production, the login page will show "Contact administrator for login credentials"
- Always use strong passwords and unique JWT secrets
- Consider using a proper database instead of in-memory storage for production