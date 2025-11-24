# E-Commerce Platform – Full Stack Web Application  
Built with React, Node.js, Express, MySQL, JWT, and CSS

A full-stack e-commerce platform that allows users to browse products, authenticate securely, manage their cart, and interact with a responsive React interface. Backend services handle authentication, product APIs, and database operations.

---

## Features

### Frontend (React)
- Product browsing UI built with React components, hooks, and state management  
- User authentication flow (login and register) integrated with the backend  
- Dynamic product rendering with filtering and category support  
- Cart functionality that updates quantities, totals, and item availability  
- Protected routes for accessing user-specific pages  
- Responsive CSS styling for a clean user experience  

### Backend (Node.js + Express + MySQL)
- REST API built using Express for products, authentication, and cart operations  
- JWT-based authentication for secure login and protected endpoints  
- Password hashing for secure credential storage  
- MySQL database for storing:
  - Users  
  - Products  
  - Cart items  
- Centralized error handling and validation  
- Environment-based configuration using `.env`  

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
