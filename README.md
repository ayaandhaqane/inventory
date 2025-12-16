# Inventory Management System

A full-stack Inventory Management System that allows users to manage products and categories, monitor stock levels, and track inventory value in real time.

The project consists of:
- A **React + TypeScript** frontend
- A **Node.js + Express** backend
- A **PostgreSQL** database

---

## 🚀 Features

- Add, update, and delete products
- Manage product categories
- Track product quantity and low-stock items
- Upload and display product images
- RESTful API integration
- Responsive and clean dashboard UI

---

## 🛠️ Tech Stack

### Frontend
- **React**
- **TypeScript**
- **Axios**
- **Tailwind CSS**
- **Lucide React Icons**

### Backend
- **Node.js**
- **Express.js**
- **TypeScript**
- **Multer** (image uploads)

### Database
- **PostgreSQL**

### Deployment
- **Vercel** (Frontend)
- **Render** (Backend & Database)

---

## 🤔 Why This Tech Stack?

- **React + TypeScript**  
  Chosen for strong type safety, scalability, and maintainability. TypeScript reduces runtime errors and improves code quality.

- **Node.js + Express**  
  Provides a fast, lightweight backend with a simple structure for building REST APIs.

- **PostgreSQL**  
  A reliable relational database that supports complex queries, relationships, and data integrity.

- **Render & Vercel**  
  Easy cloud deployment with minimal configuration and free hosting suitable for academic projects.

---

## 📦 Installation & Running Locally

### 1️⃣ Clone the Repository
```bash
-- git clone https://github.com/your-username/inventory-management.git
-- cd inventory-management
### 2️⃣ Backend Setup
-- cd backend
-- npm install

Create a .env file inside the backend folder:

PORT=8000
DATABASE_URL=postgresql://username:password@localhost:5432/inventory
NODE_ENV=development

### Start the backend server:
-- npm run dev

### Backend will run at:

-- http://localhost:8000

### 3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend will run at:
http://localhost:5173

### API Endpoints
**API Endpoints
Products

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

Categories

GET /api/categories

POST /api/categories

PUT /api/categories/:id

DELETE /api/categories/:idProducts
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id

Categories

GET /api/categories
POST /api/categories
PUT /api/categories/:id
DELETE /api/categories/:id
