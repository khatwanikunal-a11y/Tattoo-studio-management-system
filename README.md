# Tattoo Studio Management System

A full-stack MERN-style web application for managing tattoo artists, designs, and pricing.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcryptjs (password hashing)
- **Security**: Helmet, express-rate-limit, express-validator
- **Frontend**: Vanilla HTML / CSS / JavaScript

## Project Structure

```
the-ink-factory/
├── backend/
│   ├── config/db.js              – MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               – JWT protect + adminOnly
│   │   └── errorHandler.js       – Global error handler
│   ├── models/
│   │   ├── User.js               – User schema + bcrypt
│   │   ├── Artist.js             – Artist schema
│   │   └── Design.js             – Design schema
│   ├── routes/
│   │   ├── auth.js               – Register / Login / Me
│   │   ├── artists.js            – CRUD for artists
│   │   ├── designs.js            – CRUD for designs
│   │   └── pricing.js            – Price estimate + currency
│   ├── app.js                    – Express app setup
│   └── server.js                 – Entry point
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js                – Fetch wrapper + helpers
│   │   ├── auth.js               – Login/register handlers
│   │   ├── artists.js            – Artists page logic
│   │   └── designs.js            – Designs page logic
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── artists.html
│   └── designs.html
├── .env.example
├── .gitignore
└── package.json
```

## Quick Start

### Install dependencies
```bash
npm install
```
### Run the application
```bash
npm start        # production
npm run dev      # development with auto-restart (nodemon)
```

**Local URL**: http://localhost:3000

## API Endpoints

### Auth
| Method | Route              | Auth   | Description          |
|--------|--------------------|--------|----------------------|
| POST   | /api/auth/register | Public | Register new user    |
| POST   | /api/auth/login    | Public | Login, receive JWT   |
| GET    | /api/auth/me       | User   | Get current user     |
| POST   | /api/auth/logout   | User   | Logout (client-side) |

### Artists
| Method | Route                | Auth   | Description    |
|--------|----------------------|--------|----------------|
| GET    | /api/artists         | Public | All artists    |
| GET    | /api/artists/search  | Public | Search artists |
| GET    | /api/artists/:id     | Public | Single artist  |
| POST   | /api/artists         | Admin  | Add artist     |
| PUT    | /api/artists/:id     | Admin  | Update artist  |
| DELETE | /api/artists/:id     | Admin  | Delete artist  |

### Designs
| Method | Route                        | Auth   | Description          |
|--------|------------------------------|--------|----------------------|
| GET    | /api/designs                 | Public | All designs          |
| GET    | /api/designs/search          | Public | Search designs       |
| GET    | /api/designs/:id             | Public | Single design        |
| GET    | /api/designs/by-artist/:id   | Public | Designs by artist    |
| POST   | /api/designs                 | User   | Add design           |
| PUT    | /api/designs/:id             | Admin  | Update design        |
| DELETE | /api/designs/:id             | Admin  | Delete design        |

### Pricing
| Method | Route                  | Auth   | Description                     |
|--------|------------------------|--------|---------------------------------|
| GET    | /api/pricing/estimate  | Public | Price estimate with currency    |

**Pricing query params**: `?design_id=<id>&currency=EUR` (supports EUR, GBP, USD, INR, CAD, AUD, etc.)

## Security Features
- JWT authentication with 7-day expiry
- Bcrypt password hashing (12 salt rounds)
- Rate limiting: 100 req/15min globally, 20 req/15min on auth routes
- Helmet security headers
- Input validation with express-validator
- Role-based access control (user / admin)
- XSS prevention via DOM-safe escaping on frontend
- JSON body size limit (10kb)
