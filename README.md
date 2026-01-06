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
- **Tailwind CSS** + shadcn/ui for styling
- **React Hook Form** + Zod for form validation
- **Axios** for API requests
- **Sonner** for toast notifications

### Backend
- **Node.js** with Express
- **PostgreSQL** database
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
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   ├── common/    # Shared components
│   │   │   ├── forms/     # Form components
│   │   │   └── admin/     # Admin-specific components
│   │   ├── pages/         # Page components
│   │   │   ├── public/    # Public marketing pages
│   │   │   └── admin/     # Protected admin pages
│   │   ├── layouts/       # Layout components
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Express app entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Database seed script
│   └── package.json
│
├── package.json            # Root workspace config
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+
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

### 3. Database Setup

#### Install PostgreSQL

If you don't have PostgreSQL installed:
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@14`
- **Linux**: `sudo apt-get install postgresql-14`

#### Create Database

```bash
# Start PostgreSQL service
# Windows: It should start automatically after installation
# Mac: brew services start postgresql@14
# Linux: sudo systemctl start postgresql

# Create database
createdb webhostservice

# Or using psql:
psql -U postgres
CREATE DATABASE webhostservice;
\q
```

#### Configure Environment Variables

**Server** (`server/.env`):
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and update the DATABASE_URL:
```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/webhostservice?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```bash
cd ../client
cp .env.example .env
```

The client `.env` should contain:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Database Migrations and Seed

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

The seed script will create:
- ✅ Admin user: `rllabsadmin@rl-labs.org` / `Admin123!`
- ✅ 3 service packages (Basic, Custom, Hosting & Maintenance)
- ✅ 2 sample clients
- ✅ 2 sample inquiries

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
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Admin Credentials

```
Email: rllabsadmin@rl-labs.org
Password: Admin123!
```

**IMPORTANT**: Change these credentials after first login! (Future feature)

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
- `PUT /api/inquiries/:id` - Update inquiry (protected)
- `DELETE /api/inquiries/:id` - Delete inquiry (protected)

### Packages
- `GET /api/packages` - List active packages (public)
- `GET /api/packages/:id` - Get single package (public)

## Development Workflow

### Database Management

```bash
# Generate Prisma Client (after schema changes)
cd server
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Code Structure Guidelines

- **Components**: Reusable UI components in `client/src/components/`
- **Pages**: Page-level components in `client/src/pages/`
- **Stores**: Zustand stores in `client/src/store/`
- **API**: API integration in `client/src/utils/api.js`
- **Controllers**: Business logic in `server/src/controllers/`
- **Routes**: API routes in `server/src/routes/`

## Features

### Phase 1 (Current) ✅
- ✅ Home page with hero, services, features
- ✅ Services page with package cards
- ✅ Contact page with form validation
- ✅ Admin login with JWT authentication
- ✅ Admin dashboard with stats
- ✅ Client management (view list)
- ✅ Inquiry management (view submissions)
- ✅ Responsive mobile-first design
- ✅ Complete backend API with CRUD operations

### Phase 2 (Future)
- 🔄 Portfolio page with filtering
- 🔄 About page
- 🔄 Full CRUD for clients (create, edit, delete)
- 🔄 Inquiry status management
- 🔄 Hosting subscription tracker
- 🔄 Revenue calculations
- 🔄 Advanced search and filtering
- 🔄 Email notifications
- 🔄 File uploads
- 🔄 Dark mode
- 🔄 Multi-user support

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
# Mac:
brew services list

# Linux:
sudo systemctl status postgresql

# Test connection
psql -U postgres -d webhostservice
```

### Port Already in Use

```bash
# Frontend (5173)
# Kill process on Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Prisma Issues

```bash
# Regenerate Prisma Client
cd server
npx prisma generate

# Reset database completely
npx prisma migrate reset
```

### Module Not Found Errors

```bash
# Reinstall all dependencies
rm -rf node_modules client/node_modules server/node_modules
npm install
```

## Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `client/dist` directory
3. Set environment variable: `VITE_API_URL=<your-backend-url>`

### Backend (Render/Railway)

1. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `NODE_ENV=production`

2. Build command: `cd server && npm install && npx prisma generate && npx prisma migrate deploy`
3. Start command: `cd server && npm start`

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt (10 salt rounds)
- API rate limiting: 100 requests per 15 minutes
- CORS configured for client URL only
- Helmet.js provides security headers
- Input validation on all forms and API endpoints

## Contributing

This is a private project for R&L Labs. Contact the admin for contribution guidelines.

## License

Proprietary - R&L Labs

## Support

For issues or questions, contact: rllabsadmin@rl-labs.org

---

Built with ❤️ for small business owners
