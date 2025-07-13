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

### Local Development Setup

#### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- PostgreSQL 14+ (or Neon Database account)
- Git
- npm or yarn package manager

#### Step-by-Step Local Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/university-result-system.git
   cd university-result-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/university_results"
   
   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Application Environment
   NODE_ENV=development
   
   # Optional: Custom Port (default is 5000)
   PORT=5000
   ```

4. **Database Setup**
   
   **Option A: Using PostgreSQL locally**
   ```bash
   # Install PostgreSQL (Ubuntu/Debian)
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Create database
   sudo -u postgres createdb university_results
   
   # Create user (optional)
   sudo -u postgres createuser --interactive
   ```
   
   **Option B: Using Neon Database (Recommended)**
   - Visit [Neon](https://neon.tech)
   - Create a new project
   - Copy the connection string to your `.env` file

5. **Initialize Database Schema**
   ```bash
   npm run db:push
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Open your browser and navigate to `http://localhost:5000`
   - Default admin credentials:
     - Email: `admin@university.edu`
     - Password: `admin123`

### Production Deployment

#### Option 1: Replit Deployments (Recommended)

1. **Prepare for Deployment**
   ```bash
   # Ensure all dependencies are installed
   npm install
   
   # Run database migrations
   npm run db:push
   
   # Test the build
   npm run build
   ```

2. **Environment Variables for Production**
   Set the following in your Replit Secrets:
   ```env
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=production
   ```

3. **Deploy via Replit**
   - Click the "Deploy" button in your Replit project
   - Configure your domain settings
   - Monitor the deployment logs

#### Option 2: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure for Vercel**
   Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/dist/**/*",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "client/dist/$1"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

#### Option 3: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:20-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Build the application
   RUN npm run build
   
   # Expose port
   EXPOSE 5000
   
   # Start the application
   CMD ["npm", "start"]
   ```

2. **Build and Run Container**
   ```bash
   docker build -t university-result-system .
   docker run -p 5000:5000 -e DATABASE_URL=your_db_url university-result-system
   ```

#### Option 4: VPS/Cloud Server Deployment

1. **Server Setup (Ubuntu 22.04)**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/university-result-system.git
   cd university-result-system
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Set up environment variables
   cp .env.example .env
   nano .env  # Edit with your production values
   
   # Start with PM2
   pm2 start npm --name "university-results" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Environment Variables

#### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation (minimum 32 characters)
- `NODE_ENV` - Set to 'production' for production deployment

#### Optional Variables
- `PORT` - Application port (default: 5000)
- `CORS_ORIGIN` - Allowed CORS origins (default: localhost)
- `SESSION_SECRET` - Additional session security (auto-generated if not provided)

### Post-Deployment Checklist

1. **Security Configuration**
   - [ ] Change default admin password
   - [ ] Set strong JWT secret
   - [ ] Configure CORS properly
   - [ ] Enable HTTPS/SSL
   - [ ] Set up firewall rules

2. **Performance Optimization**
   - [ ] Enable database connection pooling
   - [ ] Configure caching headers
   - [ ] Set up CDN for static assets
   - [ ] Monitor memory usage

3. **Monitoring & Maintenance**
   - [ ] Set up application monitoring
   - [ ] Configure log rotation
   - [ ] Set up automated backups
   - [ ] Monitor OCR processing performance

### Troubleshooting

#### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql
   
   # Test connection
   psql $DATABASE_URL
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **OCR Processing Fails**
   ```bash
   # Check if tessdata is available
   ls node_modules/tesseract.js/dist/
   
   # Reinstall tesseract.js
   npm uninstall tesseract.js
   npm install tesseract.js
   ```

4. **Build Errors**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Performance Optimization

- **Database Indexing**: Ensure proper indexes on frequently queried columns
- **Image Processing**: Use Sharp for efficient image optimization
- **Caching**: Implement Redis for session and query caching
- **Load Balancing**: Use PM2 cluster mode for multiple instances
- **Monitoring**: Set up APM tools like New Relic or DataDog

### Security Best Practices

- Use environment variables for all sensitive configuration
- Implement rate limiting on API endpoints
- Sanitize all user inputs
- Use HTTPS in production
- Regular security audits with `npm audit`
- Keep dependencies updated

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