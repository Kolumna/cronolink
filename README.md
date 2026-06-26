# CronoLink

CronoLink is a project management tool designed to help teams organize and track their work efficiently.

## Features
- User authentication and authorization
- Project creation and management

## Technologies Used
- Frontend: React, TypeScript, Tailwind CSS
- Backend: ASP.NET Core, Entity Framework Core
- Database: PostgreSQL
- Authentication: JWT

## API Endpoints
- `GET /api/projects`: Retrieve all projects
- `POST /api/projects`: Create a new project
- `GET /api/projects/{id}`: Retrieve a specific project by ID
- `PUT /api/projects/{id}`: Update a specific project by ID
- `DELETE /api/projects/{id}`: Delete a specific project by ID
- `GET /api/users`: Retrieve all users
- `POST /api/users`: Create a new user
- `GET /api/users/{id}`: Retrieve a specific user by ID
- `PUT /api/users/{id}`: Update a specific user by ID
- `DELETE /api/users/{id}`: Delete a specific user by ID
- `POST /api/auth/login`: Authenticate a user and return a JWT token
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/refresh`: Refresh the JWT token
- `POST /api/auth/logout`: Logout the user and invalidate the JWT token

## Docker
To run the application using Docker, use the following command:
```bash
docker-compose up --build
```
Application will be available at `http://localhost:5173`.

## Migration
To apply database migrations, use the following command:
```bash
dotnet ef migrations add NameOfMigration --project src/Cronolink.Infrastructure --startup-project src/Cronolink.API
```
Migrations will be applied to the database when the application starts.