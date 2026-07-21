# AI Mock Service

The AI Mock Service simulates an AI Question Generation API used by the Question Bank Service during development.

It generates realistic mock assessment questions based on the requested skills, difficulty, experience level, and question distribution.

This service will later be replaced by the actual AI Model provided by the AI/ML team without requiring changes in the Question Bank Service.

## Features

- Mock AI Question Generation
- Dynamic Question Distribution
- Supports MCQ
- Supports Technical Questions
- Supports Coding Questions
- Health Check API
- Lightweight Express Service
- No Database Required

## Project Structure

```
ai-mock-service
│
├── src
│   ├── controllers
│   ├── routes
│   ├── services
│   └── utils
│
├── app.js
├── server.js
├── package.json
└── .env
```

## Service Flow

```
Question Bank Service
        │
        ▼
AI Mock Service
        │
        ▼
Generate Mock Questions
        │
        ▼
Return Questions
```


## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /generate | Generate Mock Questions |
| GET | /health | Health Check |
| GET | / | Root Endpoint |


## Running Locally

```bash
npm install

npm run dev
```

## Sample Request

```json
{
  "assessmentId": "assessment_001",
  "candidateId": "candidate_001",
  "experienceLevel": "fresher",
  "difficulty": "medium",
  "skills": [
    {
      "skillId": "nodejs",
      "skillName": "Node.js",
      "weight": 40
    },
    {
      "skillId": "express",
      "skillName": "Express.js",
      "weight": 60
    }
  ],
  "distribution": {
    "mcq": 3,
    "technical": 2,
    "coding": 1
  }
}
```

## Sample Response

```json
{
  "success": true,
  "message": "Questions generated successfully.",
  "assessmentId": "assessment_001",
  "candidateId": "candidate_001",
  "totalQuestions": 6,
  "questions": [
    {
      "type": "mcq",
      "questionText": "What is Express.js primarily used for?",
      "difficulty": "medium",
      "experienceLevel": "fresher"
    }
  ]
}
```


## Integration

The Question Bank Service communicates with this service using Axios.

```text
Question Bank Service
        │
        ▼
POST /generate
        │
        ▼
AI Mock Service
        │
        ▼
Generated Questions
```

When the AI/ML team delivers the actual AI service, only the following environment variable in the Question Bank Service needs to be updated:

```env
AI_BASE_URL=<AI_SERVICE_URL>
```

No code changes are required.
