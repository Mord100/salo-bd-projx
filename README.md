# Blood Donor Management System

## Overview
The Blood Donor Management System is a web application designed to facilitate the management of blood donors and donations for the Malawi Blood Transfusion Service. The system allows for the registration of donors, tracking of donations, and communication with donors regarding their donation status and reminders.

## Features
- **Donor Management**: Register, update, and delete donor information.
- **Donation Tracking**: Record and manage blood donations, including details such as date, blood type, and quantity.
- **Communication**: Send SMS or email notifications to donors for reminders and updates.
- **Appointment Scheduling**: Manage appointments for blood donations.
- **Admin Dashboard**: View statistics and manage the overall system.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Environment Variables**: dotenv
- **Middleware**: Custom error handling and authentication middleware

## Installation
1. Clone the repository:
   ```bash
   git clone
   ```
2. Navigate to the project directory:
   ```bash
   cd donor-management-system
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- **Donors**
  - `POST /api/donors`: Create a new donor
  - `GET /api/donors`: Retrieve all donors
  - `GET /api/donors/:id`: Retrieve a specific donor by ID
  - `PUT /api/donors/:id`: Update a donor's information
  - `DELETE /api/donors/:id`: Delete a donor

- **Donations**
  - `POST /api/donations`: Record a new donation
  - `GET /api/donations`: Retrieve all donations
  - `GET /api/donations/:id`: Retrieve a specific donation by ID
  - `PUT /api/donations/:id`: Update a donation
  - `DELETE /api/donations/:id`: Delete a donation

- **Communications**
  - `POST /api/communications`: Create a new communication
  - `GET /api/communications`: Retrieve all communications
  - `GET /api/communications/donor/:donorId`: Retrieve communications for a specific donor
  - `GET /api/communications/:id`: Retrieve a specific communication by ID
  - `POST /api/communications/bulk-send`: Send bulk communications
  - `POST /api/communications/reminder/:donorId`: Send a donation reminder to a donor

- **Appointments**
  - `POST /api/appointments`: Schedule a new appointment
  - `GET /api/appointments`: Retrieve all appointments
  - `GET /api/appointments/:id`: Retrieve a specific appointment by ID
  - `PUT /api/appointments/:id`: Update an appointment
  - `DELETE /api/appointments/:id`: Cancel an appointment

- **Admin**
  - `POST /api/admin`: Create a new admin
  - `POST /api/admin/login`: Admin login
  - `GET /api/admin`: Retrieve all admins
  - `GET /api/admin/:id`: Retrieve a specific admin by ID
  - `PUT /api/admin/:id`: Update an admin's information
  - `DELETE /api/admin/:id`: Delete an admin

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.