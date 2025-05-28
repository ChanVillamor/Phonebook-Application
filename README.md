# Phonebook Application

A MERN stack phonebook management application for Design Analysis and Algorithm course.

## Quick Setup Guide

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/Phonebook.git

# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 2. Start the Application

```bash
# Start Backend (in server folder)
cd server
npm run dev

# Start Frontend (in client folder)
cd client
npm run dev
```

### 3. Access the Application

- Open http://localhost:5173 in your browser
- Make sure MongoDB is running on your machine


## Common Issues

1. If MongoDB connection fails:

   - Make sure MongoDB is installed and running OR use MongoDB Atlas.
   - Check your connection string

2. If modules are not found:
   - Delete node_modules folder
   - Run `npm install` again

3. If server error:
   - cd server -> run this: taskkill /PID 40252 /F
   - npm run dev

---

Created for Design Analysis and Algorithm Course
