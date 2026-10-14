# ☕ CaféNest — Full-Stack Restaurant & Café Website

CaféNest is a modern, responsive, full-stack restaurant and café website built with React.js, Node.js, Express.js, and MongoDB.

The platform provides a customer-facing restaurant website and an admin panel for managing menu items, orders, customers, coupons, table reservations, gallery images, enquiries, reviews, and business settings.

## 🌐 Live Demo

- **Customer Website:** https://restaurant-cafe-website-nine.vercel.app/
- **Admin Login:** https://restaurant-cafe-website-nine.vercel.app/admin/login
- **GitHub Repository:** https://github.com/sandipmandalgithub/restaurant-cafe-website

## 📌 Project Overview

CaféNest is designed as a digital solution for restaurants, cafés, cloud kitchens, and food businesses.

Customers can explore the menu, register for an account, log in, add food items to their cart, apply coupons, place orders, view order history, track order status, receive email notifications, reserve tables, submit enquiries, and contact the restaurant.

Administrators can manage the restaurant's menu, orders, coupons, reservations, gallery, enquiries, reviews, and business settings through the admin panel.

## ✨ Features

### 👤 Customer Features

#### 🏠 Home, About & Location

- Restaurant introduction and featured content
- Business information and brand details
- Restaurant location and contact information
- Responsive page layouts

#### 🍽️ Menu

- Browse food items with images, descriptions, and prices
- Filter menu items by category
- Check food availability
- Add available items to the shopping cart

#### 🛒 Shopping Cart

- Add and remove food items
- Increase or decrease item quantities
- View cart subtotal and total amount
- Store cart data in browser local storage
- Continue shopping or proceed to checkout

#### 🧾 Checkout & Orders

- Enter customer and order information
- Apply valid coupon codes
- Calculate eligible discounts
- Validate invalid or expired coupons
- Place orders through the backend API
- Store order information in MongoDB
- Receive an order ID after successful order placement

#### 🔐 Customer Registration & Authentication

- Customer registration
- Customer login and logout
- JWT-based authentication
- Password hashing
- Protected customer account functionality
- Authenticated access to customer order information

#### 📦 Customer Order History

- View previous orders in **My Orders**
- View individual order details
- Check order status
- Access order history associated with the customer account

#### 📍 Order Tracking

- Track orders using the available order-tracking functionality
- View the current order status
- Follow order progress through supported statuses

Order statuses include:

- Pending
- Confirmed
- Preparing
- Ready
- Completed
- Cancelled

#### 📧 Email Notifications

- Order confirmation email
- Email notification when the order status is updated

Email notifications help keep customers informed about their orders.

#### 🎟️ Coupon & Discount System

- Apply coupon codes during checkout
- Support percentage-based discounts
- Support fixed-amount discounts
- Validate minimum order amounts
- Check coupon expiry dates
- Validate active and inactive coupon status
- Calculate applicable discounts
- Display validation messages for invalid or expired coupons

#### 🪑 Table Reservation System

- Submit a table reservation request
- Select reservation date and time
- Specify the number of guests
- Provide customer contact information
- Receive reservation confirmation through the implemented reservation flow
- Check reservation status where supported

Reservation statuses include:

- Pending
- Confirmed
- Cancelled
- Completed

#### 🖼️ Gallery

- Browse restaurant and food images
- Explore interior, kitchen, and ambience images
- View gallery content by category

#### 📞 Contact & Enquiries

- Submit customer enquiries
- Provide contact information and messages
- Access restaurant phone contact options
- Contact the restaurant through WhatsApp
- Manage submitted enquiries through the admin panel

#### ⭐ Reviews & Testimonials

- View customer reviews and ratings
- Read testimonials
- Submit reviews through the review system

#### 📱 Responsive Design

Designed for mobile phones, tablets, laptops, and desktop computers.

Responsive design targets include:

- 320px — Small mobile
- 375px — Mobile
- 768px — Tablet
- 1024px — Laptop
- Desktop — Large screens

The layout aims to provide a consistent experience without unnecessary horizontal scrolling.

### 🔐 Admin Panel Features

#### 🔑 Admin Authentication

- Admin login using email and password
- JWT-based authentication
- Protected admin routes
- Authentication token management through browser local storage

#### 📊 Admin Dashboard

- Total menu items
- Total orders
- Pending, preparing, and completed order counts
- Revenue information
- Best-selling menu item information
- Business overview and dashboard charts

#### 🍽️ Menu Management

- Create, edit, and delete menu items
- Search and filter menu items
- Sort items by price
- Manage food images, descriptions, prices, and categories
- Change menu item availability
- Mark items as Available or Out of Stock

Menu changes are reflected on the customer-facing website through the application's data flow.

#### 📦 Order Management

- View customer orders and order details
- Access customer and delivery information
- Review ordered items, quantities, and total amounts
- Update order status
- Manage supported order status transitions
- Support applicable order cancellation workflows

#### 🎟️ Coupon Management

- Create coupons
- Edit existing coupons
- Delete coupons
- Configure coupon codes
- Set percentage-based or fixed-amount discounts
- Configure minimum order amounts
- Set coupon expiry dates
- Activate or deactivate coupons
- Apply validation rules to customer checkout

#### 🪑 Table Reservation Management

- View customer reservation requests
- Review reservation dates and times
- View guest counts and customer information
- Manage reservation statuses
- Confirm or cancel reservations
- Mark reservations as completed

#### 🖼️ Gallery Management

- Add gallery items
- Edit and delete gallery items
- Manage image URLs, titles, and categories

#### 📩 Enquiry Management

- View submitted customer enquiries
- Review customer contact details and messages
- Manage enquiry information and status where supported

#### ⭐ Reviews Management

- Manage customer review information
- Work with review ratings and messages
- Display supported reviews on the customer-facing website

#### ⚙️ Business Settings

Manage supported restaurant information, including:

- Business name and description
- Phone number and email address
- Business address
- Opening and closing times
- Delivery charge
- Delivery and pickup availability
- WhatsApp number
- Social media links

These settings allow supported business information to be updated through the admin panel.

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
Customer Website / Admin Panel
              |
              v
       React Frontend
              |
              v
        REST API Calls
              |
              v
      Node.js + Express
              |
              v
          Mongoose
              |
              v
        MongoDB Atlas
```

Authentication protects the supported customer and administrator functionality. The backend handles application operations, data validation, and database interactions.

## 🔄 Customer Workflow

```text
Visit Website
      |
      v
Browse Menu
      |
      v
Add Items to Cart
      |
      v
Proceed to Checkout
      |
      v
Apply Coupon (Optional)
      |
      v
Place Order
      |
      v
Receive Order ID
      |
      v
View My Orders / Track Order
      |
      v
Receive Email Notifications
```

For table reservations:

```text
Open Reservation Form
          |
          v
Enter Date, Time and Guest Count
          |
          v
Submit Reservation
          |
          v
Reservation Management
          |
          v
Check Reservation Status
```

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
     +--> Reservation Management
     |
     +--> Gallery Management
     |
     +--> Enquiry Management
     |
     +--> Reviews Management
     |
     +--> Business Settings
```

## 📁 Project Structure

The following is a simplified overview of the project structure. Some files and directories may differ from this outline.

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

## ⚙️ Installation & Setup

### Prerequisites

- Node.js and npm
- Git
- A MongoDB Atlas database or another supported MongoDB instance

### 1. Clone the Repository

```bash
git clone https://github.com/sandipmandalgithub/restaurant-cafe-website.git
cd restaurant-cafe-website
```

### 2. Backend Setup

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Replace the example values with your own configuration. Set any additional environment variables required by your email notification implementation.

Start the backend:

```bash
npm run dev
```

The backend is expected to run locally at:

`http://localhost:5000`

### 3. Frontend Setup

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal, typically:

`http://localhost:5173`

Configure the frontend's backend API URL according to the existing application configuration.

### 4. Local URLs

| Service | Local URL |
|---|---|
| Customer Website | http://localhost:5173 |
| Admin Login | http://localhost:5173/admin/login |
| Backend API | http://localhost:5000 |

## 🔌 API Modules

The backend exposes REST API modules for the application's supported features.

- **Authentication API:** Admin and customer authentication operations supported by the backend
- **Customer API:** Customer account operations, where implemented
- **Menu API:** Menu retrieval and administration
- **Order API:** Order creation, retrieval, tracking, and status management
- **Coupon API:** Coupon validation and administration
- **Reservation API:** Reservation submission and administration
- **Gallery API:** Gallery content management
- **Enquiry API:** Customer enquiry operations
- **Review API:** Review retrieval and management
- **Business Settings API:** Restaurant business information management

Actual endpoint paths and HTTP methods are defined in the backend route files.

## 🔐 Authentication & Security

The application uses JWT-based authentication for supported protected operations.

The authentication workflow includes:

1. The user submits login credentials.
2. The backend validates the credentials.
3. The backend generates an authentication token after successful authentication.
4. The frontend stores the token according to the application's authentication flow.
5. Protected routes and API requests use authentication checks.

Security considerations:

- Hash passwords rather than storing them as plain text.
- Keep JWT secrets in environment variables.
- Protect private API operations on the backend.
- Validate customer input and coupon eligibility on the server.
- Never commit database credentials, admin passwords, or private API keys to GitHub.

## 🗄️ Database

CaféNest uses MongoDB with Mongoose for data modelling and database operations.

The application's data includes supported entities for:

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

The actual models and collection names depend on the implemented backend schema.

## 🛒 Cart Storage

The customer cart uses browser local storage.

- **Storage key:** `cafeNestCart`
- **Browser event:** `cafeNestCartUpdated`

The custom event helps relevant frontend components synchronize cart updates.

## 📧 Email Notification Configuration

Email notifications support order confirmation and order status updates.

Email delivery requires the email service and credentials configured by the application. Configure any required email environment variables using the names expected by the backend implementation.

Keep email credentials and other secrets private. Never commit production credentials to the repository.

## 🔒 Environment Variables & GitHub Security

Keep environment files and generated files out of version control where appropriate.

Common examples include:

```text
.env
.env.local
node_modules/
dist/
build/
```

Never commit:

- MongoDB connection strings
- JWT secrets
- Email service credentials
- Database passwords
- Admin passwords
- Private API keys

Use `.gitignore` and environment variables to protect sensitive configuration.

## 🧪 Testing Checklist

Use the following checklist to verify the application during development and before releases.

### Customer Testing

- [ ] Home, About, Menu, Gallery, Contact, and Location pages
- [ ] Menu category filtering and availability
- [ ] Cart quantity updates and item removal
- [ ] Customer registration, login, and logout
- [ ] Protected customer account access
- [ ] Checkout and order placement
- [ ] Coupon validation and discount calculations
- [ ] My Orders and order details
- [ ] Order tracking and supported status changes
- [ ] Order confirmation email
- [ ] Order status update email
- [ ] Table reservation submission
- [ ] Reservation confirmation and status display
- [ ] Reviews and enquiries
- [ ] WhatsApp and phone contact actions
- [ ] Responsive layouts

### Admin Testing

- [ ] Admin login and protected routes
- [ ] Dashboard summary information and charts
- [ ] Menu CRUD, search, filtering, sorting, and availability
- [ ] Order management and status updates
- [ ] Coupon creation, editing, deletion, and activation
- [ ] Reservation management and status changes
- [ ] Gallery management
- [ ] Enquiry management
- [ ] Review management
- [ ] Business settings
- [ ] Email delivery for applicable order events

## 📱 Responsive Design

The interface is designed for multiple screen sizes, including mobile phones, tablets, laptops, and desktop computers.

Responsive design goals include:

- Mobile-friendly navigation
- Responsive content cards
- Usable forms and buttons
- Responsive admin dashboard layouts
- Usable order and reservation workflows
- Avoidance of unnecessary horizontal overflow

## 🚀 Deployment

CaféNest uses a cloud-hosted frontend, backend, and database architecture.

- **Frontend hosting:** Vercel
- **Backend hosting:** Render
- **Database:** MongoDB Atlas

### Production URLs

- **Customer Website:** https://restaurant-cafe-website-nine.vercel.app/
- **Admin Login:** https://restaurant-cafe-website-nine.vercel.app/admin/login

Before deploying changes, verify the production API configuration, environment variables, CORS settings, database connectivity, authentication, email configuration, and customer/admin workflows.

After deployment, test the live website, customer registration, order placement, coupons, reservations, email notifications, and relevant admin operations.

## 🔄 Git & GitHub Workflow

Check the current changes:

```bash
git status
```

Stage the README update:

```bash
git add README.md
```

Commit the changes:

```bash
git commit -m "Update CaféNest project documentation"
```

Push to GitHub:

```bash
git push origin main
```

Repository: https://github.com/sandipmandalgithub/restaurant-cafe-website

## 🔮 Future Improvements

Potential future enhancements include:

- Online payment integration
- Razorpay or Stripe integration
- Automated SMS notifications
- Cloud-based image storage
- Advanced sales analytics and reporting
- Multi-admin support
- More granular role-based permissions
- Inventory management
- Progressive Web App (PWA) support
- SEO improvements
- Production monitoring and logging

## 🎯 Project Purpose

CaféNest was developed as a portfolio and freelancing demonstration project for restaurants, cafés, cloud kitchens, and food businesses.

The project demonstrates practical full-stack development skills, including:

- React.js and responsive UI development
- JavaScript and React Router
- Tailwind CSS
- Node.js and Express.js
- REST API development and integration
- MongoDB and Mongoose
- JWT authentication and password hashing
- CRUD operations
- Customer accounts and order history
- Coupon validation and discount calculations
- Table reservation workflows
- Email notification integration
- Admin dashboard development
- Local storage
- Git and GitHub
- Full-stack application deployment

## 👨‍💻 Developer

**Sandip Mandal — Full-Stack Developer**

- **GitHub:** https://github.com/sandipmandalgithub
- **Portfolio:** https://sandipmandalgithub.github.io/sandip-portfolio/
- **LinkedIn:** https://www.linkedin.com/in/mrsandipmandal/

## 📄 License

This project was created for portfolio, learning, demonstration, and freelancing purposes. Contact the developer for permission before redistributing it as a separate commercial product.

## ⭐ Acknowledgement

CaféNest brings together restaurant browsing, customer accounts, cart and checkout, coupon discounts, order history, email notifications, table reservations, admin management, and business settings in a full-stack web application.

The project demonstrates the practical application of modern web technologies to common restaurant business workflows.