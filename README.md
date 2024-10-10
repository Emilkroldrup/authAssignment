# Project Overview: Advanced REST API for User Management

## Introduction

Hey there! This is my Advanced REST API project, built to manage users, roles, and authentication securely. It’s been quite the journey, and I want to walk you through the core features, the decisions I made, and the challenges I tackled along the way. My goal was to build a scalable, well-documented, and secure API, and I’ve learned a ton throughout this process. Let's dive in!

## Project Features

- **User Registration and Authentication**: Users can register with different roles and securely log in.
- **Role-Based Access Control**: Each user is assigned a role (`soldier`, `officer`, `admin`) that dictates their access level within the app.
- **JWT Authentication**: I started with a simple JWT implementation using the `jsonwebtoken` library, but then decided to take on the challenge of building my own JWT functions. This was to really understand how JWT works under the hood.
- **API Documentation with Swagger**: Full Swagger documentation for easy integration.
- **Frontend Integration**: The backend API is ready to connect smoothly with a Next.js frontend, which I’ve already started on.

## Folder Structure Overview

To keep things modular and easy to maintain, I organized the backend into several folders:

- **`backend/src/config`**: Handles database configuration and connection.
- **`backend/src/controllers`**: Manages user-related actions like registration, login, and role management.
- **`backend/src/middleware`**: Contains middleware for JWT and role validation.
- **`backend/src/models`**: Mongoose models for MongoDB.
- **`backend/src/routes`**: Defines all the endpoints related to authentication.

I've also set up a **frontend** folder for the Next.js TypeScript application, making it easy to navigate between backend and frontend work.

## Key Architectural Changes and Challenges

### 1. JWT Token Management

Originally, I used the `jsonwebtoken` library for token generation and verification. It worked fine, but I wanted to take things a step further and really learn how JWT works. So, I challenged myself to build the token generation and verification from scratch.

Now, I manually create and sign the tokens, handle the encoding, and verify their integrity, which has given me a much deeper understanding of JWT, hashing, and payload security.

### 2. Separation of JWT Logic

Once I started manually creating and verifying tokens, I decided to extract the JWT-related functionality into a dedicated utility file (`jwtUtils.js`). This makes the authentication controller (`authController`) cleaner and easier to maintain:

- **`generateJWT`**: Manually creates tokens, includes expiration time, and securely signs them.
- **`verifyJWT`**: Manually verifies tokens, checking for tampering and expiration.

### 3. Middleware Enhancements

I also updated the **authentication middleware** to use my custom `verifyJWT` function, ensuring consistency throughout the application. I then added a **role-based middleware** (`roleMiddleware`) to restrict certain routes to specific user roles, like admins only.

### 4. Role-Based Access Control

The project now has a clear structure that defines which roles have access to what. For example, the `/api/auth/admin` route requires the user not only to be authenticated but also to have the `admin` role.

## Backend Features Walkthrough

- **Registration**: Users can register using the `/api/auth/register` endpoint. I used **Joi** for validation to enforce password strength and username requirements.
- **Login**: The `/api/auth/login` endpoint lets users log in. If the credentials are valid, a JWT token is generated and sent as an **HTTP-only cookie** for security.
- **JWT Verification**: Protected routes are secured with JWT verification via `authMiddleware`, ensuring the token is valid and hasn’t expired.
- **Role Middleware**: Some routes require extra checks—like the admin-only `/api/auth/admin` route, which uses `roleMiddleware` to verify the user's role.

## Frontend Integratio

I’ve set up a **Next.js** frontend in **TypeScript** that consumes the backend API. It includes forms for **user registration** and **login**, and uses **Axios** to communicate with the backend. JWT tokens are set as **HTTP-only cookies** to enhance security and prevent XSS attacks. I plan to use **React Context** for managing the authentication state, ensuring users are seamlessly redirected based on their roles.

## Future Improvements

- **Frontend Protected Routes**: I’ll be implementing protected routes using Next.js to ensure that only logged-in users with the correct role can access certain pages.
- **Session Management**: Adding a refresh token mechanism to extend user sessions securely is definitely on my list.
- **UI/UX Enhancements**: I want to make the frontend look really polished, with better styling and user-friendly error messages.

## Conclusion

This project has been all about building a complete backend setup for **secure user management** with **role-based access control** and **JWT authentication**. Moving from using a library for JWT to building my own implementation was a challenging but rewarding experience. By extracting JWT operations, using middleware for access control, and structuring the application into logical modules, I’ve created something that’s not only functional but also maintainable and scalable.

Thanks for checking out my project! If you have any questions or suggestions for improvements, I’d love to hear them. 😊🚀
