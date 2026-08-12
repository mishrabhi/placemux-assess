# placemux-assess

> A modular Node.js + Express assessment platform with AI-powered question generation, candidate skill profiles, proctoring, and AI-driven evaluation.


## Overview

`placemux-assess` is a microservice-based assessment platform that simulates a complete online exam workflow. Candidates register, select skills, receive AI-generated questions, complete a proctored assessment, and get AI-evaluated results.

This repository contains the main services required for the platform:
- `api-gateway`
- `auth-service`
- `user-service`
- `question-bank-service`
- `assessment-service`
- `proctoring-service`
- `evaluation-service`
- `mock-ai-service`
- `shared`
- `docs`


## Key Concepts

- **Skill-based assessments:** Candidates store skill selections once, and assessments are generated from those skills.
- **AI question generation:** `question-bank-service` validates the assessment blueprint and forwards generation requests to `mock-ai-service`.
- **Live proctoring:** `proctoring-service` monitors suspicious activity and can warn or terminate the assessment.
- **Assessment orchestration:** `assessment-service` manages creation, answer saving, and submission.
- **AI evaluation:** `evaluation-service` grades submitted assessments using the mock AI evaluator.
- **API gateway:** `api-gateway` routes external requests to the appropriate internal services.


## Service List

| Service | Default Port | Responsibility |
|---|---|---|
| api-gateway | 3000 | Public entrypoint and proxy to internal services |
| auth-service | 3001 | User authentication, JWT issuance, refresh tokens |
| user-service | 3002 | Candidate profile and skill selection storage |
| question-bank-service | 3003 | Skill validation and question generation orchestration |
| assessment-service | 3004 | Assessment lifecycle, question snapshots, answer tracking |
| proctoring-service | 3005 | Live proctoring, warning/termination decisions |
| evaluation-service | 3006 | Evaluation orchestration and result storage |
| mock-ai-service | 4000 | Mock AI provider for question generation and evaluation |


## End-to-end Flow

1. **Signup / login**
   - Candidate authenticates using `auth-service`.
2. **Skill selection**
   - Candidate stores skills in `user-service`.
3. **Start assessment**
   - Client calls `/api/assessments/start` through `api-gateway`.
   - `assessment-service` fetches candidate skills from `user-service` and builds an assessment blueprint.
4. **Question generation**
   - `assessment-service` sends the blueprint to `question-bank-service`.
   - `question-bank-service` validates skills and forwards the request to `mock-ai-service`.
   - `mock-ai-service` returns generated questions.
5. **Assessment creation**
   - `assessment-service` saves the assessment and question snapshots.
   - The candidate begins the assessment with questions delivered.
6. **Live proctoring**
   - Client sends proctoring events to `proctoring-service`.
   - `proctoring-service` logs violations, sends warnings, and can terminate the session.
7. **Save answers**
   - Candidate saves answers via `/api/assessments/:assessmentId/answer`.
8. **Submit assessment**
   - Candidate submits with `/api/assessments/:assessmentId/submit`.
   - `assessment-service` updates answer statistics and marks the assessment submitted.
9. **Evaluation**
   - `assessment-service` calls `evaluation-service`.
   - `evaluation-service` sends answers to `mock-ai-service` for grading.
   - Final results are persisted and can be retrieved.


## Implemented Improvements

- Candidate skills are stored and reused for assessment generation.
- `question-bank-service` validates skill data before forwarding requests to the AI service.
- `assessment-service` tracks:
  - `answeredCount`
  - `attemptedCount`
  - `lastAnsweredAt`
  - `submissionAnswerCount`
  - `progressPercent`
  - `markedForReviewCount`
  - `skippedCount`
- `proctoring-service` logs violations, manages warning counts, and can request assessment termination.
- `evaluation-service` supports secure internal service communication using `SERVICE_TOKEN`.


## Architecture Details

### Proctoring
- `proctoring-service` monitors candidate behavior during assessment.
- It logs violations and emits `warning` or `terminated` events.
- On termination, it calls `assessment-service` to mark the assessment as `barred`.

### Question generation
- `question-bank-service` validates the request and uses `mock-ai-service` for question creation.
- `mock-ai-service` is a stubbed AI backend that can be replaced with a real provider.

### Evaluation
- `evaluation-service` evaluates only submitted assessments.
- It requests grading from `mock-ai-service` and saves the evaluation output.


## API documentation

- Each service exposes Swagger docs under its `src/docs` folder.
- Main API contract files:
  - `auth-service/src/docs/swagger.js`
  - `user-service/src/docs/user.swagger.js`
  - `question-bank-service/src/docs/ai-question.swagger.js`
  - `assessment-service/src/docs/assessment.swagger.js`
  - `proctoring-service/src/docs/proctoring.swagger.js`
  - `evaluation-service/src/docs/evaluation.swagger.js`


## Environment and setup

Each service needs its own `.env` file and MongoDB connection. Shared environment variables include:
- `JWT_ACCESS_SECRET`
- `REQUEST_TIMEOUT`
- `SERVICE_TOKEN` (for trusted service-to-service calls)
- `AUTH_SERVICE_URL`
- `USER_SERVICE_URL`
- `QUESTION_BANK_SERVICE_URL`
- `ASSESSMENT_SERVICE_URL`
- `PROCTORING_SERVICE_URL`
- `EVALUATION_SERVICE_URL`
- `AI_SERVICE_URL`


## Run locally

1. Install dependencies per service:
   ```bash
   cd <service-folder>
   npm install
   ```
2. Start MongoDB locally or via Docker.
3. Create `.env` files for each service and configure URLs and secrets.
4. Start services in this order:
   - `auth-service`
   - `user-service`
   - `question-bank-service`
   - `mock-ai-service`
   - `proctoring-service`
   - `assessment-service`
   - `evaluation-service`
   - `api-gateway`
5. Use `http://localhost:3000` through `api-gateway` for client requests.


## Notes

- `api-gateway` is the recommended public entrypoint.
- `mock-ai-service` is a simulated AI provider used by both question generation and evaluation.
- The current repository includes the full end-to-end assessment workflow with live proctoring.
- Future enhancements can include a production-ready frontend proctoring integration and a real AI backend.



