# Reptile Global - Shipping Website

## Overview

Reptile Global is a full-stack shipping and logistics web application built with Next.js 14. The platform enables customers to track shipments, contact the company, and learn about services, while administrators can create, edit, and manage shipments through a dedicated dashboard. The application supports multi-language internationalization (English, French, Dutch) and includes features like real-time map tracking with Mapbox, email notifications, and PDF receipt generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router and React Server Components
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, supports dark/light mode via next-themes
- **State Management**: React Context API for authentication state
- **Forms**: React Hook Form with Zod validation
- **Notifications**: react-hot-toast for user feedback

### Backend Architecture
- **API Routes**: Next.js API routes in the `/app/api` directory pattern
- **Database**: MongoDB with Mongoose ODM for data modeling
- **Authentication**: Custom JWT-based authentication with bcryptjs for password hashing
- **Session Storage**: Client-side cookies via js-cookie for token persistence

### Data Models
- **User**: Authentication with role-based access (user/admin)
- **Shipment**: Complete shipping records with sender/recipient details, package info, tracking history, and geolocation
- **Draft**: Incomplete shipment records for later completion

### Key Features
- **Internationalization**: next-intl for multi-language support with locale-based routing (`/[locale]/...`)
- **Map Integration**: Mapbox GL for interactive maps showing shipment routes and locations
- **Email Service**: Nodemailer for sending shipment confirmations to senders and recipients
- **PDF Generation**: jsPDF for creating downloadable shipping receipts

### Routing Structure
- Public pages: Home, About, Team, Track, Testimonials, Contact
- Protected admin dashboard at `/admin-dashboard` with tabs for creating, editing, viewing shipments, analytics, and drafts
- Locale prefix on all routes (e.g., `/en/track`, `/fr/about`)

## External Dependencies

### Database
- **MongoDB**: Primary database for storing users, shipments, and drafts. Connection via `MONGODB_URI` environment variable.

### Third-Party Services
- **Mapbox GL**: Interactive mapping for shipment tracking and route visualization. Requires Mapbox access token.
- **SMTP Email**: Nodemailer integration for transactional emails. Requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` environment variables.

### Required Environment Variables
```
MONGODB_URI=<mongodb-connection-string>
JWT_SECRET=<secret-key-for-jwt-tokens>
SMTP_HOST=<email-server-host>
SMTP_PORT=<email-server-port>
SMTP_USER=<email-username>
SMTP_PASS=<email-password>
MAPBOX_TOKEN=<mapbox-access-token> (used client-side)
```

### Key NPM Packages
- `mongoose` - MongoDB object modeling
- `jsonwebtoken` / `bcryptjs` - Authentication
- `nodemailer` - Email sending
- `mapbox-gl` - Map rendering
- `next-intl` - Internationalization
- `zod` - Schema validation
- `jspdf` - PDF generation
- `react-hook-form` - Form handling