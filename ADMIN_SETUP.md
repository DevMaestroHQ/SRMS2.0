# Admin Setup Guide

## Quick Start for Admin Credentials

### Development Environment
The default admin credentials are:
- **Email**: admin@university.edu
- **Password**: admin123

### Production Environment
For production deployment, you have two options:

#### Option 1: Environment Variables (Recommended)
Set these environment variables before starting the application:
```bash
ADMIN_EMAIL=your-email@university.edu
ADMIN_PASSWORD=your-secure-password
ADMIN_NAME=Your Full Name
```

#### Option 2: Change Through Admin Panel
1. Use the default credentials to log in initially
2. Navigate to Admin Dashboard → Admin Management
3. Use the "Update Profile" section to change your name and email
4. Use the "Change Password" section to update your password

## How to Change Admin Credentials

### Method 1: Through Admin Panel (Easiest)

1. **Log in to Admin Panel**
   - Go to the admin login page
   - Enter your current credentials

2. **Update Profile Information**
   - Click on "Admin Management" tab
   - Find the "Update Profile" card
   - Enter your new name and email
   - Enter your current password to confirm
   - Click "Update Profile"

3. **Change Password**
   - Still in "Admin Management" tab
   - Find the "Change Password" card
   - Enter your current password
   - Enter your new password
   - Confirm your new password
   - Click "Update Password"

### Method 2: Environment Variables (For Initial Setup)

1. **Set Environment Variables**
   ```bash
   export ADMIN_EMAIL="your-new-email@university.edu"
   export ADMIN_PASSWORD="your-new-secure-password"
   export ADMIN_NAME="Your Full Name"
   ```

2. **Restart the Application**
   ```bash
   npm run dev
   ```

## Security Best Practices

1. **Change Default Credentials**: Always change the default admin credentials before going to production
2. **Use Strong Passwords**: Use passwords with at least 8 characters, including uppercase, lowercase, numbers, and symbols
3. **Use University Email**: Use an official university email address for the admin account
4. **Regular Updates**: Change passwords regularly for security

## Multiple Admin Users

You can create additional admin users through the admin panel:

1. Log in as an existing admin
2. Go to Admin Management → "Add New Admin"
3. Fill in the new admin's details
4. The new admin will receive their credentials and can change them using the steps above

## Production Deployment

For production deployment:

1. **Set Environment Variables** in your hosting platform
2. **Verify Security**: Ensure HTTPS is enabled
3. **Change Credentials**: Update admin credentials immediately after deployment
4. **Test Login**: Verify that the new credentials work correctly

## Support

If you encounter issues:
1. Check that your current password is correct
2. Ensure email addresses are valid
3. Verify that passwords meet the minimum requirements (8+ characters)
4. Contact system administrator if problems persist

---

**Note**: This system is designed to be user-friendly for administrators who need to manage their own credentials without technical expertise.