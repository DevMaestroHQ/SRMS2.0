# University Result Management System

## Overview

This is a full-stack web application for managing university student results, built with a React frontend and Express.js backend. The system allows students to search for their exam results and provides an admin interface for uploading and managing marksheet documents with OCR processing capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Multer for handling PDF file uploads
- **Development**: Hot reload with Vite integration

## Key Components

### Database Schema
- **Admins Table**: Stores administrator credentials and information
- **Student Records Table**: Contains student names, registration numbers, marks, and PDF file paths
- **Relationships**: Student records linked to the admin who uploaded them

### Authentication System
- JWT token-based authentication for admin users
- Secure password hashing using bcrypt
- Token verification middleware for protected routes
- Client-side auth state management with localStorage persistence

### File Processing
- PDF upload handling with file type validation and size limits
- Mock OCR service for extracting student data from marksheets
- File storage in local uploads directory
- Automatic data extraction and database insertion

### API Structure
- **Public Routes**: Student result search and PDF download
- **Admin Routes**: Login, file upload, record management (protected)
- **Middleware**: Authentication, logging, and error handling
- **File Serving**: Static file serving for uploaded PDFs

## Data Flow

1. **Student Search Flow**:
   - Student enters name and registration number
   - Frontend validates input and sends search request
   - Backend queries database for matching records
   - Returns result with download capability

2. **Admin Upload Flow**:
   - Admin authenticates and accesses dashboard
   - Selects PDF files for upload
   - Backend processes files with OCR simulation
   - Extracted data stored in database with file references
   - Real-time feedback on processing results

3. **File Management**:
   - Uploaded files stored in dedicated uploads directory
   - Database maintains file path references
   - Download endpoint serves files with proper headers
   - Admin can view and delete records through dashboard

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **Backend**: Express.js, Node.js with TypeScript support
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Authentication**: jsonwebtoken, bcrypt for security

### UI and Styling
- **Component Library**: Extensive Radix UI component collection
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and class-variance-authority for styling

### Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Type Checking**: TypeScript with strict configuration
- **Schema Validation**: Zod for runtime type validation
- **File Processing**: Multer for multipart form handling

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- Express server with development middleware
- Automatic TypeScript compilation and error reporting
- Integrated development tools for debugging

### Production Build
- **Frontend**: Vite build process creating optimized static assets
- **Backend**: esbuild bundling for Node.js deployment
- **Assets**: Static file serving from dist/public directory
- **Environment**: Production-ready Express server configuration

### Database Management
- Drizzle migrations for schema management
- Environment-based database URL configuration
- Push-based schema updates for development
- PostgreSQL dialect with proper connection handling

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and a focus on developer experience while maintaining production readiness.