# Evaluation Service

## Overview

The Evaluation Service is responsible for evaluating completed assessments in the Placemux Assess platform.

It acts as an orchestration service that communicates with the Assessment Service to retrieve assessment data and with the AI Service to evaluate candidate responses. Once the evaluation is complete, it stores the final scores and detailed evaluation report.

The service itself does not contain business logic for evaluating answers. All evaluation is delegated to the AI Service, making it easy to replace or upgrade the AI models in the future without changing this service.


## Features

* Evaluate Submitted Assessments
* AI-based Answer Evaluation
* Section-wise Score Calculation
* Overall Score Calculation
* Pass / Fail Determination
* Detailed Evaluation Report
* Candidate Result API
* Swagger API Documentation
* JWT Authentication
* Request Validation
* MongoDB Integration
* Microservice Communication


## Folder Structure

```
evaluation-service

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
│      ├── assessment.client.js
│      └── ai.client.js
│
├── middlewares
│
├── models
│      ├── evaluation.model.js
│      └── evaluationDetail.model.js
│
├── routes
│
├── services
│
├── utils
│      ├── ApiError.js
│      ├── ApiResponse.js
│      ├── asyncHandler.js
│      └── generateEvaluationId.js
│
├── validators
│      ├── evaluate.validator.js
│      └── result.validator.js
│
├── app.js
├── server.js
├── package.json
└── .env
```

## Architecture

```
              Assessment Service
                      │
                      ▼
             Evaluation Service
               │             │
               ▼             ▼
      Assessment Client   AI Client
               │             │
               ▼             ▼
       Assessment Data   AI Evaluation
               │
               ▼
       Store Evaluation Report
```


## Responsibilities

The Evaluation Service is responsible for:

* Retrieving submitted assessments
* Retrieving question snapshots
* Retrieving candidate answers
* Preparing AI evaluation requests
* Communicating with the AI Service
* Storing evaluation reports
* Calculating final results
* Returning candidate results

The Evaluation Service does NOT:

* Authenticate users
* Generate questions
* Start assessments
* Manage candidate profiles
* Execute AI evaluation logic


## Database Collections

### Evaluation

Stores overall evaluation information.

Fields include:

* evaluationId
* assessmentId
* candidateId
* scores
* totalScore
* maxScore
* percentage
* passed
* status
* evaluationEngine
* evaluatedAt


### EvaluationDetail

Stores question-level evaluation information.

Fields include:

* evaluationId
* assessmentId
* questionId
* questionType
* candidateAnswer
* correctAnswer
* obtainedScore
* maxScore
* feedback
* evaluatedBy


## API Endpoints

### Evaluation APIs

| Method | Endpoint                                | Description                |
| ------ | --------------------------------------- | -------------------------- |
| POST   | `/api/evaluations/evaluate`             | Evaluate Assessment        |
| GET    | `/api/evaluations/:assessmentId`        | Detailed Evaluation Report |
| GET    | `/api/evaluations/result/:assessmentId` | Candidate Result           |


## Evaluation Flow

```
Assessment Submitted

↓

Evaluation Service

↓

Assessment Service

↓

Assessment Data

↓

AI Service

↓

AI Evaluation

↓

Store Evaluation

↓

Return Result
```


## AI Evaluation Flow

```
Assessment

↓

Questions

↓

Candidate Answers

↓

AI Service

↓

Section-wise Evaluation

↓

Overall Result

↓

Evaluation Service

↓

MongoDB
```



## Running Locally

Install dependencies

```bash
npm install
```

Run the service

```bash
npm run dev
```


## Swagger Documentation

```
http://localhost:3005/api-docs
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
Evaluation Service

        │

        ├────────────► Assessment Service

        │                 │

        │                 ▼

        │          Assessment Data

        │

        └────────────► AI Service

                          │

                          ▼

                 AI Evaluation Result
```


## Evaluation Lifecycle

```
Assessment Submitted

↓

Fetch Assessment

↓

Build AI Payload

↓

AI Evaluation

↓

Store Evaluation

↓

Generate Report

↓

Return Result
```

## Current Status

Implemented

* AI Evaluation Integration
* Assessment Integration
* Evaluation Report
* Candidate Result
* Swagger Documentation
* MongoDB Models
* Validation
* JWT Authentication
* Microservice Communication



