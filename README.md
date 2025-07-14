# University Result Management System

A production-ready, enterprise-grade web application for managing university student verification with enhanced file processing capabilities, persistent PostgreSQL storage, and modern administrative controls.

## 🎯 Overview

This comprehensive system provides a robust solution for university result management with enterprise-level features:
- **Enhanced Student Portal**: Search and download academic results with improved UI
- **Advanced Admin Dashboard**: Upload up to 50 files (50MB each) with multi-format support
- **PostgreSQL Database**: Persistent data storage with no data loss on restarts
- **Semester Management**: Complete semester-wise organization and filtering
- **Real-time OCR**: Automatic text extraction from JPG, PNG, and PDF files
- **Modern Security**: JWT-based authentication with enterprise-grade protection

## ✨ Enhanced Features

### Student Features
- 🔍 **Advanced Search**: Search results by name and T.U. registration number
- 📄 **Multi-format Support**: View JPG, PNG, and PDF marksheets
- 📥 **Secure Downloads**: Download verified PDF copies with authentication
- 📱 **Modern Responsive Design**: Optimized for all devices with glass-morphism UI
- 🌓 **Dark/Light Themes**: Complete theme system with user preference

### Admin Features - Enhanced 2025
- 🔐 **Professional Login**: Modern tabbed interface with password visibility controls
- 📂 **Enterprise File Upload**: 50 files per batch, 50MB per file (up from 10 files, 5MB)
- 📊 **Format Support**: JPG, PNG, PDF processing (expanded from JPG-only)
- 📅 **Semester Management**: Complete semester organization with active semester tracking
- 🤖 **Enhanced OCR**: Real-time processing with improved accuracy and error handling
- 👥 **Complete Admin Panel**: Tabbed interface for profile, security, and user management
- 📈 **Activity Monitoring**: Professional timeline with color-coded activity tracking
- 🗄️ **Database Management**: PostgreSQL integration with persistent storage
- 🎨 **Clean UI**: Modern design with eliminated repetition and improved UX

### Technical Enhancements
- 💾 **PostgreSQL Database**: Persistent storage with Drizzle ORM and schema migrations
- ⚡ **Enhanced Performance**: Optimized build with removed unused components
- 🛡️ **Enterprise Security**: Comprehensive authentication and data protection
- 📊 **Scalable Architecture**: Built for high-volume file processing
- 🔄 **Semester-wise Organization**: Complete academic term management

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety and modern development
- **Vite** for lightning-fast development and optimized production builds
- **Tailwind CSS** with custom design system and responsive utilities
- **shadcn/ui** components with Radix UI primitives (optimized bundle)
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing

### Backend & Database
- **Express.js** with TypeScript and ESM modules
- **PostgreSQL** with Drizzle ORM for reliable data persistence
- **Neon Database** serverless PostgreSQL for production deployment
- **Enhanced File Processing**: Multi-format support with 50x capacity increase
- **Tesseract.js** for real OCR processing with improved accuracy
- **JWT & bcrypt** for secure authentication and password hashing

### Development & Production
- **TypeScript** strict configuration with comprehensive type checking
- **Hot module replacement** for instant development feedback
- **Zod** for runtime type validation and schema enforcement
- **Optimized Build**: Cleaned unused components for better performance

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account for production)
- Git

### Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd university-result-management
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other settings
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🔐 Default Admin Credentials

For initial setup, use these credentials:
- **Email**: `admin@university.edu`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials immediately after first login through the Admin Management section.

## 🚀 Production Deployment

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-here-use-a-strong-random-string

# Admin Configuration (Optional - for production deployment)
ADMIN_EMAIL=admin@university.edu
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_NAME=System Administrator

# Application Configuration
NODE_ENV=production
PORT=5000

# File Upload Configuration
MAX_FILE_SIZE=52428800
MAX_FILES=50

# Session Configuration
SESSION_SECRET=your-session-secret-key-here
```

### Deployment Options

#### 1. Replit (Recommended)
- Configure environment variables in Replit Secrets
- Click "Deploy" button for automatic deployment
- Supports auto-scaling and custom domains

#### 2. Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t university-results .
docker run -p 5000:5000 university-results
```

#### 3. Netlify
- Connect repository to Netlify
- Configure build settings: `npm run build`
- Set publish directory: `dist/public`
- Add environment variables in Netlify dashboard

#### 4. Vercel
```bash
npm install -g vercel
vercel --prod
```

#### 5. Traditional VPS
```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Deploy application
npm install
npm run build
npm start

# Configure Nginx (see nginx.conf)
sudo systemctl restart nginx
```

## 📡 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check endpoint
- `POST /api/get-result` - Search student results
- `GET /api/download/:id` - Download student PDF
- `GET /api/preview/:id` - Preview student PDF

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify` - Verify admin token
- `POST /api/admin/upload` - Upload student records
- `GET /api/admin/records` - Get all student records
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/change-password` - Change admin password
- `POST /api/admin/update-profile` - Update admin profile

## 📁 Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions
│   │   └── hooks/        # Custom hooks
├── server/               # Express backend
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   ├── services/         # Business logic
│   └── middleware/       # Express middleware
├── shared/               # Shared types and schemas
├── uploads/              # File storage directory
├── netlify.toml          # Netlify configuration
├── vercel.json           # Vercel configuration
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
├── nginx.conf            # Nginx configuration
└── PRODUCTION_SETUP.md   # Detailed deployment guide
```

## 🛡️ Security Features

- JWT-based authentication with secure token management
- Password hashing with bcrypt (12 rounds)
- CORS protection with configurable origins
- Rate limiting for API endpoints
- File type validation and size limits
- SQL injection prevention with parameterized queries
- XSS protection headers
- HTTPS enforcement in production
- Session management with secure cookies
- Input sanitization and validation

## ⚡ Performance Optimizations

- Database connection pooling
- Image optimization with Sharp
- Gzip compression for static assets
- Static file caching with proper headers
- Bundle optimization and tree shaking
- Lazy loading for React components
- Efficient SQL queries with indexes
- Memory management for file processing

## 📊 Monitoring and Health Checks

### Health Endpoints
- `/api/health` - Application health status
- Database connectivity verification
- File system health checks
- Memory usage monitoring

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type checking

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:
- `admins` - Administrator accounts with secure authentication
- `semesters` - Academic semesters with active status management
- `student_records` - Student academic records with comprehensive metadata
- `file_uploads` - File upload tracking and management

## 💾 File Storage

- Uploaded images stored in `uploads/` directory
- Generated PDFs stored in `pdfs/` directory
- Proper file permissions and disk space management
- Consider CDN integration for production scalability

## 🔧 Development

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- TypeScript with strict type checking
- ESLint and Prettier for code formatting
- Consistent naming conventions
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support, deployment assistance, or questions:
- Check `PRODUCTION_SETUP.md` for detailed deployment instructions
- Review the troubleshooting section in the production guide
- Contact the development team for custom deployment support

## 🚀 Quick Production Checklist

- [ ] Strong JWT and session secrets (32+ characters)
- [ ] Secure database credentials
- [ ] HTTPS certificate configured
- [ ] Rate limiting enabled
- [ ] File upload size limits set
- [ ] Security headers configured
- [ ] Database connection pooling enabled
- [ ] Log monitoring setup
- [ ] Backup strategy implemented
- [ ] Admin credentials changed from defaults