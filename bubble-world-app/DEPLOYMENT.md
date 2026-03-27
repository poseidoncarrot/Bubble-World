# Deployment Guide

This guide covers how to deploy Bubble World to production.

## 🚀 Quick Deploy (Vercel)

### Prerequisites
- Vercel account
- Supabase project
- GitHub repository

### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
```bash
npx vercel
```

3. **Configure Environment Variables**
In Vercel dashboard, add:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Deploy**
```bash
npx vercel --prod
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass $SUPABASE_URL;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Build and Run
```bash
docker build -t bubble-world .
docker run -p 80:80 -e SUPABASE_URL=$SUPABASE_URL bubble-world
```

## ☁️ Cloud Platforms

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### AWS S3 + CloudFront
```bash
# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### DigitalOcean App Platform
1. Create new app
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables

## 🔧 Environment Setup

### Production Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_DEV_MODE=false
VITE_LOG_LEVEL=error
```

### Supabase Production Setup
1. **Enable Row Level Security**
   - Already configured in migrations
   - Review policies for your use case

2. **Set up Authentication**
   - Enable email/password auth
   - Configure redirect URLs
   - Set up social providers if needed

3. **Database Backups**
   - Enable daily backups
   - Set up point-in-time recovery

4. **Performance**
   - Enable database pooling
   - Set up read replicas for scaling

## 📊 Monitoring and Analytics

### Error Tracking
```javascript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.PROD ? "production" : "development",
});
```

### Analytics
```javascript
// Add to App.tsx
import { analytics } from './utils/analytics';

// Track page views
analytics.track('page_view', { path: window.location.pathname });

// Track user actions
analytics.track('world_created', { world_id: world.id });
```

## 🔒 Security

### HTTPS
- Always use HTTPS in production
- Configure SSL certificates
- Set up HSTS headers

### CORS
```sql
-- In Supabase dashboard
ALTER POLICY "Users can view own worlds" ON public.worlds
  FOR SELECT USING (auth.uid() = user_id);
```

### Rate Limiting
- Implement rate limiting on API endpoints
- Use Supabase rate limiting features
- Monitor for abuse patterns

## 🚦 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📝 Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Error tracking configured
- [ ] Performance monitoring set up

### Post-deployment
- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Check database connections
- [ ] Monitor error logs
- [ ] Test mobile responsiveness
- [ ] Verify search functionality

## 🆘 Troubleshooting

### Common Issues

**Build fails**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment variables not working**
- Check they're set in deployment platform
- Verify VITE_ prefix for client-side variables
- Restart the application

**Database connection issues**
- Verify Supabase URL and keys
- Check RLS policies
- Test connection in Supabase dashboard

**Performance issues**
- Enable gzip compression
- Optimize images and assets
- Use CDN for static files
- Monitor database queries

### Support
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Review [Supabase Documentation](https://supabase.com/docs)
- Consult [Vercel Documentation](https://vercel.com/docs)

---

**🫧 Happy deploying!**
