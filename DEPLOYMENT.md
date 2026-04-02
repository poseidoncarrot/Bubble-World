# Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Environment Variables (Required)
Set these in your Vercel project dashboard under Settings > Environment Variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### Optional Environment Variables
```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # For edge functions
```

## 🚀 Deployment Steps

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

## 🔧 Configuration Details

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 24.x
- **Framework**: Vite
- **Install Command**: `npm install`

## 📋 What's Configured

- ✅ SPA routing with fallback to index.html
- ✅ Static asset caching (1 year)
- ✅ Build optimization with chunk splitting
- ✅ Memory allocation for builds (4GB)
- ✅ CORS configured for Supabase functions

## ⚠️ Important Notes

- Supabase functions are deployed separately to Supabase
- Environment variables MUST be set in Vercel dashboard
- Hardcoded credentials have been removed for security
- Build generates optimized chunks for better performance

## 🧪 Testing After Deployment

1. Check if app loads at your Vercel URL
2. Test login functionality
3. Verify environment variables are working
4. Test all interactive features
