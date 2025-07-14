# Production Deployment Guide

## Prerequisites

1. **Environment Variables**: Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET`: Strong random string for JWT tokens
   - `SESSION_SECRET`: Strong random string for sessions
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: Default admin credentials

2. **Database Setup**: Ensure PostgreSQL is running and accessible

3. **File Storage**: Create directories for uploads and generated PDFs

## Deployment Options

### 1. Replit Deployment (Recommended)

1. **Configure Environment Variables**:
   ```bash
   # In Replit Secrets
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   ADMIN_EMAIL=admin@university.edu
   ADMIN_PASSWORD=your_secure_password
   ADMIN_NAME=System Administrator
   ```

2. **Deploy**:
   - Click "Deploy" in Replit
   - Select "Autoscale" for production workloads
   - Configure custom domain if needed

### 2. Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables** in Vercel dashboard

### 3. Netlify Deployment

1. **Connect Repository** to Netlify
2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
3. **Add Environment Variables** in Netlify dashboard

### 4. Docker Deployment

1. **Build and Run**:
   ```bash
   docker-compose up -d
   ```

2. **Configure Environment Variables** in `docker-compose.yml`

### 5. Traditional VPS Deployment

1. **Install Dependencies**:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install nodejs npm postgresql nginx
   
   # CentOS/RHEL
   sudo yum install nodejs npm postgresql nginx
   ```

2. **Setup Database**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE university_results;
   CREATE USER app_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE university_results TO app_user;
   ```

3. **Deploy Application**:
   ```bash
   git clone <repository>
   cd university-results
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run build
   npm run db:push
   npm start
   ```

4. **Configure Nginx**:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/university-results
   sudo ln -s /etc/nginx/sites-available/university-results /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

## Security Checklist

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

## Performance Optimization

1. **Database Indexing**:
   ```sql
   CREATE INDEX idx_student_name_turegd ON student_records(name, tu_regd);
   CREATE INDEX idx_student_semester ON student_records(semester_id);
   ```

2. **File Storage**:
   - Use CDN for static assets
   - Configure proper caching headers
   - Implement file cleanup policies

3. **Application**:
   - Enable gzip compression
   - Configure connection pooling
   - Set up monitoring and alerting

## Monitoring and Maintenance

1. **Health Checks**:
   - Database connectivity
   - File system permissions
   - Memory usage
   - Response times

2. **Log Management**:
   - Application logs
   - Error tracking
   - Access logs
   - Database logs

3. **Backup Strategy**:
   - Database backups
   - File uploads backup
   - Configuration backup
   - Disaster recovery plan

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check DATABASE_URL format
   - Verify database server is running
   - Check network connectivity

2. **File Upload Errors**:
   - Verify directory permissions
   - Check disk space
   - Validate file size limits

3. **Authentication Issues**:
   - Check JWT_SECRET configuration
   - Verify session configuration
   - Check admin credentials

### Support

For production support and custom deployment assistance, contact the development team.