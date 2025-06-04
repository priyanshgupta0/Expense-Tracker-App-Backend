# Monthly Expense Tracker App

A Splitwise-like expense tracking application built with Node.js, Express, and MongoDB. This application helps users manage shared expenses within groups, calculate balances, and settle payments.

## Features

- User authentication with JWT
- Create and manage expense groups
- Add and manage expenses within groups
- Automatic split calculations
- Balance sheet generation
- Settlement suggestions

## Tech Stack

- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT + bcrypt
- Dependencies: cors, dotenv

## Project Structure

```
expense-tracker-backend/
├── controllers/      # Route controllers
├── models/          # Database models
├── routes/          # API routes
├── middlewares/     # Custom middlewares
├── utils/           # Utility functions
├── config/          # Configuration files
├── app.js          # Express app setup
└── server.js       # Server entry point
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Groups
- POST /api/groups - Create new group
- GET /api/groups - Get user's groups
- GET /api/groups/:id - Get group details
- POST /api/groups/:id/members - Add member to group

### Expenses
- POST /api/expenses - Create new expense
- GET /api/expenses/group/:groupId - Get group expenses
- GET /api/expenses/group/:groupId/balances - Get group balances

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run tests using Jest:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT