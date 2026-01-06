# WebHostService

Professional web development and hosting service platform for R&L Labs - targeting small business owners who need websites without technical knowledge.

## Overview

This full-stack application helps small businesses (especially restaurants) get professional websites with:
- **Basic Static Website Package** - Affordable, template-based sites
- **Custom Website Package** - Premium, fully customized design
- **Hosting & Maintenance Plan** - Monthly subscription with unlimited updates

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Zustand** for state management
- **Tailwind CSS** for styling
- **React Hook Form** + Zod for form validation
- **Axios** for API requests
- **Sonner** for toast notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Supabase** (PostgreSQL database)
- **Prisma** ORM
- **JWT** authentication
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection

## Project Structure

```
WebHostService/
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
│   │   └── utils/         # Utility functions & API client
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Database seed script
│   └── package.json
│
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm
- **Supabase** account (free tier works)
- **Git**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WebHostService
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# This will also install client and server dependencies via workspaces
```

### 3. Supabase Database Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be provisioned
4. Go to **Settings > Database** to find your connection string

#### Configure Environment Variables

**Server** (`server/.env`):
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your Supabase connection string:
```
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Note**: You can find your connection string in Supabase under **Settings > Database > Connection string > URI**. Make sure to use the "Transaction pooler" connection string for better performance.

**Client** (`client/.env`):
```bash
cd ../client
cp .env.example .env
```

The client `.env` should contain:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Initialize Database

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Push schema to Supabase (creates tables)
npx prisma db push

# Seed database with initial data
npm run prisma:seed
```

The seed script will create:
- **Super Admin**: `rllabsadmin@rl-labs.org` / `Admin123!`
- **Admin Users**: `nick@rl-labs.org` and `shane@rl-labs.org` / `Test123!`
- 3 service packages (Basic, Custom, Hosting & Maintenance)
- 2 sample clients
- 2 sample inquiries

### 5. Start Development Servers

#### Option 1: Run both servers concurrently (from root)

```bash
cd ..  # Back to root directory
npm run dev
```

This starts both frontend (port 5173) and backend (port 5000) simultaneously.

#### Option 2: Run servers separately

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | rllabsadmin@rl-labs.org | Admin123! |
| Admin | nick@rl-labs.org | Test123! |
| Admin | shane@rl-labs.org | Test123! |

> **Note**: Super Admin has access to user management and password reset features.

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
- Reset user passwords

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/refresh` - Refresh JWT token (protected)

### Clients (Protected)
- `GET /api/clients` - List clients (with pagination, search, filters)
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/stats` - Get client statistics

### Inquiries
- `POST /api/inquiries` - Submit inquiry (public)
- `GET /api/inquiries` - List inquiries (protected)
- `GET /api/inquiries/:id` - Get single inquiry (protected)
- `PUT /api/inquiries/:id` - Update inquiry status (protected)
- `DELETE /api/inquiries/:id` - Delete inquiry (protected)

### Payments (Protected)
- `GET /api/payments/client/:clientId` - Get payments for a client
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Users (Protected - Super Admin Only)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id/reset-password` - Reset user password

### Packages
- `GET /api/packages` - List active packages (public)
- `GET /api/packages/:id` - Get single package (public)

## Database Schema

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

## Development Workflow

### Database Management

```bash
cd server

# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Re-seed database
npm run prisma:seed
```

### Common Issues

#### Prisma Client Not Generated
```bash
cd server
npx prisma generate
```

#### Database Connection Issues
- Verify your Supabase project is active
- Check the DATABASE_URL in `.env`
- Ensure you're using the correct connection string (Transaction pooler recommended)

#### Port Already in Use
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `client/dist` directory
3. Set environment variable: `VITE_API_URL=<your-backend-url>/api`

### Backend (Render/Railway)

1. Set environment variables:
   - `DATABASE_URL` (Supabase connection string)
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `NODE_ENV=production`

2. Build command: `cd server && npm install && npx prisma generate`
3. Start command: `cd server && npm start`

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 salt rounds)
- API rate limiting: 100 requests per 15 minutes
- CORS configured for client URL only
- Helmet.js provides security headers
- Input validation on all forms and API endpoints
- User management restricted to SUPER_ADMIN role

## License

Proprietary - R&L Labs

## Support

For issues or questions, contact: rllabsadmin@rl-labs.org

---

Built with care for small business owners
