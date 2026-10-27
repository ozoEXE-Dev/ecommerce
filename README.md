# E-Commerce REST API

A backend REST API for an e-commerce platform built with **Node.js**, **Express.js**, and **MongoDB**. The project uses an **MVCS (Model–View–Controller–Service) architecture** and includes product management, authentication, shopping carts, orders, payments, image uploads, and API security features.

## Live Deployment

**Base URL:** https://ecommerce-346f.onrender.com

> Note: The deployed service may take a short time to respond if the hosting platform has put it to sleep.

## Features

- **Product catalog:** CRUD operations for products, categories, subcategories, and brands.
- **Product querying:** Filtering, sorting, searching, field selection, and pagination.
- **Authentication and authorization:** JWT-based authentication, password hashing, user permissions, and password-reset workflows.
- **Reviews and ratings:** Product reviews, user associations, and rating calculations.
- **Wishlist and addresses:** Wishlist management and user address operations.
- **Shopping cart:** Add and remove items, update quantities, clear the cart, and apply coupons.
- **Orders:** Cash orders, order retrieval, and administrative order-status updates.
- **Online payments:** Stripe Checkout integration and webhook handling.
- **Image handling:** Image uploads with Multer and image processing with Sharp.
- **Validation and error handling:** Request validation with `express-validator` and centralized error-handling middleware.
- **Security:** Rate limiting, request-size limits, data sanitization, and other API hardening measures.
- **API testing:** Endpoints tested using Postman.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Architecture:** MVCS (Model–View–Controller–Service)
- **Validation:** express-validator
- **Authentication:** JSON Web Tokens (JWT)
- **Password security:** bcrypt / password hashing
- **Image uploads:** Multer
- **Image processing:** Sharp
- **Payments:** Stripe
- **Testing:** Postman

## Architecture

The project follows the MVCS pattern to separate responsibilities:

- **Models:** Define data structures and interact with MongoDB through Mongoose.
- **Views:** Handle presentation where applicable; for a REST API, responses are generally returned as JSON.
- **Controllers:** Handle incoming requests, coordinate operations, and return responses.
- **Services:** Encapsulate business logic and reusable operations.

## Main API Areas

The API includes functionality for:

- Categories, subcategories, brands, and products
- User registration, login, account management, and authorization
- Reviews, wishlist, and user addresses
- Coupons and shopping cart
- Cash and Stripe-based orders
- Image upload and processing

The exact route paths and request formats depend on the implementation in the source code.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database (local or hosted)
- Stripe account and API keys if testing payment features

### Installation

1. Clone this repository:

   ```bash
   git clone <https://github.com/ozoEXE-Dev/ecommerce.git>
   cd <YOUR_PROJECT_DIRECTORY>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the environment variables used by this project:

   ```env
   APP_NAME=
   PORT=
   NODE_ENV=
   DB_USER=
   DB_PASSWORD=
   HOST_NAME=
   DB_CONNECTION_URI=
   JWT_SECRET=
   JWT_EXPIRE_DATE=
   MAIL_HOST=
   MAIL_PORT=
   MAIL_USER=
   MAIL_PASSWORD=
   STRIPE_SECRET_KEY=
   ```

   Fill in the values for your environment. Keep credentials and secret keys private, and never commit your real `.env` file to Git.

## API Testing

A `postman.json` file is included in the repository to help you test the API endpoints with Postman.

1. Open Postman.
2. Import the `postman.json` file from this repository.
3. Set the request base URL to the deployed API:

   ```text
   https://ecommerce-346f.onrender.com
   ```

4. Send requests using the included collection. Authentication-protected endpoints may require a JWT access token.
5. For payment workflows, configure the required Stripe credentials and webhook settings.

You can also use your local server as the base URL when running the project locally.

## Deployment

The application is deployed on Render:

https://ecommerce-346f.onrender.com

## Notes

- This repository contains a learning project demonstrating common e-commerce backend functionality.
- Review the source code and environment configuration for the exact endpoint paths, environment variables, and available scripts.
- Do not commit `.env` files, database credentials, JWT secrets, or payment-provider secrets.

