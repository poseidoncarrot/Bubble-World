# Setup Guide for Bubble World

## Prerequisites

- Node.js 18+
- A Supabase account and project
- Modern web browser with JavaScript enabled

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-username/Bubble-World.git
cd Bubble-World
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Update `.env` with your Supabase configuration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
- Go to your Supabase dashboard
- Project Settings > API
- Copy Project URL and anon public key

### 3. Database Setup

Run the SQL schema in your Supabase project:

1. Go to your Supabase dashboard
2. SQL Editor > New query
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script

This will create:
- **profiles**: User profile information
- **universes**: World containers with settings and categories
- **pages**: Content pages within universes
- **subsections**: Detailed content sections
- **connections**: Relationships between elements
- **kv_store_e5956044**: Key-value storage for server functions
- Row Level Security (RLS) policies for data protection

### 4. Start Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features Implemented

### Authentication System
- ✅ User registration with email validation
- ✅ User login with password authentication
- ✅ Email confirmation workflow
- ✅ Automatic session management
- ✅ Secure logout functionality
- ✅ Profile creation and management
- ✅ Password reset support (via Supabase)

### Database Integration
- ✅ Full CRUD operations for universes
- ✅ Full CRUD operations for pages
- ✅ Full CRUD operations for subsections
- ✅ Connection management between elements
- ✅ Row Level Security for data protection
- ✅ Real-time data synchronization
- ✅ Optimistic updates with localStorage fallback
- ✅ Image upload and storage via Supabase

### User Interface
- ✅ Rich text editor with formatting tools
- ✅ Drag-and-drop bubble map visualization
- ✅ Responsive design for all screen sizes
- ✅ Dark/Light theme support
- ✅ Form validation with helpful error messages
- ✅ Loading states during async operations
- ✅ Success feedback for user actions
- ✅ Graceful error handling and recovery

### Performance Optimizations
- ✅ Code splitting for reduced bundle size
- ✅ Memoized components and operations
- ✅ Optimized re-rendering with React hooks
- ✅ Efficient data fetching and caching
- ✅ Lazy loading for heavy components

## Architecture Overview

### Frontend Stack
- **React 18.3.1** with TypeScript for type safety
- **Vite 6.3.5** for fast development and optimized builds
- **Tailwind CSS 4.1.12** for utility-first styling
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent iconography
- **React DnD** for drag-and-drop functionality
- **Motion/Framer Motion** for smooth animations

### Backend Stack
- **Supabase** for authentication, database, and file storage
- **Edge Functions** for server-side operations
- **Row Level Security** for data access control

### Data Flow
1. **Primary Storage**: Supabase PostgreSQL database
2. **Authentication**: Supabase Auth with JWT tokens
3. **File Storage**: Supabase Storage for images
4. **Local Fallback**: localStorage for offline resilience
5. **Real-time Updates**: Supabase subscriptions for live sync

## Troubleshooting

### Common Issues

1. **Authentication errors**
   - Verify your Supabase URL and anon key are correct
   - Ensure your Supabase project is active
   - Check that email confirmation is properly configured

2. **Database errors**
   - Confirm you've run the complete schema.sql script
   - Verify RLS policies are correctly set up
   - Check Supabase logs for detailed error messages

3. **Build issues**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Ensure Node.js version is 18 or higher
   - Check for TypeScript errors in the console

4. **Environment variables not working**
   - Ensure your `.env` file is in the root directory
   - Restart development server after changing environment variables
   - Verify variable names match exactly (VITE_ prefix required)

5. **Performance issues**
   - Check browser console for warnings
   - Verify code splitting is working in production build
   - Monitor network requests for redundant calls

### Development Debugging

1. **Browser Console**: Check for JavaScript errors and warnings
2. **Network Tab**: Monitor API calls and response times
3. **React DevTools**: Inspect component state and props
4. **Supabase Dashboard**: Monitor database queries and auth events

### Getting Help

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase configuration and connectivity
3. Ensure all database tables exist with proper RLS policies
4. Review the troubleshooting section above
5. Check the GitHub Issues page for known problems

## Development Notes

### Code Quality
- **TypeScript**: Strict mode enabled with comprehensive type coverage
- **ESLint**: Configured for React and TypeScript best practices
- **Performance**: Optimized with memoization and code splitting
- **Accessibility**: WCAG compliant components with proper ARIA labels

### Security
- **Authentication**: Secure JWT-based authentication via Supabase
- **Data Protection**: Row Level Security for all database operations
- **Input Validation**: Client and server-side validation
- **XSS Prevention**: Proper sanitization of user inputs

### Performance Features
- **Bundle Optimization**: Automatic code splitting and tree shaking
- **Caching**: Intelligent localStorage caching with change detection
- **Lazy Loading**: Components loaded on-demand
- **Memoization**: Expensive calculations cached appropriately

The application provides a robust, scalable solution for creative worldbuilding with enterprise-grade security and performance optimizations.

## 🚀 Vercel Deployment

### Prerequisites for Vercel
- GitHub repository with your code pushed
- Supabase project configured and running
- Vercel account (free tier is sufficient)

### Quick Deploy via Vercel Dashboard
1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - Vercel will automatically detect the Vite configuration
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```

4. **Deploy**: Click "Deploy" and wait for the build to complete

### Manual Deployment with Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

### Post-Deployment Checklist
- [ ] Environment variables are set correctly in Vercel dashboard
- [ ] Supabase connection is working (test authentication)
- [ ] Custom domain is configured (if applicable)
- [ ] Build completes successfully without errors
- [ ] Application loads and functions properly

### Environment Variables in Vercel
1. Go to your project dashboard in Vercel
2. Navigate to Settings > Environment Variables
3. Add the following variables:
   - `VITE_SUPABASE_URL` (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` (your Supabase anon public key)

### Custom Domain Setup (Optional)
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Update your Supabase CORS settings to include the new domain

### Troubleshooting Vercel Deployment
1. **Build Failures**: Check the build logs for specific error messages
2. **Environment Variables**: Ensure all required variables are set in Vercel dashboard
3. **Supabase Connection**: Verify your Supabase URL and keys are correct
4. **CORS Issues**: Update Supabase CORS settings to include your Vercel domain
5. **Asset Loading**: Ensure all static assets are properly referenced

### Performance Optimization for Vercel
- Enable automatic compression in Vercel settings
- Configure proper caching headers for static assets
- Use Vercel Analytics to monitor performance
- Consider Vercel Edge Functions for future enhancements
