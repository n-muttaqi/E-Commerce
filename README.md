# E-Commerce Platform – Full Stack Web Application  
Built with React, Node.js, Express, MySQL, JWT, and CSS

A full-stack e-commerce platform that allows users to browse products, authenticate securely, manage their shopping cart, and complete essential store interactions. The system includes a React-based frontend for the user interface and a Node/Express/MySQL backend for data management, authentication, and API services.

---

## Features

### What the Platform Does
- Displays a list of products with pricing, images, and descriptions  
- Allows users to register and log in securely using JWT authentication  
- Lets authenticated users add products to a cart and adjust item quantities  
- Stores cart items persistently in the MySQL database  
- Shows cart totals, item breakdowns, and provides a smooth checkout workflow  
- Protects specific routes and operations so only logged-in users can access them  
- Ensures consistent data flow between frontend and backend through REST APIs  

---

### Frontend (React)
- Modular React components for product listings, product cards, layout, and cart  
- React Router for navigation across pages (Home, Login, Cart, Products)  
- State management for cart updates, user sessions, and product rendering  
- Responsive CSS styling for clean display on desktop and mobile  
- Integration with backend APIs for authentication and product data  
- User session persistence through local storage  

---

### Backend (Node.js + Express + MySQL)
- REST API with endpoints for:
  - User authentication (register and login)  
  - Retrieving products  
  - Managing cart operations (add, update, remove)  
- JWT authentication with protected routes  
- Password hashing for secure credential storage  
- MySQL database for:
  - Users  
  - Products  
  - Cart items  
- Organized controller and route structure for scalability  
- `.env` configuration for database credentials and JWT secrets  

---

## Tech Stack

### Frontend
- React  
- React Router  
- CSS  

### Backend
- Node.js  
- Express.js  
- MySQL  
- JWT Authentication  

---

## Running the Project

This project has a separate frontend and backend. Each must be started individually after installing the required Node modules.

### 1. Start the Backend
```bash
cd server
npm install
npm start
```
### 2. Start the Frontend
```bash
cd client
npm install
npm start
```
