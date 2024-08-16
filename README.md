
# E-Shop

Welcome to the E-Shop project! This is a fully functional e-commerce API developed for practice and to showcase my skills. The project includes a range of features and routes to handle various aspects of an online shopping platform.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Features

- **User Authentication**: Register, login, and manage user accounts with JWT-based authentication.
- **User Roles**: Assign users to roles such as admin, moderator, or user.
- **Product Management**: Add, update, delete, and view products.
- **Search & Filters**: Search products and apply filters to refine search results.
- **Shopping Cart**: Manage items in the cart, including adding and removing products.
- **Order Management**: Place orders, view order history, and manage order statuses.
- **Payment Integration**: Integration with payment gateways for processing transactions (mock or real).
- **Discounts & Coupons**: Apply discounts and coupons to orders.
- **Emails**: Send email messages for registration, password reset, and order confirmations.
- **Error Handling**: Handle errors gracefully and return user-friendly error messages.
- **Security**:
  - **XSS**: Protected against Cross-Site Scripting attacks using `xss-clean`.
  - **NoSQL Injection**: Protected against NoSQL injection attacks using `express-mongo-sanitize`.
  - **Data Sanitization**: Sanitized user input using `express-validator`.
  - **Rate Limiter**: Limited the number of requests per IP using `express-rate-limit`.
  - **Body Limit**: Limited the size of the request body using `body-parser`.
  - **HTTP Parameter Pollution Prevention**: Protected against HTTP Parameter Pollution attacks using `hpp`.

## Technical Details

- **Backend**:
  - **Node.js**: The JavaScript runtime used for server-side programming.
  - **Express.js**: A popular web application framework for Node.js.
  - **MongoDB**: A NoSQL database used for storing data.
  - **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.

- **Packages**:
  - See [package.json](package.json) for a list of dependencies.

- **Routes**:
  - See [routes](./routes/router.js) directory for a list of API endpoints.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/makhalifa/khalifa-ecommerce-api.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd khalifa-ecommerce-api
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add your environment variables. Example:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:5000

   # Jwt
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=1h

   # Nodemailer
   MAILER_HOST=smtp.gmail.com
   MAILER_PORT=465
   MAILER_USERNAME=makask307@gmail.com
   MAILER_PASSWORD=jkvwnrareffryzyy

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_public_key
   ```
   

5. **Start the Server**

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:5000`.

## Usage

- **Register a new user**: POST `/api/v1/auth/signup`
- **Login**: POST `/api/v1/auth/login`
- **View Products**: GET `/api/v1/products`
- **Add Product to Cart**: POST `/api/v1/cart`
- **Place Order**: POST `/api/v1/orders`

## API Endpoints

See the [API Documentation](https://documenter.getpostman.com/view/12567532/2sA3s7k9to) for a detailed list of endpoints and parameters.

## Contributing

Contributions are welcome! If you'd like to contribute to the E-Shop, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or fix
3. Make your changes and commit them
4. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.


## Author

[Mohamed Khalifa](https://github.com/makhalifa)
