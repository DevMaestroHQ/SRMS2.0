# University Result Management System

## Overview

This is a production-ready, full-stack web application for managing university student result verification and administration. The system provides a modern student portal for searching and downloading academic results, along with a comprehensive admin dashboard for managing student records, file uploads, and system administration.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

### Professional Typography & Design Enhancement
- **Enhanced font system**: Implemented professional typography with Geist and Inter font families
- **Professional design system**: Added comprehensive CSS utility classes for consistent UI components
- **Professional cards**: Added glass morphism effects with backdrop blur and rounded corners
- **Professional buttons**: Implemented consistent button styles with hover states and focus rings
- **Professional tables**: Enhanced table designs with proper spacing and hover effects
- **Professional badges**: Added contextual color coding for status indicators

### Enhanced Admin Panel Components
- **Enhanced Admin Dashboard**: New comprehensive dashboard with system health monitoring, activity tracking, and key metrics
- **Enhanced Semester Management**: Advanced semester management with statistics, search/filter capabilities, and professional CMS features
- **Improved navigation**: Added 6-tab navigation system with dedicated sections for different admin functions
- **Better responsive design**: Optimized layouts for mobile, tablet, and desktop viewing

### Admin Panel CMS Improvements
- **Comprehensive statistics**: Real-time tracking of student counts, pass rates, and system metrics
- **Advanced filtering**: Search and filter capabilities for semesters and records
- **Professional data visualization**: Progress bars, charts, and status indicators
- **Enhanced user experience**: Better loading states, error handling, and user feedback
- **System monitoring**: Health checks, uptime tracking, and performance metrics

### Real-time Activity Tracking & System Health (Latest Update)
- **WebSocket Integration**: Real-time communication between client and server
- **Live Activity Feed**: Real-time tracking of all system activities (login, upload, search, admin actions)
- **System Health Dashboard**: Live monitoring of memory usage, disk usage, uptime, and active connections
- **Connection Status**: Visual indicators for WebSocket connection status
- **Activity Categories**: Categorized tracking with success/warning/error status indicators
- **Real-time Notifications**: Instant updates for system events and user actions

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** with shadcn/ui components for consistent design
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for form management

### Backend Architecture
- **Express.js** with TypeScript for the REST API server
- **Local JSON file storage** for simplified development and deployment
- **JWT-based authentication** for secure admin access
- **Multer** for file upload handling
- **Tesseract.js** for OCR text extraction from images
- **Sharp** for image processing and optimization
- **bcrypt** for password hashing

### Design System
- **Educational color palette** with university branding
- **Glass morphism effects** and modern gradients
- **Responsive design** optimized for mobile, tablet, and desktop
- **Dark/light theme support** (infrastructure ready)

## Key Components

### Student Portal
- **Search Interface**: Students can search for results by name and T.U. registration number
- **Result Display**: Shows pass/fail status with student information
- **PDF Download**: Secure download of result documents
- **Modern UI**: Clean, educational design with university branding

### Admin Dashboard
- **File Upload System**: Batch upload up to 50 files (50MB each) with JPG, PNG, PDF support
- **OCR Processing**: Automatic text extraction from uploaded documents
- **Semester Management**: Create and manage academic semesters
- **Student Records**: View, search, and manage all student records
- **Admin Management**: Profile updates, password changes, and user administration
- **Activity Tracking**: Monitor system usage and administrative actions

### Authentication System
- **JWT-based authentication** with token verification
- **Password hashing** using bcrypt
- **Session management** with automatic token refresh
- **Role-based access control** for admin functions

## Data Flow

1. **Student Search Flow**:
   - Student enters name and T.U. registration number
   - System searches database for matching records
   - Results displayed with pass/fail status
   - PDF download available for verified records

2. **Admin Upload Flow**:
   - Admin selects semester and uploads image files
   - OCR processing extracts student information
   - System validates and stores records in database
   - Generated PDFs stored for student access

3. **Authentication Flow**:
   - Admin login with email/password
   - JWT token generated and stored
   - Protected routes verified with middleware
   - Automatic logout on token expiration

## External Dependencies

### Core Technologies
- **Local JSON Storage**: File-based database for simplified development
- **Tesseract.js**: OCR engine for text extraction
- **Sharp**: Image processing library
- **Canvas**: PDF generation capabilities

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hook Form**: Form validation and management

### Development Tools
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and development server
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundler

## Deployment Strategy

### Production Deployment Options
1. **Replit Deployment** (Recommended):
   - One-click deployment with autoscaling
   - Built-in database provisioning
   - Environment variable management
   - Custom domain support

2. **Vercel Deployment**:
   - Serverless functions for API
   - Static site hosting for frontend
   - Environment variable configuration
   - Global CDN distribution

3. **VPS/Docker Deployment**:
   - Full control over server environment
   - Custom SSL certificates
   - Database management
   - Monitoring and logging

### Environment Configuration
- **JWT_SECRET**: Secret key for JWT token signing (defaults provided)
- **SESSION_SECRET**: Session encryption key (defaults provided)
- **ADMIN_EMAIL**: Default admin email address (admin@university.edu)
- **ADMIN_PASSWORD**: Default admin password (admin123)
- **ADMIN_NAME**: Default admin display name (System Administrator)

### Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- File uploads are validated and sanitized
- Database queries use parameterized statements
- CORS configured for secure cross-origin requests

### File Storage
- **Database**: All data stored in `data/database.json` file
- **Uploaded images**: Stored in `/uploads` directory
- **Generated PDFs**: Stored in `/pdfs` directory
- **File size limits**: 50MB per file enforced
- **Supported formats**: JPG, PNG, PDF

### Local Development Benefits
- **No external dependencies**: Runs completely offline
- **Easy setup**: No database installation required
- **Instant start**: Clone and run with `npm run dev`
- **Portable**: All data in JSON file for easy backup
- **Debug-friendly**: Human-readable data format

The system is designed for easy local development and can be deployed to any platform that supports Node.js applications.