# SiteKeeper

Professional web development and hosting service platform - targeting small business owners who need websites without technical knowledge.

## Overview

This static React application helps small businesses (especially restaurants) get professional websites with:
- **Basic Static Website Package** - Affordable, template-based sites
- **Custom Website Package** - Premium, fully customized design
- **Hosting & Maintenance Plan** - Monthly subscription with unlimited updates

## Tech Stack

- **React 18** with Vite
- **TanStack Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Hook Form** + Zod for form validation
- **Supabase** for authentication and database
- **Sonner** for toast notifications
- **Lucide React** for icons

## Deployment

This app deploys to Netlify as a static site.

### Environment Variables

Set these in Netlify dashboard (Site settings > Environment variables):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Deploy

1. Connect repository to Netlify
2. Build settings auto-detected from netlify.toml
3. Add environment variables
4. Deploy

### Local Development

```bash
cd client
cp .env.example .env
# Fill in Supabase credentials
npm install
npm run dev
```

## Project Structure

```
SiteKeeper/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # UI components (button, card, etc.)
│   │   │   └── common/    # Shared components
│   │   ├── pages/         # Page components
│   │   │   ├── public/    # Public marketing pages
│   │   │   └── admin/     # Protected admin pages
│   │   ├── layouts/       # Layout components
│   │   ├── store/         # Zustand stores
│   │   └── lib/           # Supabase client & queries
│   └── package.json
│
├── netlify.toml            # Netlify deployment config
└── README.md
```

## Admin Panel Features

### Dashboard
- Overview statistics (total clients, active clients, new inquiries)
- Recent inquiries list

### Clients Management
- View all clients in a table
- Click on a client to view detailed information:
  - Contact details (name, email, phone)
  - Website link with quick access button
  - Package information
  - Payment tracking with summary
  - Add/delete payments
  - Notes and timestamps

### Inquiries Management
- View all contact form submissions
- Click to view full inquiry details
- Update inquiry status (New, Contacted, Qualified, Converted, Dismissed)
- Accept inquiries (mark as Converted)
- Decline inquiries (mark as Dismissed)
- Delete inquiries

### Users Management (Super Admin Only)
- View all admin users
- Send password reset emails

## Database

The application uses Supabase with Row Level Security (RLS) policies protecting all tables.

### Models
- **User** - Admin users with roles (ADMIN, SUPER_ADMIN)
- **Client** - Business clients with contact info and status
- **Inquiry** - Contact form submissions
- **Package** - Service packages offered
- **Payment** - Payment records linked to clients

### Statuses
- **Client**: PROSPECT, ACTIVE, INACTIVE, CANCELLED
- **Inquiry**: NEW, CONTACTED, QUALIFIED, CONVERTED, DISMISSED
- **Payment**: PENDING, PAID, REFUNDED, FAILED

## License

Proprietary - SiteKeeper

## Support

For issues or questions, contact: support@rl-labs.org

---

Built with care for small business owners
