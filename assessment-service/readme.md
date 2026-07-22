# Assessment Service

## Overview

The Assessment Service is the central orchestration service of the Placemux Assess platform.

It is responsible for managing the complete lifecycle of an assessment, from creating a new assessment to saving candidate answers, maintaining question snapshots, and submitting assessments for evaluation.

Unlike the Question Bank Service, this service does not generate questions. Instead, it coordinates with the User Service and Question Bank Service to build an assessment for the candidate.


## Features

- Start Assessment
- Resume Assessment
- Save Candidate Answers
- Submit Assessment
- Assessment History
- AI-powered Question Generation Integration
- Assessment Snapshot Storage
- JWT Authentication
- Request Validation
- Swagger API Documentation
- MongoDB Integration
- Microservice Communication

## Folder Structure

```
assessment-service

│

├── src
│
├── config
│
├── controllers
│
├── docs
│
├── integrations
│      ├── questionBank.client.js
│      └── user.client.js
│
├── middlewares
│
├── models
│      ├── assessment.model.js
│      ├── candidateAnswer.model.js
│      └── questionSnapshot.model.js
│
├── routes
│
├── services
│
├── utils
│
├── validators
│
├── app.js
│
├── server.js
│
├── package.json
│
└── .env
```

---

## Architecture

```
                 Frontend
                     │
                     ▼
          Assessment Service
             │          │
             │          ▼
             │     User Service
             │
             ▼
      Question Bank Service
             │
             ▼
        AI Mock Service
```

## Responsibilities

The Assessment Service is responsible for:

- Creating assessments
- Fetching candidate profile
- Fetching selected skills
- Calling Question Bank Service
- Receiving generated questions
- Saving Question Snapshot
- Saving Candidate Answers
- Managing Assessment Status
- Returning assessments to candidates

## API Endpoints

### Assessment APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/assessments/start` | Start Assessment |
| POST | `/api/assessments/:assessmentId/answer` | Save Candidate Answer |
| GET | `/api/assessments/:assessmentId` | Resume Assessment |
| POST | `/api/assessments/:assessmentId/submit` | Submit Assessment |
| GET | `/api/assessments/history` | Assessment History |


## Assessment Flow

```
Candidate

↓

Login

↓

Assessment Service

↓

User Service

↓

Candidate Profile

↓

Question Bank Service

↓

AI Mock Service

↓

Generated Questions

↓

Assessment Created

↓

Question Snapshot Stored

↓

Questions Returned
```

---

## Save Answer Flow

```
Candidate

↓

Save Answer API

↓

CandidateAnswer Collection

↓

Auto Save
```

---

## Submit Flow

```
Candidate

↓

Submit Assessment

↓

Assessment Status

↓

submitted

↓

Ready for Evaluation Service
```

## Running Locally

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```


## Swagger Documentation

```
http://localhost:3004/api-docs
```

## Health Check

```
GET /health
```


## Root Endpoint

```
GET /
```

## Service Communication

```
Assessment Service

        │

        ├────────────► User Service

        │

        │               Candidate Profile

        │

        └────────────► Question Bank Service

                            │

                            ▼

                     AI Mock Service
```


## Assessment Lifecycle

```
Create Assessment

↓

Generate Questions

↓

Store Snapshot

↓

Return Questions

↓

Save Answers

↓

Resume Assessment

↓

Submit Assessment

↓

Evaluation Service (Future)
```


## Future Enhancements

- MongoDB Transactions
- Auto Save Timer
- Assessment Expiry
- AI Feedback
- Coding Execution Engine
- Proctoring
- Redis Caching
- Service-to-Service Authentication
- Evaluation Integration
- Leaderboards
- Analytics Dashboard