# Gamified Learning Platform

A full-stack **Gamified Learning Platform (GLP)** that combines structured online learning with game-inspired mechanics such as XP, levels, badges, leaderboards, quizzes, flashcards, and progress tracking.

## Live Application

**Live Website:** https://gamified-learning-coral-iota.vercel.app/

---

## Overview

The platform provides separate learning and management workflows for **students** and **teachers**.

### Students can

- Explore and enroll in courses
- Study lessons and learning materials
- Watch lesson videos and access notes
- Attempt quizzes
- Track lesson and course progress
- Earn XP and level up
- Unlock achievement badges
- View leaderboard rankings
- Study course and personal flashcards

### Teachers can

- Create and manage courses
- Create lessons and learning materials
- Create quizzes and questions
- Configure assessment settings
- Manage course flashcards
- Monitor student enrollment
- Review quiz performance
- Review short-answer submissions
- View course and lesson analytics

---

## Key Features

### Learning Management

- Course discovery
- Course details and curriculum
- Teacher-owned courses
- Student enrollment
- Ordered lessons
- Video and PDF learning materials
- Lesson completion tracking
- Course completion tracking

### Assessment

- Quiz creation and management
- MCQ questions
- Short-answer questions
- Configurable marks
- Configurable passing percentage
- Required and optional quizzes
- Quiz attempt tracking
- Automatic MCQ evaluation
- Teacher review of short answers
- Student performance tracking

### Gamification

- Experience points (XP)
- Levels
- Achievement badges
- Leaderboards
- Student ranking
- Learning-based XP rewards
- Badge evaluation based on achievements

### Flashcards

- Course flashcard decks
- Personal student decks
- Flashcard creation and management
- Course and personal study cards

### User Experience

- Responsive interface
- Modern dashboard
- Tailwind CSS styling
- Framer Motion animations
- Lottie animations
- Toast notifications
- Responsive navigation
- Course-focused learning interface
- Quiz progress and completion experience

---

# Student Learning Flow

```text
Register / Login
      ↓
Explore Courses
      ↓
Enroll in Course
      ↓
Study Lessons
      ↓
Complete Lessons
      ↓
Attempt Quizzes
      ↓
Earn XP / Badges
      ↓
Track Progress
      ↓
Complete Course
```

---

# Teacher Workflow

```text
Teacher Login
      ↓
Create Course
      ↓
Add Lessons
      ↓
Add Learning Materials
      ↓
Create Quiz
      ↓
Add Questions
      ↓
Monitor Students
      ↓
Review Performance
      ↓
Review Short Answers
```

---

# Gamification System

Gamification is a core part of the platform.

## XP

Students earn experience points through learning activities.

The current implementation awards XP for lesson completion.

## Levels

Student levels are derived from accumulated XP, allowing learners to progress through increasingly higher levels as they continue learning.

## Badges

The platform supports achievement badges based on learning and assessment activity, including achievements related to:

- Quiz participation
- Learning level
- Quiz activity
- Leaderboard performance

## Leaderboard

Students can view rankings based on accumulated XP and see their position relative to other learners.

---

# Quiz System

The platform supports both **multiple-choice** and **short-answer** questions.

The quiz workflow is:

```text
Create Quiz
    ↓
Add Questions
    ↓
Student Attempts Quiz
    ↓
Automatic MCQ Evaluation
    ↓
Short Answers → Teacher Review
    ↓
Pass / Fail
    ↓
Progress & Gamification Updates
```

Quiz attempts track scores, marks, percentage, pass/fail status, answers, review state, and submission information.

The platform also prevents inappropriate repeated attempts according to the implemented attempt rules.

---

# Flashcard System

The platform supports two types of flashcard learning.

### Course Flashcards

Teachers can create flashcard decks associated with courses for students to study.

### Personal Flashcards

Students can create their own decks and cards for personalized revision.

Students can manage their personal flashcard collections and study course-provided flashcards.

---

# Progress and Enrollment

Enrollment and learning progress are handled separately.

The platform tracks:

- Course enrollment
- Lesson completion
- Course completion
- Completion timestamps
- Learning progress

Completing learning activities also integrates with the platform's XP and gamification system.

---

# Authentication

Authentication uses a token-based login system with password hashing.

The authentication system supports:

- Student accounts
- Teacher accounts
- Registration
- Login
- Role-aware workflows
- Protected application functionality

Sensitive authentication credentials are intentionally **not documented in this README**.

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | UI development |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Lottie React | Animations |
| React Hot Toast | Notifications |
| React CountUp | Animated statistics |
| Canvas Confetti | Completion effects |

## Backend

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Development language |
| TypeORM | ORM |
| PostgreSQL | Relational database |
| Passport | Authentication |
| JWT | Token authentication |
| bcrypt | Password hashing |
| Multer | File uploads |
| Express | HTTP/static-file serving |

## Hosting

| Platform | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Supabase | PostgreSQL hosting |

---

# System Architecture

```text
                    ┌──────────────────────┐
                    │     User Browser     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ API
                               ▼
                    ┌──────────────────────┐
                    │   NestJS Backend     │
                    │       Render         │
                    └──────────┬───────────┘
                               │
                               │ TypeORM
                               ▼
                    ┌──────────────────────┐
                    │ PostgreSQL Database  │
                    │      Supabase        │
                    └──────────────────────┘
```

---

# Backend Architecture

The backend is organized into feature-based NestJS modules.

Major application areas include:

- Authentication
- Users
- Courses
- Lessons
- Enrollment
- Quizzes
- Questions
- Quiz attempts
- Lesson progress
- Course progress
- Badges
- User badges
- Leaderboard
- Flashcards
- Dashboard analytics
- File uploads

This modular architecture keeps learning, assessment, gamification, and user-management functionality separated and maintainable.

---

# Database

The application uses **PostgreSQL** with **TypeORM**.

The database supports the platform's major domains:

- Users
- Courses
- Lessons
- Enrollments
- Quizzes
- Questions
- Quiz attempts
- Lesson progress
- Course progress
- Badges
- User badges
- Flashcard decks
- Flashcards
- Personal decks and cards

The detailed database schema and internal field definitions are intentionally not included in this public README.

---

# Local Development

## Prerequisites

Install:

- Node.js
- npm
- Git
- PostgreSQL or access to a compatible PostgreSQL database

## Clone the Repository

```bash
git clone https://github.com/aamirkid1/Gamified-Learning-Web.git
cd Gamified-Learning-Web
```

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

## Environment Configuration

The application requires environment configuration for:

- Database connection
- Frontend/backend communication
- Authentication and other deployment-specific settings

**Do not commit `.env` or other secret-containing configuration files to GitHub.**

Use your own local environment configuration when running the project.

## Run Backend

```bash
cd backend
npm run start:dev
```

## Run Frontend

```bash
cd frontend
npm run dev
```

The exact local ports can be configured through the project's development configuration and environment settings.

---

# Production Deployment

The production application follows this high-level architecture:

```text
GitHub
  │
  ├── Frontend → Vercel
  │
  └── Backend → Render
                   │
                   ▼
              PostgreSQL
               Supabase
```

The live frontend is available at:

**https://gamified-learning-coral-iota.vercel.app/**

Production credentials, environment variables, database connection strings, internal service URLs, and deployment-specific configuration are intentionally **not published in this README**.

---

# Static Assets

The application supports uploaded learning assets such as:

- Course images
- Badge images
- Lesson-related files

Static assets are served by the backend and consumed by the frontend where required.

Internal filesystem paths and upload configuration are intentionally omitted from this public README.

---

# Screenshots

The project includes UI assets that can be used to showcase:

- Student dashboard
- Teacher dashboard
- Course exploration
- Lesson experience
- Flashcards
- Leaderboard
- Quiz results

Screenshots can be added to this README using GitHub-hosted images or repository assets.

Example:

```markdown
![Student Dashboard](path-to-image)
```

---


# Future Improvements

Potential future improvements include:

- Stronger role-based authorization
- DTO validation
- Database migrations
- Refresh-token authentication
- Real-time multiplayer duel functionality
- Dedicated certificate generation
- Advanced course analytics
- Automated frontend and backend testing
- Swagger/OpenAPI documentation
- Centralized error handling
- Rate limiting
- Production monitoring and logging
- Pagination for large datasets
- Enhanced flashcard learning analytics

---

# Contributors

### [Mohd Aaqib](https://github.com/aamirkid1)

### [Abida Argawan](https://github.com/aby-TT)

---

# License

No open-source license is currently specified in the repository.

If the project is intended for public reuse or modification, an appropriate license can be added.

---

## Live Demo

**https://gamified-learning-coral-iota.vercel.app/**
