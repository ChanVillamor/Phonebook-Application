# Phonebook Application

A full-stack contact management system built with React, Node.js, and MongoDB.

## Features

- Contact management (Create, Read, Update, Delete)
- Contact categorization (Family, Work, Friend, Hotline)
- Favorite contacts
- Image upload for contacts
- Search functionality
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/phonebook.git
cd phonebook
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/phonebook
PORT=5000" > .env

# Start the server
npm start
```

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start the development server
npm run dev
```

### 4. Database Setup

1. Install MongoDB on your system if not already installed
2. Start MongoDB service
3. Create a new database named "phonebook"

## Project Structure

```
phonebook/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── config/       # Configuration files
│   │   ├── utils/        # Utility functions
│   │   └── assets/       # Static assets
│   └── public/           # Public static files
│
├── server/                # Backend Node.js application
│   ├── routes/           # API route handlers
│   ├── models/           # Database models
│   ├── uploads/          # File upload directory
│   └── server.js         # Main server file
│
└── docs/                 # Documentation
```

## API Endpoints

### Contacts

- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create a new contact
- `PATCH /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact
- `PATCH /api/contacts/:id/favorite` - Toggle favorite status

## Environment Variables

### Backend (.env)

```
MONGODB_URI=mongodb://localhost:27017/phonebook
PORT=5000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000
```

## Running the Application

1. Start MongoDB service
2. Start the backend server:
   ```bash
   cd server
   npm start
   ```
3. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Development

### Backend Development

```bash
cd server
npm run dev
```

### Frontend Development

```bash
cd client
npm run dev
```

## Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



