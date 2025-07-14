# University Result Management System

## Overview

This is a production-ready, full-stack web application for managing university student result verification and administration. The system provides a modern student portal for searching and downloading academic results, along with a comprehensive admin dashboard for managing student records, file uploads, and system administration.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **PostgreSQL** database with Drizzle ORM for data persistence
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
- **PostgreSQL**: Primary database for persistent data storage
- **Neon Database**: Serverless PostgreSQL provider for production
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
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **SESSION_SECRET**: Session encryption key
- **ADMIN_EMAIL**: Default admin email address
- **ADMIN_PASSWORD**: Default admin password
- **ADMIN_NAME**: Default admin display name

### Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens have configurable expiration
- File uploads are validated and sanitized
- Database queries use parameterized statements
- CORS configured for secure cross-origin requests

### File Storage
- Uploaded images stored in `/uploads` directory
- Generated PDFs stored in `/pdfs` directory
- File size limits enforced (50MB per file)
- Supported formats: JPG, PNG, PDF

The system is designed for high availability, scalability, and security, making it suitable for production use in educational institutions.