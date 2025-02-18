# API Server with Authentication and User Management

A TypeScript-based Express.js server with user authentication, role-based access control, and company management features.

## Table of Contents
- [Setup](#setup)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env` file:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000 (optional)
```

3. Run database migrations:
```bash
npm run db:generate
npm run db:push
```

4. Start the development server:
```bash
npm run start
```

## Database

The application uses PostgreSQL with Drizzle ORM. The database schema includes:

- Users
- Roles
- Permissions
- Companies
- Role Permissions (junction table)

## API Endpoints

### Health Checks

#### GET `/health`
Simple health check endpoint.

**Response**: 
```json
{
    "status": "healthy"
}
```

#### GET `/db/health`
Database connection health check.

**Response**: 
```json
{
    "status": "healthy"
}
```

### Authentication & User Management

#### POST `/api/register-super-admin`
Register a new super admin user with their company.

**Request Body**:
```json
{
    "fullname": "string",
    "companyName": "string",
    "email": "string",
    "password": "string"
}
```

**Response**: 
```json
{
    "message": "Super Admin registered successfully"
}
```

#### POST `/api/users`
Add a new user to the system.

**Request Body**:
```json
{
    "fullname": "string",
    "email": "string",
    "roleId": "uuid",
    "password": "string"
}
```

**Response**:
```json
{
    "message": "User added successfully"
}
```

#### POST `/api/login`
Authenticate a user and receive a JWT token.

**Request Body**:
```json
{
    "email": "string",
    "password": "string"
}
```

**Response**:
```json
{
    "token": "jwt_token_string"
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
    "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 500: Internal Server Error

## Development Scripts

```bash
npm run start      # Start development server with nodemon
npm run tsc        # Compile TypeScript
npm run run        # Compile and start server
npm run db:generate # Generate database migrations
npm run db:push    # Push migrations to database
npm run db:pull    # Pull database schema
npm run db:check   # Check database schema
npm run db:up      # Update database schema
```

## Dependencies

The project uses several key dependencies:
- Express.js for the web server
- Drizzle ORM for database operations
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- helmet for security headers
- cors for Cross-Origin Resource Sharing
- morgan for HTTP request logging

For a complete list of dependencies, refer to the package.json file.
