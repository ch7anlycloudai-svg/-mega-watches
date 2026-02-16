<div align="center">

# Mega Watches

### متجر الساعات الفاخرة | Luxury Watch E-Commerce

A full-stack, Arabic RTL e-commerce platform for luxury watches built with React and Node.js.
Prices in **Mauritanian Ouguiya (UM)** | Cash on Delivery | Admin Dashboard with Analytics.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

</div>

---

## Overview

**Mega Watches** is a modern, fully responsive watch e-commerce website with a complete admin dashboard. The platform is designed for the Mauritanian market with full Arabic (RTL) support, Ouguiya (UM) currency formatting, and a sleek black & gold luxury theme.

### Key Highlights

- **Public Storefront** — Browse, filter, and purchase luxury watches
- **Shopping Cart** — Persistent cart with localStorage
- **Checkout** — Cash on Delivery with order submission to backend
- **Admin Dashboard** — Manage products, orders, and view analytics
- **Zero-Config Setup** — Runs without external MongoDB (in-memory fallback)

---

## Screenshots

| Storefront | Admin Dashboard |
|:---:|:---:|
| Home, Shop, Product Details, Cart, Checkout | Dashboard, Products, Orders, Analytics |

---

## Tech Stack

### Frontend (`client/`)

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 7 | Build tool & dev server |
| TailwindCSS | 4 | Utility-first CSS |
| React Router | 7 | Client-side routing |
| Chart.js | 4 | Admin analytics charts |
| React Chartjs 2 | 5 | React wrapper for Chart.js |

### Backend (`server/`)

| Technology | Version | Purpose |
|---|---|---|
| Express | 5 | HTTP server & REST API |
| Mongoose | 9 | MongoDB ODM |
| JWT | 9 | Admin authentication |
| bcryptjs | 3 | Password hashing |
| mongodb-memory-server | 11 | In-memory MongoDB fallback |
| dotenv | 17 | Environment variables |
| CORS | 2 | Cross-origin support |

---

## Project Structure

```
mega-watches/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── StatsCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Admin JWT authentication
│   │   │   └── CartContext.jsx      # Shopping cart state
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx      # Sidebar + Topbar
│   │   │   └── MainLayout.jsx       # Navbar + Footer
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AddEditProduct.jsx
│   │   │   │   ├── AdminLogin.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Orders.jsx
│   │   │   │   └── Products.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── Shop.jsx
│   │   ├── services/
│   │   │   └── api.js               # API client (public + admin)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js Backend
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Order.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── auth.js                  # POST /login, GET /me
│   │   ├── orders.js                # CRUD + stats + analytics
│   │   └── products.js              # CRUD + featured + categories
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn**
- MongoDB *(optional — the app falls back to in-memory MongoDB automatically)*

### Installation

```bash
# Clone the repository
git clone https://github.com/ch7anlycloudai-svg/-mega-watches.git
cd -mega-watches

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Variables

Create a `server/.env` file (already included with defaults):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/watch-store
JWT_SECRET=watch-store-secret-key-2026
```

> **Note:** If MongoDB is not installed, the server automatically uses `mongodb-memory-server` and seeds sample data on startup.

### Running the Application

**Terminal 1 — Start the backend:**
```bash
cd server
npm start
```

**Terminal 2 — Start the frontend:**
```bash
cd client
npm run dev
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

### Seeding Data (Optional)

If using an external MongoDB, run the seed script to populate initial data:

```bash
cd server
npm run seed
```

This creates:
- 12 watch products across 4 categories
- 5 sample orders
- 1 admin account

---

## Features

### Public Storefront

| Feature | Description |
|---|---|
| **Home Page** | Hero section, featured products, newsletter signup |
| **Shop** | Full catalog with category filters, price range slider, and sorting |
| **Product Details** | Image gallery, specifications, stock status, add to cart |
| **Shopping Cart** | Quantity controls, order summary, persistent via localStorage |
| **Checkout** | Delivery form (name, phone, city, address), Cash on Delivery, order confirmation |

### Admin Dashboard

| Feature | Description |
|---|---|
| **Login** | JWT-based authentication |
| **Dashboard** | Stats cards (products, orders, revenue in UM, pending orders), recent orders |
| **Products** | Full CRUD — add, edit, delete products with image URLs |
| **Orders** | View all orders, expand details, change status (معلق → قيد التوصيل → مكتمل → ملغى) |
| **Analytics** | Monthly sales bar chart, daily revenue line chart, category & order status doughnut charts |

### Admin Credentials

```
Email:    admin@watches.mr
Password: admin123
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/featured` | Get featured products |
| `GET` | `/api/products/categories` | Get product categories |
| `GET` | `/api/products/:id` | Get product by ID |
| `POST` | `/api/orders` | Create a new order |

### Admin (JWT Required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Validate token |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/orders` | Get all orders |
| `PUT` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/orders/stats` | Dashboard statistics |
| `GET` | `/api/orders/analytics` | Analytics chart data |

---

## Order Statuses

| Status | Arabic | Description |
|---|---|---|
| Pending | معلق | New order, awaiting processing |
| Shipping | قيد التوصيل | Order is being delivered |
| Completed | مكتمل | Order delivered successfully |
| Cancelled | ملغى | Order was cancelled |

---

## Product Categories

| Category | Arabic |
|---|---|
| Luxury | فاخرة |
| Sports | رياضية |
| Classic | كلاسيكية |
| Smart | ذكية |

---

## Currency

All prices are displayed in **Mauritanian Ouguiya (UM)** using Arabic locale formatting (`ar-MR`).

```
Example: 450,000 أوقية
```

---

## Design

- **Theme:** Black & Gold luxury aesthetic
- **Direction:** RTL (Right-to-Left) for Arabic
- **Font:** Cairo (Google Fonts)
- **Responsive:** Mobile-first design across all pages
- **Admin:** Dark dashboard with gold accents

---

## Build for Production

```bash
# Build the frontend
cd client
npm run build

# The output will be in client/dist/
# Serve with any static file server or configure Express to serve it
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

<div align="center">

**Mega Watches** — Built with React, Express & MongoDB

</div>
