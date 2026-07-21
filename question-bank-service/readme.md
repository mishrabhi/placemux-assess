# Question Bank Service

The Question Bank Service is responsible for generating assessment questions based on a candidate's skills, experience level, and assessment blueprint.

Unlike traditional systems where questions are stored in a database, this service acts as an intermediary between the Assessment Service and the AI Model. It validates incoming requests, communicates with the AI service, normalizes the generated questions, and returns them in a standardized format.


## Project Structure

```
question-bank-service
│
├── src
│   ├── config
│   ├── controllers
│   ├── docs
│   ├── integrations
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── validators
│
├── app.js
├── server.js
├── package.json
└── .env
```


## Service Flow

```
Assessment Service
        │
        ▼
Question Bank Service
        │
        ▼
Validate Request
        │
        ▼
AI Service
        │
        ▼
Normalize Questions
        │
        ▼
Return Questions
```

## API Endpoints

### Skill APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/skills | Create Skill |
| GET | /api/skills | Get All Skills |
| DELETE | /api/skills/:id | Soft Delete Skill |


### AI Question API

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/questions/generate | Generate Questions using AI |


## Running Locally

```bash
npm install

npm run dev
```


## API Documentation

```
http://localhost:3003/api-docs
```


## Health Check

```
GET /health
```


## Current Architecture

```
Assessment Service
        │
        ▼
Question Bank Service
        │
        ▼
AI Mock / AI Model
```

