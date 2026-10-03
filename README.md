# EduFlow - Full-Stack LMS

EduFlow is a premium, feature-rich Learning Management System built with React, Node.js, and PostgreSQL.

## Features
- **User Roles**: Admin, Instructor, Student.
- **Course System**: Video lessons, PDFs, pricing, and previews.
- **Payments**: Stripe & Local (Zaad/EVC Mock) integration.
- **Exam System**: Timed quizzes, auto-grading, and retake controls.
- **Certificates**: Automated PDF generation with QR verification.
- **Dashboard**: Progress tracking for students; management for instructors.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Docker (Optional)

### Local Development

1. **Database Setup**:
   - Create a database named `eduflow`.
   - Run the schema in `backend/database.sql`.

2. **Backend**:
   ```bash
   cd backend
   npm install
   # Update .env with your credentials
   npm start
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   # Update .env (VITE_API_URL)
   npm run dev
   ```

### Docker Deployment
```bash
docker-compose up --build
```

## Folder Structure
- `/backend`: Express API, PostgreSQL controllers, PDF/QR logic.
- `/frontend`: React client, Tailwind styling, Auth context.
- `/uploads`: Storage for course assets and generated certificates.
