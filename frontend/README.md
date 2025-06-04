
# NextJS Fitness App Documentation

## Overview
This is a NextJS-based fitness application designed for managing gym-related activities, including user roles (Admin, User, Client), supplement management, session registration, order processing, and water intake tracking. The app integrates with Stripe for payments and includes protected routes to ensure role-based access control.

## Prerequisites
- Node.js (v16 or higher)
- npm or Yarn
- Stripe account for payment processing
- MongoDB or another database (configured in `.env.local`)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
4. Open `http://localhost:3000` in your browser to view the app.

## Starting the Project
To start the project:
1. Ensure all dependencies are installed.
2. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
3. For production, build and start the app:
   ```bash
   npm run build
   npm run start
   ```
   or
   ```bash
   yarn build
   yarn start
   ```

## User Roles and Permissions
The app has three roles with specific permissions, and all routes are protected to ensure only authorized users can access specific pages.

### Admin
- **Register Clients and Trainers**: Admins can create and manage client and trainer accounts.
- **Supplement Management**: Create, edit, delete, and view supplements in the system.
- **Session Management**: Create, edit, delete, and view training sessions.
- **User Management**: Add, edit, delete, and view all users (Admins, Users, Clients).
- **Order Management**: View and manage all orders in the system.

### User
- **Cart Management**: Add supplements to the cart for purchase.
- **Order Processing**: Place orders and pay using Stripe.
- **Water Intake Tracking**: Log and track daily water intake.
- **Order Status and History**: View the status and history of orders.
- **Session Registration**: Register for available training sessions.

### Client
- Limited role with access to specific features (e.g., viewing assigned sessions or supplements, depending on implementation).

**Note**: All routes are protected using role-based access control. Users without the appropriate role cannot access restricted pages.

## Screenshots
Below are some screenshots showcasing key features of the app:

- **Dashboard**: Overview of user activity and admin controls.  
  *Add screenshot here: `screenshots/admin_dashboard.png`*
- **Orders Management**: Admin interface for managing orders.  
  *Add screenshot here: `screenshots/admin_allOrders.png`*
- **User Registration**: Admin interface for registering users.  
  *Add screenshot here: `screenshots/adminn_register.png`*
- **Cart and Checkout**: User interface for adding supplements to cart and paying via Stripe.  
  *Add screenshot here: `screenshots/client_cart.png`*
- **Session Registration**: Interface for users to register for sessions.  
  *Add screenshot here: `screenshots/client_sessionRegistration.png`*
- **Water Intake Tracker**: User interface for tracking water intake.  
  *Add screenshot here: `screenshots/client_waterIntaker.png`*

To add screenshots:
1. Create a `screenshots` folder in the project root.
2. Place the image files in the `screenshots` folder.
3. Update the paths in the README to reference the correct image files.

## Team Members
The following team members contributed to the development of this project:

- **Era Rushiti** - Full-stack, NextJS, NodeJS
- **Anita Buja** - Full-stack, NextJS, NodeJS
- **Aulona Uka** - Full-stack, NextJS, NodeJS
