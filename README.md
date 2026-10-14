# ☕ CaféNest — Full-Stack Restaurant & Café Website

CaféNest is a modern, responsive, full-stack restaurant and café management website built with React.js, Node.js, Express.js, and MongoDB.

The application provides a customer-facing restaurant website and an admin panel for managing menus, orders, customers, coupons, table reservations, gallery images, enquiries, reviews, and business settings.

## 🌐 Live Demo

- **Customer Website:** https://restaurant-cafe-website-nine.vercel.app/
- **Admin Panel:** https://restaurant-cafe-website-nine.vercel.app/admin/login
- **GitHub Repository:** https://github.com/sandipmandalgithub/restaurant-cafe-website

## 📌 Project Overview

CaféNest is designed as a digital solution for restaurants, cafés, cloud kitchens, and food businesses.

Customers can explore the menu, create an account, place orders, apply coupons, view their order history, track order status, reserve tables, submit reviews, and contact the business.

Administrators can manage restaurant operations through a protected dashboard, including menu items, customer orders, coupons, table reservations, enquiries, gallery content, reviews, and business settings.

## ✨ Features

### 👤 Customer Features

#### 🏠 Home, About & Location

- Restaurant introduction and featured content
- Business and brand information
- Restaurant location and contact information
- Responsive page layouts

#### 🍽️ Menu

- Browse food items and categories
- View food images, descriptions, and prices
- Filter menu items by category
- Check item availability
- Add available items to the cart

Example categories include beverages, burgers, pizza, main course, desserts, sides, and sandwiches.

#### 🛒 Shopping Cart

- Add and remove food items
- Increase or decrease quantities
- View subtotal and total amount
- Continue shopping
- Proceed to checkout
- Persist cart data using browser local storage

#### 🔐 Customer Registration & Authentication

- Customer registration
- Customer login and logout
- JWT-based authentication
- Password hashing on the backend
- Protected customer account features
- Authenticated access to customer-specific information

#### 🧾 Checkout & Order Placement

- Enter required customer and order information
- Apply eligible coupon codes
- Validate coupon eligibility
- Calculate discounts and final order totals
- Submit orders through the backend API
- Store order information in MongoDB

#### 📦 Customer Order History

- View previous orders in the My Orders section
- View individual order details
- Check order IDs, ordered items, and order totals
- View the current status of an order
- Access order history associated with the customer account

#### 🚚 Order Tracking

- Track an order using its Order ID
- View the current order status
- Follow order progress as the administrator updates it
- View applicable cancellation information

Typical order statuses:

- Pending
- Confirmed
- Preparing
- Ready
- Completed
- Cancelled

#### 📧 Email Notifications

The email notification system supports:

- Order confirmation emails
- Order status update emails
- Customer communication related to order progress

Email delivery requires the relevant backend email-service configuration and valid environment variables.

#### 🎟️ Coupon & Discount System

Customers can apply eligible coupons during checkout.

- Enter a coupon code
- Apply percentage-based discounts
- Apply fixed-amount discounts
- Validate minimum order requirements
- Validate coupon expiry dates
- Reject invalid, expired, or inactive coupons
- Calculate the applicable discount and final payable amount

Coupon eligibility and discount calculations are handled by the application’s coupon logic.

#### 🪑 Table Reservation System

Customers can submit table reservation requests with:

- Reservation date and time
- Number of guests
- Customer name and contact information
- Reservation confirmation and status information

Reservation requests can be managed from the admin panel.

Typical reservation statuses:

- Pending
- Confirmed
- Cancelled
- Completed

#### 🖼️ Gallery

- Browse restaurant and food images
- Explore interior and ambience images
- View images by gallery category

#### 📞 Contact & Enquiries

- Submit customer enquiries
- Provide contact details and messages
- Contact the business by phone
- Contact the business through WhatsApp
- Manage submitted enquiries through the admin panel

#### ⭐ Reviews & Testimonials

- View customer reviews and ratings
- Read testimonials
- Submit customer feedback through the review system

#### 📱 Responsive Design

The website is designed for mobile phones, tablets, laptops, and desktop screens.

Responsive design targets include:

- 320px — Small mobile
- 375px — Mobile
- 768px — Tablet
- 1024px — Laptop
- Desktop and larger screens

The goal is to provide a consistent experience without unnecessary horizontal scrolling.

## 🔐 Admin Panel Features

### 🔑 Admin Authentication

- Admin login using email and password
- JWT-based authentication
- Protected admin routes
- Authentication token handling on the frontend

### 📊 Admin Dashboard

- Overview of menu items and orders
- Pending, preparing, and completed order summaries
- Revenue information
- Best-selling menu item information
- Business overview and charts

### 🍽️ Menu Management

- Create, view, edit, and delete menu items
- Search and filter menu items
- Sort items by price
- Manage categories, descriptions, prices, and images
- Change item availability
- Mark items as Available or Out of Stock

### 📦 Order Management

- View customer orders
- Review customer and delivery information
- View ordered items, quantities, prices, and totals
- Update order statuses
- Manage order progress from the admin panel

### 👥 Customer Account & Order History

- Customer authentication supports account-specific order information
- Customers can access their own order history
- Customer-specific data must be protected by appropriate backend authorization

### 🎟️ Coupon Management

- Create, edit, and delete coupons
- Configure coupon codes
- Set percentage or fixed-amount discounts
- Configure minimum order amounts
- Set expiry dates
- Activate or deactivate coupons
- Validate coupon eligibility during checkout

### 🪑 Table Reservation Management

- View submitted reservation requests
- Review reservation date, time, guest count, and customer information
- Update reservation status
- Manage pending, confirmed, cancelled, and completed reservations

### 📧 Email Notification Configuration

- Support order confirmation emails
- Support order status update emails
- Configure the required email service through backend environment variables

### 🖼️ Gallery Management

- Add, edit, and delete gallery items
- Manage image titles, URLs, and categories

### 📩 Enquiry Management

- View customer enquiries
- Review customer contact information and messages
- Manage enquiry information and status where supported

### ⭐ Review Management

- Review customer ratings and feedback
- Manage review information through the available review functionality

### ⚙️ Business Settings

Manage business information through the admin panel, including supported settings such as:

- Business name and description
- Phone number and email address
- Business address
- Opening and closing times
- Delivery charge and availability
- Pickup availability
- WhatsApp contact number
- Social media links

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript and JSX
- React Router
- Tailwind CSS
- CSS
- Vite
- Axios

### Backend

- Node.js
- Express.js
- REST APIs
- JWT authentication
- Password hashing

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Development Tools

- Visual Studio Code
- Git and GitHub
- Postman
- npm

## 🏗️ Application Architecture

CaféNest follows a full-stack client-server architecture.

```text
Customer / Admin
       |
       v
React + Vite Frontend
       |
       v
Express REST API
       |
       v
Node.js Backend
       |
       v
MongoDB Atlas
```

The backend handles API requests, authentication, data validation, business logic, and database operations. Protected features require appropriate authentication and authorization.

## 🔄 Customer Workflow

```text
Visit Website
      |
      v
Browse Menu
      |
      v
Register / Login
      |
      v
Select Food Items
      |
      v
Add to Cart
      |
      v
Apply Coupon (Optional)
      |
      v
Checkout
      |
      v
Place Order
      |
      v
Receive Order ID
      |
      v
Order History / Order Tracking
```

Customers can also submit table reservation requests, contact the business, and interact with the review system.

## 🔄 Admin Workflow

```text
Admin Login
     |
     v
Admin Dashboard
     |
     +--> Menu Management
     |
     +--> Order Management
     |
     +--> Coupon Management
     |
     +--> Table Reservations
     |
     +--> Gallery Management
     |
     +--> Enquiry Management
     |
     +--> Review Management
     |
     +--> Business Settings
```

## 📁 Project Structure

The project is organized into separate frontend and backend applications.

```text
restaurant-cafe-website/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

The folders above provide a high-level overview. Actual files may vary as the project evolves.

## ⚙️ Installation & Setup

### Prerequisites

- Node.js and npm
- Git
- MongoDB Atlas account or another configured MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/sandipmandalgithub/restaurant-cafe-website.git
cd restaurant-cafe-website
```

### 2. Configure the Backend

Open a terminal in the project root:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory with the required configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

Configure any additional environment variables required by the email service and other integrations used by your implementation.

Never commit actual credentials or secret values to GitHub.

### 3. Start the Backend

```bash
npm run dev
```

The backend is expected to run locally at:

`http://localhost:5000`

Use the actual port configured in your environment if it differs.

### 4. Configure and Start the Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local frontend URL, typically:

`http://localhost:5173`

Configure the frontend API URL using the environment variable expected by your existing frontend code.

### 5. Local URLs

- **Customer Website:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login
- **Backend:** http://localhost:5000

## 🔌 Backend API Modules

The backend is organized around REST API modules for the application's main features.

- **Admin API:** Admin authentication and protected operations
- **Customer Authentication API:** Customer registration, login, and authentication
- **Menu API:** Menu retrieval and menu management
- **Order API:** Order creation, retrieval, and status management
- **Customer Order History:** Customer-specific order retrieval
- **Coupon API:** Coupon management and coupon validation
- **Reservation API:** Table reservation requests and administration
- **Email Notifications:** Order confirmation and order status email handling
- **Gallery API:** Gallery content management
- **Enquiry API:** Customer enquiry handling
- **Review API:** Review submission and retrieval
- **Business Settings API:** Business information management

Actual endpoint URLs, HTTP methods, and authorization requirements are defined by the backend implementation.

## 🔐 Authentication & Security

The application uses JWT-based authentication for protected operations.

### Admin Authentication

```text
Admin Login
     |
     v
Backend Verifies Credentials
     |
     v
JWT Token Returned
     |
     v
Token Used for Protected Requests
```

### Customer Authentication

```text
Customer Registration / Login
            |
            v
Backend Validates Credentials
            |
            v
Password Stored as a Hash
            |
            v
JWT Authentication
            |
            v
Protected Customer Features
```

Security considerations:

- Hash passwords before storing them.
- Never expose JWT secrets or database credentials.
- Validate customer input on the backend.
- Protect customer-specific order information from unauthorized access.
- Enforce authorization for administrative operations.
- Configure CORS for the intended frontend origin.
- Use HTTPS in production.

## 🗄️ Database

CaféNest uses MongoDB with Mongoose for database operations.

The application's data includes records for relevant entities such as:

- Admin accounts
- Customer accounts
- Menu items
- Orders
- Coupons
- Table reservations
- Gallery items
- Customer enquiries
- Reviews
- Business settings

The actual collection and model names depend on the implemented backend schema.

## 🛒 Cart Storage

The frontend stores cart information in browser local storage using:

`cafeNestCart`

The application also uses the browser event:

`cafeNestCartUpdated`

to synchronize cart updates across relevant frontend components.

## 📧 Email Configuration

Email notifications require a configured email provider or SMTP service.

Before using the email functionality in production:

- Configure the email provider using environment variables.
- Keep credentials and API keys on the backend.
- Configure the sender address as required by the provider.
- Test order confirmation emails.
- Test order status update emails.
- Handle delivery failures appropriately.

The exact configuration depends on the email service used by the project.

## 🔒 Environment Variables & GitHub Security

Keep sensitive values in environment variables and ensure they are excluded by `.gitignore`.

Never commit:

- `.env` files containing secrets
- MongoDB connection strings
- JWT secrets
- Email-service credentials
- Database passwords
- Admin passwords
- Private API keys

Example environment values in documentation should always be placeholders, not real credentials.

## 🧪 Testing Checklist

Use this checklist to verify the application's current behavior before a release.

### Customer Testing

- [ ] Home, About, Menu, Gallery, Contact, and Location pages
- [ ] Menu filtering and availability
- [ ] Add, remove, and update cart quantities
- [ ] Customer registration and login
- [ ] Customer logout and protected account access
- [ ] Checkout and order placement
- [ ] Coupon validation and discount calculation
- [ ] Customer order history and order details
- [ ] Order tracking and status display
- [ ] Order confirmation email delivery
- [ ] Order status update email delivery
- [ ] Table reservation submission
- [ ] Reviews and enquiries
- [ ] WhatsApp and phone contact actions
- [ ] Responsive layouts

### Admin Testing

- [ ] Admin login and protected routes
- [ ] Dashboard information and charts
- [ ] Menu CRUD, search, filtering, and availability
- [ ] Order management and status updates
- [ ] Coupon creation, editing, deletion, and activation
- [ ] Reservation management and status updates
- [ ] Gallery management
- [ ] Enquiry management
- [ ] Review management
- [ ] Business settings
- [ ] Revenue and best-selling item information

### Security & Integration Testing

- [ ] Invalid login attempts
- [ ] Unauthorized access to protected APIs
- [ ] Customer access restricted to their own orders
- [ ] Invalid, inactive, and expired coupon codes
- [ ] Minimum order amount validation
- [ ] Email-service failure handling
- [ ] Production frontend-to-backend connectivity

## 📱 Responsive Design

The website is designed for mobile, tablet, laptop, and desktop screens.

Responsive design goals include:

- Mobile-friendly navigation
- Responsive cards and forms
- Responsive admin dashboard
- Usable tables on smaller screens
- Mobile-friendly checkout and order tracking
- No unnecessary horizontal overflow

## 💬 WhatsApp Integration

CaféNest provides WhatsApp contact functionality so customers can contact the restaurant about general enquiries, food, delivery, and customer support.

The configured business WhatsApp number can be managed through the supported Business Settings functionality.

This integration provides customer-initiated communication; automated WhatsApp order notifications are not included unless separately implemented.

## 📊 Dashboard Analytics

The admin dashboard presents business-related information, such as order summaries, order statuses, revenue information, and best-selling menu items.

The displayed figures depend on the available order data and the implemented analytics logic.

## 🚀 Deployment

The project uses a cloud deployment architecture.

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

### Production URLs

- **Customer Website:** https://restaurant-cafe-website-nine.vercel.app/
- **Admin Panel:** https://restaurant-cafe-website-nine.vercel.app/admin/login
- **Backend Base URL:** https://restaurant-cafe-backend.onrender.com

### Deployment Checklist

1. Configure production environment variables.
2. Configure the MongoDB Atlas connection.
3. Configure the production JWT secret.
4. Configure the frontend API URL.
5. Configure backend CORS for the deployed frontend.
6. Configure the email service and sender details.
7. Build and deploy the frontend.
8. Deploy the backend.
9. Verify API connectivity.
10. Test customer registration, login, and logout.
11. Test order placement and order history.
12. Test coupons and table reservations.
13. Verify email notifications.
14. Test admin operations and authorization.
15. Test the live website on different screen sizes.

## 🔄 Git & GitHub Workflow

Check the current repository state:

```bash
git status
```

Stage the intended changes, commit, and push:

```bash
git add README.md
git commit -m "Update CaféNest project documentation"
git push origin main
```

Repository:

https://github.com/sandipmandalgithub/restaurant-cafe-website

## 🔮 Future Improvements

Potential future enhancements include:

- Online payment gateway integration
- Cloud-based image storage
- Advanced inventory management
- Restaurant delivery management
- Multi-admin support and granular role permissions
- Progressive Web App (PWA) support
- Further SEO improvements
- Production monitoring and structured logging
- Additional analytics and business reports

## 🎯 Project Purpose

CaféNest was developed as a portfolio and freelancing demonstration project for restaurants, cafés, cloud kitchens, and food businesses.

The project demonstrates practical full-stack development concepts, including:

- React.js and responsive UI development
- REST API development with Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication and password hashing
- Customer account management
- Order processing and order history
- Coupon and discount logic
- Table reservation workflows
- Email notification integration
- Admin dashboard and CRUD operations
- Frontend and backend integration
- Git and GitHub
- Deployment and environment configuration

## 👨‍💻 Developer

**Sandip Mandal — Full-Stack Developer**

- **GitHub:** https://github.com/sandipmandalgithub
- **Portfolio:** https://sandipmandalgithub.github.io/sandip-portfolio/
- **LinkedIn:** https://www.linkedin.com/in/mrsandipmandal/

## 📄 License

This project was created for portfolio, learning, demonstration, and freelancing purposes. You may use it as a reference for learning full-stack web development, subject to the applicable rights of any third-party assets or dependencies.

---

CaféNest — A full-stack restaurant and café website.