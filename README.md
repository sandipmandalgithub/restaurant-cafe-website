# ☕ CaféNest - Full-Stack Restaurant & Café Website

CaféNest is a modern, responsive, full-stack restaurant and café website built with React.js, Node.js, Express.js, and MongoDB.

The project includes a customer-facing restaurant website and a secure admin panel for managing menu items, orders, gallery images, customer enquiries, reviews, and business settings.



## 🌐 Live Demo

> Live demo will be added after deployment.

**Customer Website:**
https://your-live-domain.com

**Admin Panel:**
https://your-live-domain.com/admin/login



## 📌 Project Overview

CaféNest is designed as a complete digital solution for restaurants, cafés, cloud kitchens, and food businesses.

Customers can browse the restaurant website, view the menu, add food items to a cart, place orders, track order status, submit enquiries, view the gallery, read reviews, and contact the business through WhatsApp or phone.

The admin can securely log in and manage the restaurant's menu, orders, gallery, enquiries, reviews, and business settings.


# ✨ Features

## 👤 Customer Features

### 🏠 Home

* Restaurant introduction
* Hero section
* Featured content
* Call-to-action sections
* Responsive design

### 📖 About

* Restaurant information
* Business introduction
* Brand information
* Responsive layout

### 🍽️ Menu

Customers can:

* Browse food items
* View food images
* View prices
* View descriptions
* Filter items by category
* Check item availability
* Add available items to cart

Example categories:

* Beverages
* Burgers
* Pizza
* Main Course
* Desserts
* Sides
* Sandwiches

### 🛒 Shopping Cart

Customers can:

* Add food items
* Increase quantity
* Decrease quantity
* Remove items
* View cart subtotal
* View total amount
* Continue shopping
* Proceed to checkout

Cart data is stored using browser local storage.

### 🧾 Checkout

Customers can provide their required information and place an order.

The checkout process connects with the backend order API and stores the order in MongoDB.

### 📦 Order Tracking

After placing an order, the customer receives an Order ID.

The customer can use the Order ID to check the current order status.

Order status flow:


Pending
   ↓
Confirmed
   ↓
Preparing
   ↓
Ready
   ↓
Completed


Orders can also be cancelled when applicable.

### 🖼️ Gallery

Customers can:

* View restaurant images
* Browse food images
* View interior images
* View kitchen and ingredient images
* Explore different gallery categories

### 📞 Contact & Enquiry

Customers can:

* Submit enquiries
* Provide name and contact information
* Send messages to the restaurant
* Contact the business through phone
* Contact the business through WhatsApp

Submitted enquiries are available in the admin panel.

### ⭐ Reviews & Testimonials

Customers can:

* View customer reviews
* View ratings
* Read testimonials
* Submit reviews through the review system

### 📍 Location

The website provides restaurant location information and contact information for customers.

### 📱 Responsive Design

The website is designed for:

* Small mobile phones
* Large mobile phones
* Tablets
* Laptops
* Desktop computers

Responsive layouts were tested for common screen sizes including:

* 320px
* 375px
* 768px
* 1024px
* Desktop screens

The website is designed to avoid unnecessary horizontal scrolling.



# 🔐 Admin Panel Features

The admin panel is protected using authentication.

## 🔑 Admin Login

Admin can log in using:

* Email
* Password

After successful authentication, an authentication token is stored in browser local storage.

Protected admin routes require valid authentication.



## 📊 Admin Dashboard

The dashboard provides an overview of the restaurant business.

It includes:

* Total menu items
* Total orders
* Pending orders
* Preparing orders
* Completed orders
* Revenue information
* Best-selling item information
* Business overview

Charts are used to visualize relevant order and revenue information.



## 🍽️ Admin Menu Management

Admin can:

* Add menu items
* Edit menu items
* Delete menu items
* Search menu items
* Filter by category
* Sort by price
* Change item availability
* Manage food image
* Manage item description
* Manage item price

Menu availability can be changed between:

* Available
* Out of Stock

Changes made by the admin are reflected on the customer-facing menu.



## 📦 Admin Order Management

Admin can view and manage customer orders.

Order information includes:

* Order ID
* Customer information
* Contact information
* Delivery address
* Ordered items
* Quantity
* Price
* Total amount
* Payment information
* Order status
* Order date

Admin can update order status.

Available order statuses include:


Pending
Confirmed
Preparing
Ready
Completed
Cancelled


Order status changes are reflected in the customer order tracking page.



## 🖼️ Admin Gallery Management

Admin can manage restaurant gallery content.

Admin can:

* Add gallery images
* Edit gallery items
* Delete gallery items
* Set image title
* Set image category
* Manage image URLs

Example categories:

* Interior
* Food
* Kitchen
* Ambience



## 📩 Admin Enquiry Management

Admin can view customer enquiries submitted through the public Contact page.

Admin can view:

* Customer name
* Email
* Phone
* Message
* Enquiry date
* Enquiry status

This allows the restaurant to manage customer communication from the admin panel.



## ⭐ Admin Reviews

The review system allows the business to manage customer feedback.

The system can store:

* Customer name
* Rating
* Review message
* Review information

Reviews can be displayed on the customer-facing website.



## ⚙️ Business Settings

Admin can manage important business information from the admin panel.

Settings include:

* Business name
* Phone number
* Email address
* Business address
* Opening time
* Closing time
* Delivery charge
* Delivery availability
* Pickup availability
* WhatsApp number
* Facebook URL
* Instagram URL
* YouTube URL
* Business description

This allows the business information to be managed without changing frontend source code.



# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript
* JSX
* React Router
* Tailwind CSS
* CSS
* Vite

## Backend

* Node.js
* Express.js
* REST API
* JWT Authentication

## Database

* MongoDB
* MongoDB Atlas
* Mongoose

## Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* npm



# 🏗️ Application Architecture

The project follows a full-stack architecture.


Customer
   |
   v
React Frontend
   |
   v
REST API
   |
   v
Node.js + Express.js
   |
   v
MongoDB Atlas


Admin architecture:


Admin
   |
   v
Admin Login
   |
   v
JWT Authentication
   |
   v
Protected Admin Routes
   |
   v
Express REST API
   |
   v
MongoDB Atlas




# 🔄 Customer Flow

The main customer flow is:


Home
  ↓
Menu
  ↓
Select Food
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Place Order
  ↓
Order ID
  ↓
Track Order
  ↓
Order Status



# 🔄 Admin Flow

The main admin flow is:


Admin Login
     ↓
Admin Dashboard
     ↓
Manage Menu
     ↓
Manage Orders
     ↓
Manage Gallery
     ↓
Manage Enquiries
     ↓
Manage Reviews
     ↓
Business Settings




# 📁 Project Structure


restaurant-cafe-website/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── businessSettingsController.js
│   │   ├── enquiryController.js
│   │   ├── galleryController.js
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── reviewController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Admin.js
│   │   ├── BusinessSettings.js
│   │   ├── Enquiry.js
│   │   ├── Gallery.js
│   │   ├── Menu.js
│   │   ├── Order.js
│   │   └── Review.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── businessSettingsRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── galleryRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   │
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── admin/
│   │   │       └── AdminProtectedRoute.jsx
│   │   │
│   │   ├── data/
│   │   │   └── menuData.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AdminLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Location.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── Reviews.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminBusinessSettings.jsx
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminEnquiries.jsx
│   │   │       ├── AdminGallery.jsx
│   │   │       ├── AdminLogin.jsx
│   │   │       ├── AdminMenu.jsx
│   │   │       └── AdminOrders.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── adminAuthService.js
│   │   │   ├── adminDashboardService.js
│   │   │   ├── enquiryService.js
│   │   │   ├── galleryService.js
│   │   │   ├── menuService.js
│   │   │   └── reviewService.js
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md




# ⚙️ Installation & Setup

## 1. Clone the Repository


git clone https://github.com/sandipmandalgithub/restaurant-cafe-website.git


Move into the project directory:


cd restaurant-cafe-website




# 🔧 Backend Setup

Move into the backend folder:


cd backend


Install dependencies:


npm install


Create a `.env` file inside the `backend` folder.


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


Replace the values with your own credentials.

Start the backend:


npm run dev


The backend will run on:


http://localhost:5000




# 💻 Frontend Setup

Open another terminal.

Move into the frontend folder:


cd frontend


Install dependencies:


npm install


Start the frontend development server:


npm run dev


The frontend will normally run on:


http://localhost:5173




# 🌐 Local URLs

## Customer Website


http://localhost:5173


## Admin Login


http://localhost:5173/admin/login


## Backend API


http://localhost:5000




# 🔌 API Modules

The backend provides REST API modules for different application features.

## Admin API

Used for:

* Admin login
* Admin authentication
* Protected admin operations

## Menu API

Used for:

* Create menu items
* Read menu items
* Update menu items
* Delete menu items
* Manage availability
* Search and filter menu data

## Order API

Used for:

* Create customer orders
* Get orders
* Get order by ID
* Update order status
* Delete orders

## Gallery API

Used for:

* Create gallery items
* Read gallery items
* Update gallery items
* Delete gallery items

## Enquiry API

Used for:

* Submit customer enquiries
* Read enquiries
* Update enquiry information
* Delete enquiries

## Review API

Used for:

* Submit reviews
* Retrieve reviews
* Manage review information

## Business Settings API

Used for:

* Retrieve business information
* Update restaurant settings
* Manage contact details
* Manage delivery and pickup settings
* Manage social media links



# 🔐 Authentication

The admin panel uses JWT-based authentication.

Authentication flow:


Admin Login
     ↓
Backend verifies credentials
     ↓
JWT Token Generated
     ↓
Token returned to frontend
     ↓
Token stored in localStorage
     ↓
Protected API requests


The frontend stores the authentication token using:


adminToken


Protected routes require a valid authentication token.



# 🗄️ Database

The project uses MongoDB Atlas as the cloud database.

Main MongoDB collections/models include:


Admin
BusinessSettings
Enquiry
Gallery
Menu
Order
Review


MongoDB is connected through Mongoose.



# 🛒 Cart Storage

Customer cart data is stored in browser local storage.

The cart uses:


cafeNestCart


The frontend also uses a custom browser event to synchronize cart updates across relevant components:


cafeNestCartUpdated




# 🔒 Environment Variables

Sensitive information should never be committed to GitHub.

Backend `.env` example:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


The `.env` file is ignored using `.gitignore`.

Never upload:

* MongoDB connection strings
* JWT secrets
* Database passwords
* Private API keys
* Admin passwords
* Other sensitive credentials



# 🧪 Testing

The following major application flows were tested during development.

## Customer Testing

* Home page
* About page
* Menu page
* Category filtering
* Menu availability
* Add to cart
* Increase quantity
* Decrease quantity
* Remove item
* Checkout
* Place order
* Order ID generation
* Order tracking
* Contact form
* Gallery
* Reviews
* Location
* WhatsApp/contact actions
* Responsive layouts

## Admin Testing

* Admin login
* Dashboard
* Menu management
* Menu search
* Menu category filtering
* Menu price sorting
* Menu availability
* Gallery management
* Enquiry management
* Order management
* Order status updates
* Business settings
* Revenue information
* Best-selling information



# 📱 Responsive Design

The website is designed with responsive layouts for different devices.

Supported screen sizes include:


320px   → Small Mobile
375px   → Mobile
768px   → Tablet
1024px  → Laptop
Desktop → Large Screens


The main responsive goals are:

* No unnecessary horizontal overflow
* Mobile-friendly navigation
* Responsive cards
* Responsive admin dashboard
* Responsive forms
* Responsive tables
* Responsive buttons
* Mobile-friendly checkout
* Mobile-friendly order tracking



# 🖥️ Admin & Customer Architecture

The application separates the customer-facing website and admin panel.


                    CaféNest
                       |
          +------------+------------+
          |                         |
          v                         v
     Customer Site              Admin Panel
          |                         |
          v                         v
     React Pages              Admin Login
          |                         |
          v                         v
      Menu / Cart              Dashboard
      Checkout                 Menu
      Orders                   Orders
      Gallery                  Gallery
      Contact                  Enquiries
      Reviews                  Reviews
      Location                 Settings
          |                         |
          +------------+------------+
                       |
                       v
                Express REST API
                       |
                       v
                  MongoDB Atlas




# 📈 Business Workflow

The application supports the following business workflow:


Customer visits website
        ↓
Browses menu
        ↓
Selects food
        ↓
Adds food to cart
        ↓
Checkout
        ↓
Places order
        ↓
Order saved in MongoDB
        ↓
Admin receives order
        ↓
Admin updates order status
        ↓
Customer tracks order




# 💬 WhatsApp Integration

The website provides WhatsApp contact functionality so customers can quickly contact the restaurant.

This can be useful for:

* General enquiries
* Food enquiries
* Delivery questions
* Quick communication
* Customer support

The WhatsApp number can be managed through Business Settings.



# 📊 Dashboard Analytics

The admin dashboard provides business-related information such as:

* Total orders
* Pending orders
* Preparing orders
* Completed orders
* Revenue information
* Best-selling menu items

Charts and summary cards are used to make the information easier to understand.



# 🚀 Deployment

The project can be deployed using modern cloud hosting platforms.

Possible deployment architecture:


Frontend
   ↓
Frontend Hosting Platform
   ↓
React/Vite Application


Backend
   ↓
Backend Hosting Platform
   ↓
Node.js + Express API


Database
   ↓
MongoDB Atlas


Before deployment:

1. Configure production MongoDB connection.
2. Configure production JWT secret.
3. Configure backend environment variables.
4. Configure frontend API URL.
5. Configure backend CORS.
6. Build the React frontend.
7. Deploy the frontend.
8. Deploy the backend.
9. Test all API endpoints.
10. Test customer order flow.
11. Test admin login.
12. Test admin order management.
13. Test order tracking.
14. Test responsive design on the live website.

After deployment, replace the placeholder URLs in this README with the actual live URLs.



# 🔄 Git & GitHub Workflow

The project is maintained using Git and GitHub.

Typical workflow:


git status


Add changes:


git add .


Commit changes:


git commit -m "Update project"


Push changes:


git push origin main


Repository:

https://github.com/sandipmandalgithub/restaurant-cafe-website



# 🧹 GitHub Security

The following files and information should not be committed:

.env
.env.local
node_modules/
dist/
build/


Sensitive credentials should always remain in environment variables.



# 🔮 Future Improvements

Possible future improvements include:

* Customer registration and login
* Customer order history
* Online payment integration
* Razorpay/Stripe integration
* Email order notifications
* SMS notifications
* Real-time order tracking
* Cloud image storage
* Advanced sales analytics
* Coupon and discount system
* Table reservation
* Restaurant delivery management
* Multi-admin support
* Role-based admin permissions
* Inventory management
* Advanced search
* PWA support
* SEO improvements
* Production monitoring



# 🎯 Project Purpose

This project was developed as a portfolio and freelancing demonstration project for restaurant, café, cloud kitchen, and food-business clients.

It demonstrates practical full-stack development skills including:

* React.js
* JavaScript
* Responsive UI development
* React Router
* Tailwind CSS
* Node.js
* Express.js
* REST API development
* MongoDB
* Mongoose
* JWT authentication
* CRUD operations
* Admin dashboard development
* Order management
* Form handling
* Local storage
* Git
* GitHub
* API integration
* Responsive web design



# 👨‍💻 Developer

## Sandip Mandal

Full-Stack Developer

### GitHub

https://github.com/sandipmandalgithub

### Portfolio

https://sandipmandalgithub.github.io/sandip-portfolio/

### LinkedIn

https://www.linkedin.com/in/mrsandipmandal/



# 📄 License

This project is created for portfolio, learning, demonstration, and freelancing purposes.

You may use this project as a reference for learning full-stack web development.



# ⭐ Acknowledgement

CaféNest demonstrates how a modern restaurant website can combine:

* Customer-facing UI
* Food menu management
* Shopping cart
* Checkout
* Order management
* Order tracking
* Gallery management
* Customer enquiries
* Reviews
* Business settings
* Admin dashboard
* MongoDB database
* REST APIs
* JWT authentication
* Responsive design

The project is continuously improved as part of the developer's full-stack development and freelancing portfolio.
