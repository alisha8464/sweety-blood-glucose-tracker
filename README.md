Sweety -- Blood Glucose Tracker
A full-stack blood glucose tracking application built with React,
Node.js, Express, and PostgreSQL. Patients can create an account, log
in, record glucose readings, manage their readings, and view daily and
monthly reports.
Features
- Patient signup and login
- Password hashing with bcrypt
- JWT-based authentication
- Add, view, edit, and delete glucose readings
- Record readings by date and time slot
- Daily and monthly reports
- Previous-month report view
- Input validation for glucose readings
- Demo seed data
Tech Stack
Frontend: React, JavaScript, CSS, Axios, React Router
Backend: Node.js, Express.js
Database: PostgreSQL
Authentication: bcrypt, JSON Web Token (JWT)
Project Structure
BloodLine/
├── Backend/
│   ├── controller/
│   ├── db/
│   ├── middleware/
│   ├── model/
│   ├── routers/
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
Prerequisites
Install the following before running the project:
- Node.js and npm
- PostgreSQL
- Git
Database Setup
1. Start PostgreSQL.
2. Create a database named sweety.
3. Create the users and readings tables using the schema expected
   by the backend.
The tables should contain the following fields:
- users: id, name, email, password
- readings: id, user_id, reading_date, time_slot,
  glucose_value, and created_at
The readings table should reference users.id. The backend uses the
database connection values in the environment file.
Environment Variables
1. In the project root, make a copy of .env.example and name it
   .env.
2. Update the values to match your local PostgreSQL setup.
3. Keep .env private. Do not commit or share it.
Example:
PORT=7864
DB_USER=postgres
DB_HOST=localhost
DB_NAME=sweety
DB_PASSWORD=your_database_password
DB_PORT=5432
JWT_SECRET=your_secret_key
Installation and Running
1. Backend
Open a terminal:
cd Backend
npm install
node server.js
The backend runs on the port configured by PORT in your environment
file.
2. Frontend
Open a second terminal:
cd Frontend
npm install
npm run dev
Open the local URL printed by the frontend development server in your
browser.
Seed Demo Data
After configuring the database and backend environment, run:
cd Backend
node seed.js
Demo login:
- Email: demo@sweety.com
- Password: Demo@123
Run the seed script only after the database tables have been created.
Validation
The application validates glucose readings and accepts integer values
from 40 to 600 mg/dL. Readings are associated with the authenticated
patient.
Notes
- The .env.example file documents the environment variables required
  by the backend.
- Create your own .env file locally; never upload real passwords,
  database credentials, or JWT secrets.
- The dist/ directory contains generated/minified files and is
  excluded from Git.