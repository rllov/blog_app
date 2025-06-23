# Blog App – Full Stack Project

## Overview

This is a full stack blog application where users can sign up, log in, create posts (with optional images), comment on posts, and like/unlike posts. The project demonstrates a modern web application architecture using a **React** frontend and a **FastAPI** backend, with a **PostgreSQL** database for persistent storage.

---

## Features

- **User Authentication:** Sign up and log in with JWT-based authentication.
- **Create Posts:** Users can create text posts and optionally upload images.
- **View Posts:** All posts are displayed in reverse chronological order.
- **Commenting System:** Users can comment on any post.
- **Like System:** Users can like or unlike posts.
- **Responsive UI:** Built with React and Tailwind CSS for a modern look.
- **Image Uploads:** Uploaded images are stored and served from the backend.
- **Admin/Feature Roadmap:** (Planned) Admin dashboard, notifications, user profiles, and post categorization.

---

## Technologies Used

### **Frontend**

- **React** (with Vite for fast development)
- **React Router** (for navigation)
- **Axios** (for HTTP requests)
- **Tailwind CSS** (for styling)
- **React Icons** (for UI icons)

### **Backend**

- **FastAPI** (Python web framework)
- **SQLAlchemy** (ORM for database models)
- **Pydantic** (for data validation)
- **bcrypt** (for password hashing)
- **python-jose** (for JWT authentication)
- **python-dotenv** (for environment variable management)
- **Uvicorn** (ASGI server for FastAPI)

### **Database**

- **PostgreSQL** (relational database)

### **DevOps/Deployment**

- **Docker & Docker Compose** (for containerization and easy local development)
- **Nginx** (serving the frontend in production)
- **Render** (for cloud deployment, if used)

---
