# Student CRUD REST API

REST API for managing Student records, built with **Node.js, Express and SQLite**. Tested with **Postman**.

## Setup
1. Install Node.js (v18 or newer): https://nodejs.org
2. Open a terminal in this folder and run:
```
npm install
npm start
```
Server runs at `http://localhost:3000`. The database file `students.db` is created automatically.

## Database Schema (table: students)
| Column     | Type    | Constraint                  |
|------------|---------|-----------------------------|
| id         | INTEGER | PRIMARY KEY AUTOINCREMENT   |
| name       | TEXT    | NOT NULL                    |
| rollNo     | TEXT    | NOT NULL, UNIQUE            |
| department | TEXT    | NOT NULL                    |
| semester   | INTEGER | NOT NULL (1 to 8)           |

## Endpoints
| Method | URL                  | Description          | Success | Errors        |
|--------|----------------------|----------------------|---------|---------------|
| POST   | /api/students        | Create student       | 201     | 400, 409      |
| GET    | /api/students        | Get all students     | 200     |               |
| GET    | /api/students/:id    | Get one student      | 200     | 404           |
| PUT    | /api/students/:id    | Update student       | 200     | 400, 404, 409 |
| DELETE | /api/students/:id    | Delete student       | 200     | 404           |

Request body (POST / PUT):
```json
{ "name": "Ali Ahmed", "rollNo": "K26SW001", "department": "Software Engineering", "semester": 1 }
```

## Postman Test Cases
| # | Test Case | Method & URL | Body | Expected Status | Expected Result |
|---|-----------|--------------|------|-----------------|-----------------|
| 1 | Add valid record | POST /api/students | valid JSON | 201 | Record created, returned with id |
| 2 | Get all records | GET /api/students | none | 200 | JSON array |
| 3 | Get single record | GET /api/students/1 | none | 200 | Student with id 1 |
| 4 | Update record | PUT /api/students/1 | semester: 2 | 200 | Updated record returned |
| 5 | Missing required fields | POST /api/students | `{"name":"X"}` | 400 | Error message |
| 6 | Invalid semester | POST /api/students | semester: 20 | 400 | Error message |
| 7 | Duplicate rollNo | POST /api/students | same rollNo again | 409 | "rollNo already exists" |
| 8 | Nonexistent ID | GET /api/students/999 | none | 404 | "Student not found" |
| 9 | Update nonexistent ID | PUT /api/students/999 | valid JSON | 404 | "Student not found" |
| 10 | Delete record | DELETE /api/students/1 | none | 200 | Success message |
| 11 | Get deleted record | GET /api/students/1 | none | 404 | "Student not found" |

Add screenshots of each test (request, response, status code) in your report.
