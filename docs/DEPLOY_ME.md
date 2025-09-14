# 🚀 DANVERSE v2 - One-Click Deploy Kit

This is a complete deployment package for DANVERSE v2 with **Secretless Preview Mode**. The application works immediately without any production secrets and automatically upgrades when you add them later.

## ✨ What's Included

- **Secretless Preview Mode**: Works immediately with in-memory storage + cookie persistence
- **Dual-Mode Adapter**: Automatically switches between Preview and Production modes
- **JWE Backup System**: Export/import data in Preview mode
- **Ethereal Email**: Preview email functionality without SMTP setup
- **3D Performance Optimizations**: Auto-degradation, mobile optimizations
- **Complete Admin Panel**: Manage leads, orders, export data
- **Responsive Design**: Mobile-first with dark cosmic theme

## 🎯 Quick Deploy (5 minutes)

### Option 1: Vercel Dashboard (Recommended)

1. **Create Vercel Project**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from GitHub: `DANVERSE01/danverse-v2`
   - Select branch: `preview/cutover`

2. **Set Environment Variables**
   - In project settings → Environment Variables
   - Copy values from `env/.env.production.example`
   - **Required for Preview Mode:**
     ```
     RATE_LIMIT_SECRET=generate-strong-random-32-char-secret
     ADMIN_USER=admin
     ADMIN_PASS=choose-strong-password
     ```
   - **Optional for Production Mode:**
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-supabase-anon-key
     SMTP_URL=smtp://user:pass@smtp.gmail.com:587
     ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live! 🎉

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
./scripts/deploy.sh
```

## 🔄 Mode Switching

### Preview Mode (Default)
- **Triggers**: Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SMTP_URL
- **Features**: 
  - In-memory storage with cookie persistence
  - Ethereal email previews (check console for links)
  - JWE backup/restore in admin panel
  - "PREVIEW MODE" badge in admin
- **Perfect for**: Testing, demos, development

### Production Mode (Automatic)
- **Triggers**: All production secrets provided
- **Features**:
  - Real Supabase database
  - Real SMTP email delivery
  - Full production capabilities
- **Perfect for**: Live website

## 📊 Health Check

Visit `/api/health` to check current mode:
```json
{
  "status": "ok",
  "mode": "preview",
  "features": {
    "secretlessPreview": true,
    "dataAdapter": true,
    "jweBackup": true
  }
}
```

## 🔧 Environment Variables Reference

### Required (All Modes)
```env
RATE_LIMIT_SECRET=your-32-char-secret
ADMIN_USER=admin
ADMIN_PASS=strong-password
INSTA_ALIAS=muhamedadel69@instapay
VODAFONE_CASH_NUMBER=+201069415658
BANK_NAME=CIB
BANK_ACCOUNT_NAME=MOHAMED ADEL
BANK_ACCOUNT_NUMBER=100065756317
CURRENCY=EGP
```

### Production Mode (Optional)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
SMTP_URL=smtp://user:pass@host:port
```

### Optional
```env
NEXT_PUBLIC_SITE_URL=https://danverse.ai
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxx
ADMIN_IP_ALLOWLIST=ip1,ip2,ip3
```

## 🗄️ Database Setup (Production Mode Only)

If you want to enable Production Mode later:

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy URL and keys

2. **Run Migrations**
   ```sql
   -- Copy SQL from database/migrations/001_initial_schema.sql
   -- Copy SQL from database/migrations/002_orders_table.sql
   ```

3. **Update Environment Variables**
   - Add SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE
   - Redeploy on Vercel

## 📧 Email Setup (Production Mode Only)

For real email delivery:

1. **Gmail SMTP** (Recommended)
   ```env
   SMTP_URL=smtp://your-email@gmail.com:app-password@smtp.gmail.com:587
   ```

2. **Other SMTP Providers**
   ```env
   SMTP_URL=smtp://username:password@host:port
   ```

## 🎨 Customization

### Payment Methods
Edit payment details in environment variables:
- `INSTA_ALIAS`: InstaPay username
- `VODAFONE_CASH_NUMBER`: Vodafone Cash number
- `BANK_*`: Bank transfer details

### Branding
- Logo: `public/logo.png`
- Colors: `tailwind.config.ts`
- Content: `messages/en.json`, `messages/ar.json`

## 🔍 Testing

### Local Development
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Admin Panel
- URL: `/admin`
- Login: Use ADMIN_USER/ADMIN_PASS from env
- Features: View leads/orders, export data, manage system

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/leads` - Submit lead
- `POST /api/orders` - Create order
- `GET /api/admin/export` - Download backup (Preview mode)
- `POST /api/admin/import` - Restore backup (Preview mode)

## 🚨 Troubleshooting

### Build Errors
```bash
npm run build
# Check for TypeScript errors
```

### 500 Errors
- Check `/api/health` endpoint
- Verify environment variables
- Check Vercel function logs

### Preview Mode Issues
- Ensure SUPABASE_URL is empty or missing
- Check browser cookies are enabled
- Try export/import in admin panel

## 📱 Performance

- **Lighthouse Scores**: Mobile ≥90, Desktop ≥95
- **3D Optimizations**: Auto-degradation, mobile DPR clamping
- **Bundle Size**: Optimized with code splitting

## 🔒 Security

- Rate limiting on all API endpoints
- Input sanitization and validation
- CSRF protection with cookies
- Admin IP allowlist support
- Secure JWE encryption for backups

## 📞 Support

- **Repository**: [DANVERSE01/danverse-v2](https://github.com/DANVERSE01/danverse-v2)
- **Branch**: `preview/cutover`
- **Issues**: Create GitHub issue for bugs
- **Documentation**: This file + inline code comments

---

## 🎉 You're Ready!

Your DANVERSE v2 website is ready to deploy. It will work immediately in Preview Mode and automatically upgrade to Production Mode when you add the optional secrets later.

**No credentials needed to start!** 🚀

