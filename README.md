# Paper Management API

## Overview
This project is a simple RESTful API for managing research papers. It allows users to create, read, update, and delete (CRUD) papers stored in an SQLite database. The API is built using Node.js with Express.js and includes middleware for validation and error handling.

## Features
- **Create** new research papers
- **Retrieve** a list of research papers with filtering options
- **Retrieve** a single paper by its ID
- **Update** existing research papers
- **Delete** research papers
- **Middleware** for logging, validation, and error handling

## Project Structure
```
.
├── database.js      # SQLite database connection and operations
├── middleware.js    # Middleware functions for logging, validation, and error handling
├── routes.js        # Express routes for handling API requests
├── server.js        # Main entry point for starting the API server
├── package.json     # Project dependencies and scripts
└── README.md        # Documentation
```

## Installation
To set up and run the project, follow these steps:

1. **Clone the repository** (if applicable)
   ```sh
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Run the server**
   ```sh
   npm start
   ```

## API Endpoints
| Method | Endpoint            | Description                |
|--------|---------------------|----------------------------|
| GET    | `/api/papers`       | Retrieve all papers        |
| GET    | `/api/papers/:id`   | Retrieve a paper by ID     |
| POST   | `/api/papers`       | Create a new paper        |
| PUT    | `/api/papers/:id`   | Update an existing paper  |
| DELETE | `/api/papers/:id`   | Delete a paper            |

## Middleware
- **Request Logger**: Logs incoming API requests
- **Validation**: Ensures correct data format for paper entries
- **Error Handling**: Handles API errors and sends proper responses

## Database
The project uses SQLite for storing research papers. The database schema is as follows:
```sql
CREATE TABLE papers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  published_in TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year > 1900),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Notes
- Ensure `sqlite3` is installed and accessible before running the project.
- Modify `database.js` if using a different database or connection settings.

## License
This project is open-source and available under the MIT License.

