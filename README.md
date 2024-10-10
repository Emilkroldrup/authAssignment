# Projektoversigt: Avanceret REST API til brugerhåndtering

## Introduktion

Hej med dig! Dette er mit Advanced REST API-projekt, der er bygget til at håndtere brugere, roller og authentication sikkert. jeg vil gerne tage dig igennem de vigtigste funktioner, de beslutninger jeg har truffet, og de udfordringer jeg har tacklet undervejs. Målet har været at bygge en skalerbar, veldokumenteret og sikker API.

## Projektfunktioner

- **Brugerregistrering og authentication**: Brugere kan registrere sig med forskellige roller og logge ind sikkert.
- **Rollebaseret adgangskontrol**: Hver bruger tildeles en rolle (`soldat`, `officer`, `admin`), som dikterer deres adgangsniveau i appen.
- **JWT-authentication**: Jeg startede med en simpel JWT-implementering ved hjælp af `jsonwebtoken`-biblioteket, men besluttede mig senere for at tage udfordringen op med at lave mine egne JWT-funktioner. Dette gjorde jeg for virkelig at forstå, hvordan JWT fungerer bag kulisserne.
- **API-dokumentation med Swagger**: Fuldt dokumenteret med Swagger for nem integration.
- **Frontend-integration**: Backend-API'et er klar til at blive koblet sammen med en Next.js frontend, som jeg allerede har startet på.

## Oversigt over mappe-struktur

For at holde det hele modulært og let at vedligeholde, har jeg organiseret backenden i flere mapper:

- **`backend/src/config`**: Håndterer databasekonfiguration og forbindelsesoplysninger.
- **`backend/src/controllers`**: Styrer brugerrelaterede handlinger som registrering, login og rollehåndtering.
- **`backend/src/middleware`**: Indeholder middleware til JWT og rollevalidering.
- **`backend/src/models`**: Mongoose-modeller til MongoDB.
- **`backend/src/routes`**: Definerer alle endpoints relateret til authentication.

Jeg har også oprettet en **frontend**-mappe til Next.js TypeScript-applikationen, så det er nemt at navigere mellem backend og frontend-arbejdet.

## Nøgleændringer og udfordringer i arkitekturen

### 1. Håndtering af JWT-tokens

Oprindeligt brugte jeg `jsonwebtoken`-biblioteket til at generere og verificere tokens. Det fungerede fint, men jeg ville gerne tage det et skridt videre og virkelig lære, hvordan JWT fungerer. Så jeg udfordrede mig selv ved at bygge token-generering og verifikation fra bunden.

Nu opretter og signerer jeg manuelt tokens, håndterer kodning, og verificerer deres integritet, hvilket har givet mig en meget dybere forståelse af JWT, hashing og payload-sikkerhed.

### 2. Adskillelse af JWT-logik

Efter jeg begyndte at oprette og verificere tokens manuelt, besluttede jeg at udtrække JWT-relateret funktionalitet til en dedikeret utility-fil (`jwtUtils.js`). Dette gør authenticationscontrolleren (`authController`) renere og lettere at vedligeholde:

- **`generateJWT`**: Opretter tokens manuelt, inkluderer udløbstid og signerer dem sikkert.
- **`verifyJWT`**: Verificerer tokens manuelt, kontrollerer for manipulation og udløbstid.

### 3. Forbedringer i Middleware

Jeg opdaterede også **authenticationsmiddleware** til at bruge min tilpassede `verifyJWT`-funktion, så der er konsistens i hele applikationen. Derefter tilføjede jeg en **rollebaseret middleware** (`roleMiddleware`) for at begrænse visse ruter til specifikke brugerroller, fx kun til admin.

### 4. Rollebaseret adgangskontrol

Projektet har nu en klar struktur, der definerer, hvilke roller der har adgang til hvad. For eksempel kræver `/api/auth/admin`-ruten, at brugeren ikke kun er autentificeret, men også har rollen `admin`.

## Gennemgang af backend-funktioner

- **Registrering**: Brugere kan registrere sig via `/api/auth/register`-endpointet. Jeg brugte **Joi** til validering for at sikre stærke adgangskoder og krav til brugernavne.
- **Login**: `/api/auth/login`-endpointet giver brugere mulighed for at logge ind. Hvis legitimationsoplysningerne er korrekte, genereres en JWT-token og sendes som en **HTTP-only cookie** for ekstra sikkerhed.
- **JWT-verifikation**: Beskyttede ruter er sikret med JWT-verifikation via `authMiddleware`, som sikrer, at token er gyldig og ikke er udløbet.
- **Rolle-middleware**: Nogle ruter kræver ekstra kontrol—som fx admin-only `/api/auth/admin`-ruten, der bruger `roleMiddleware` til at verificere brugerens rolle.

## Frontend-integration

Jeg har sat en **Next.js** frontend op i **TypeScript**, der bruger backend-API'et. Den inkluderer formularer til **brugerregistrering** og **login**, og bruger **Axios** til at kommunikere med backenden. JWT-tokens er sat som **HTTP-only cookies** for at forbedre sikkerheden og forhindre XSS-angreb. Jeg planlægger at bruge **React Context** til at håndtere authenticationstilstanden, så brugere nemt kan blive omdirigeret baseret på deres roller.

## Fremtidige forbedringer

- **Frontend-beskyttede ruter**: Jeg vil implementere beskyttede ruter ved hjælp af Next.js for at sikre, at kun brugere med de rette roller kan få adgang til visse sider.
- **Sessionshåndtering**: Tilføjelse af en refresh token-mekanisme for at forlænge brugerens session sikkert er også på min liste.
- **UI/UX-forbedringer**: Jeg vil gøre frontenden virkelig lækker, med bedre styling og brugervenlige fejlmeddelelser.

## Sådan installerer og starter du projektet

### Forudsætninger

- **Node.js** (version 14+)
- **npm** eller **yarn**
- **MongoDB** instans (lokal eller cloud)

### Installationsvejledning

1. **Klon repository**:

   ```bash
   git clone https://github.com/your-username/authAssignment.git
   cd authAssignment
   ```

2. **Backend-opsætning**:

   ```bash
   cd backend
   npm install
   Opret en .env fil i root backend folder med
   MONGO_URI=din_mongo_forbindelsesstreng
   JWT_SECRET=din_jwt_hemmelighed
   Start med: npm start
   ```

3. **Frontend-opsætning**:

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

   Du kan tilgå Swagger dokumentation ved at gå til

   ```bash
   http://localhost:5000/api-docs
   ```

## Konklusion

Dette projekt har handlet om at bygge en komplet backend-opsætning til **sikker brugerhåndtering** med **rollebaseret adgangskontrol** og **JWT-authentication**. At gå fra at bruge et bibliotek til JWT til at bygge min egen implementering var en udfordrende men lærerig oplevelse. Ved at udtrække JWT-operationer, bruge middleware til adgangskontrol og strukturere applikationen i logiske moduler, har jeg skabt noget, der ikke kun er funktionelt, men også vedligeholdelsesvenligt og skalerbart.

Tak fordi du kiggede forbi mit projekt! Hvis du har spørgsmål eller forslag til forbedringer, vil jeg meget gerne høre dem.

## English version

# Project Overview: Advanced REST API for User Management

## Introduction

Hey there! This is my Advanced REST API project, built to manage users, roles, and authentication securely. I want to walk you through the core features, the decisions I've made, and the challenges I've tackled along the way. The goal has been to build a scalable, well-documented, and secure API.

## Project Features

- **User Registration and Authentication**: Users can register with different roles and log in securely.
- **Role-Based Access Control**: Each user is assigned a role (`soldier`, `officer`, `admin`) that dictates their access level within the app.
- **JWT Authentication**: I started with a simple JWT implementation using the `jsonwebtoken` library, but later decided to take on the challenge of building my own JWT functions. This was to truly understand how JWT works behind the scenes.
- **API Documentation with Swagger**: Fully documented with Swagger for easy integration.
- **Frontend Integration**: The backend API is ready to connect smoothly with a Next.js frontend, which I have already started working on.

## Folder Structure Overview

To keep things modular and easy to maintain, I organized the backend into several folders:

- **`backend/src/config`**: Handles database configuration and connection.
- **`backend/src/controllers`**: Manages user-related actions like registration, login, and role management.
- **`backend/src/middleware`**: Contains middleware for JWT and role validation.
- **`backend/src/models`**: Mongoose models for MongoDB.
- **`backend/src/routes`**: Defines all the endpoints related to authentication.

I've also set up a **frontend** folder for the Next.js TypeScript application, making it easy to navigate between backend and frontend work.

## Key Architectural Changes and Challenges

### 1. Handling JWT Tokens

Originally, I used the `jsonwebtoken` library to generate and verify tokens. It worked fine, but I wanted to take things a step further and truly learn how JWT works. So, I challenged myself to build the token generation and verification from scratch.

Now, I manually create and sign the tokens, handle the encoding, and verify their integrity, which has given me a much deeper understanding of JWT, hashing, and payload security.

### 2. Separation of JWT Logic

Once I started manually creating and verifying tokens, I decided to extract the JWT-related functionality into a dedicated utility file (`jwtUtils.js`). This makes the authentication controller (`authController`) cleaner and easier to maintain:

- **`generateJWT`**: Manually creates tokens, includes expiration time, and securely signs them.
- **`verifyJWT`**: Manually verifies tokens, checks for tampering and expiration.

### 3. Middleware Improvements

I also updated the **authentication middleware** to use my custom `verifyJWT` function, ensuring consistency throughout the application. Then I added **role-based middleware** (`roleMiddleware`) to restrict certain routes to specific user roles, like admins only.

### 4. Role-Based Access Control

The project now has a clear structure that defines which roles have access to what. For example, the `/api/auth/admin` route requires the user to not only be authenticated but also have the `admin` role.

## Backend Features Walkthrough

- **Registration**: Users can register via the `/api/auth/register` endpoint. I used **Joi** for validation to enforce strong passwords and username requirements.
- **Login**: The `/api/auth/login` endpoint lets users log in. If the credentials are correct, a JWT token is generated and sent as an **HTTP-only cookie** for extra security.
- **JWT Verification**: Protected routes are secured with JWT verification via `authMiddleware`, which ensures the token is valid and not expired.
- **Role Middleware**: Some routes require extra checks—like the admin-only `/api/auth/admin` route, which uses `roleMiddleware` to verify the user's role.

## Frontend Integration

I have set up a **Next.js** frontend in **TypeScript** that consumes the backend API. It includes forms for **user registration** and **login** and uses **Axios** to communicate with the backend. JWT tokens are set as **HTTP-only cookies** to enhance security and prevent XSS attacks. I plan to use **React Context** for managing authentication state, ensuring users are seamlessly redirected based on their roles.

## Future Improvements

- **Frontend Protected Routes**: I will implement protected routes using Next.js to ensure that only users with the correct roles can access certain pages.
- **Session Management**: Adding a refresh token mechanism to extend the user session securely is also on my list.
- **UI/UX Enhancements**: I want to make the frontend really polished, with better styling and user-friendly error messages.

## How to Install and Start the Project

### Prerequisites

- **Node.js** (version 14+)
- **npm** or **yarn**
- **MongoDB** instance (local or cloud)

### Installation Guide

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/authAssignment.git
   cd authAssignment
   ```

2. **Backend-setup**:

   ```bash
    cd backend
    npm install
    Create a .env file in the root backend folder with:
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret
    Start with: npm start
   ```

3. **Frontend-setup**:

   ```bash
    cd ../frontend
    npm install
    npm run dev
   ```

    You can access swagger docs by going to this url:

   ```bash
   http://localhost:5000/api-docs
   ```

## Conclusion

This project has been all about building a complete backend setup for secure user management with role-based access control and JWT authentication. Moving from using a library for JWT to building my own implementation was a challenging but rewarding experience. By extracting JWT operations, using middleware for access control, and structuring the application into logical modules, I’ve created something that’s not only functional but also maintainable and scalable.

Thanks for checking out my project! If you have any questions or suggestions for improvements, I'd love to hear them.
