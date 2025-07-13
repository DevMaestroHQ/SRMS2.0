# University Result Management System

A modern, secure web application for managing university student verification with real-time OCR processing and administrative controls.

## 🎯 Overview

This system provides a comprehensive solution for university result management, featuring:
- **Student Portal**: Search and download academic results
- **Admin Dashboard**: Upload and manage student marksheets with OCR processing
- **Real-time OCR**: Automatic text extraction from JPG images using Tesseract.js
- **Secure Authentication**: JWT-based admin authentication with bcrypt encryption
- **PDF Generation**: Convert JPG marksheets to secure, non-editable PDF downloads

## ✨ Features

### Student Features
- 🔍 **Quick Search**: Search results by name and T.U. registration number
- 👁️ **Live Preview**: View marksheet images directly in the browser
- 📥 **PDF Download**: Download official PDF copies of marksheets
- 📱 **Responsive Design**: Mobile-friendly interface with modern UI

### Admin Features
- 🔐 **Secure Login**: JWT authentication with session management
- 📂 **Bulk Upload**: Process multiple JPG marksheets simultaneously
- 🤖 **OCR Processing**: Real-time text extraction from uploaded images
- 📊 **Dashboard**: View and manage all student records
- 🗑️ **Record Management**: Delete and update student information

### Technical Features
- ⚡ **Real-time Processing**: Live OCR results with progress tracking
- 🛡️ **Enterprise Security**: Secure file handling and data protection
- 🎨 **Modern UI**: Glass-morphism design with smooth animations
- 📱 **Mobile First**: Responsive design for all devices
- 🌙 **Dark Mode Ready**: Complete theme system implementation

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **shadcn/ui** components with Radix UI primitives
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Neon Database** for serverless PostgreSQL
- **Tesseract.js** for real OCR processing
- **jsPDF & Sharp** for PDF generation and image processing
- **JWT & bcrypt** for secure authentication

### Development Tools
- **TypeScript** strict configuration
- **ESM modules** for modern JavaScript
- **Hot module replacement** for fast development
- **Zod** for runtime type validation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd university-result-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🔧 Configuration

### Database Schema
The system uses two main tables:
- **admins**: Store administrator credentials and information
- **student_records**: Contains student data, marks, and file references

### Default Admin Account
- **Email**: `admin@university.edu`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin credentials before production deployment.

### File Storage
- **Uploads**: `./uploads/` - Original JPG images
- **PDFs**: `./pdfs/` - Generated PDF files
- **Cleanup**: Automatic file cleanup on processing errors

## 🎮 Usage

### For Students
1. Navigate to the Student Portal
2. Enter your full name and T.U. registration number
3. View the live preview of your marksheet
4. Download the official PDF copy

### For Administrators
1. Access the Admin Panel
2. Login with administrator credentials
3. Upload JPG marksheets (supports multiple files)
4. Monitor real-time OCR processing
5. Manage student records in the dashboard

## 📋 API Documentation

### Public Endpoints
- `GET /` - Main application
- `POST /api/get-result` - Search student results
- `GET /api/preview/:id` - View marksheet image
- `GET /api/download/:id` - Download PDF marksheet

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/verify` - Verify JWT token
- `POST /api/admin/upload` - Upload marksheets with OCR
- `GET /api/admin/records` - Get all student records
- `DELETE /api/admin/records/:id` - Delete student record

## 🔧 Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Express backend
│   ├── routes.ts          # API route definitions
│   ├── services/          # Business logic
│   └── middleware/        # Custom middleware
├── shared/                # Shared types and schemas
└── uploads/              # File storage
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

### OCR Processing
The system uses Tesseract.js for real OCR processing:
- Extracts student names and T.U. registration numbers
- Processes multiple image formats (JPG, JPEG)
- Provides detailed error handling and progress tracking
- Converts images to secure PDF format

## 🛡️ Security

### Authentication
- JWT tokens with configurable expiration
- bcrypt password hashing with salt rounds
- Secure session management
- Protected admin routes with middleware

### File Security
- File type validation (JPG/JPEG only)
- Size limits (5MB maximum)
- Secure file storage with cleanup
- PDF generation for non-editable downloads

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention with Drizzle ORM
- XSS protection with proper sanitization
- CORS configuration for secure API access

## 🚀 Deployment

### Production Build
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_secure_jwt_secret
   ```

3. **Deploy to your platform**
   - Replit Deployments (recommended)
   - Vercel, Netlify, or similar platforms
   - Docker containerization supported

### Environment Variables
Required for production:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to 'production'

### Performance Optimization
- Static asset optimization with Vite
- Image optimization with Sharp
- Database connection pooling
- Efficient OCR processing with worker threads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use conventional commit messages
- Add tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- [Tribhuvan University](https://tribhuvan-university.edu.np/) for the inspiration

## 📞 Support

For support, please contact:
- Email: support@university.edu
- Documentation: [Project Wiki](wiki-url)
- Issues: [GitHub Issues](issues-url)

---

**Built with ❤️ for modern education management**