# placemux-assess

> A modular Node.js + Express assessment platform with AI-powered question generation, candidate skill profiles, and AI-driven evaluation.


## Overview

`placemux-assess` is a microservice-based assessment platform built to simulate a real-world online examination system. It separates responsibilities across services so that user profiles, questions, assessment sessions, AI evaluation, and the external AI generator can evolve independently.

This repository contains the main services required for the platform:
- `api-gateway`
- `auth-service`
- `user-service`
- `question-bank-service`
- `assessment-service`
- `evaluation-service`
- `mock-ai-service`
- `shared`
- `docs`


## Key Concepts

- **Skill-based assessments:** Candidates select skills once in their profile. Those skills are used to generate assessment questions.
- **Question generation service:** `question-bank-service` validates skills and forwards the assessment blueprint to `mock-ai-service`.
- **Assessment orchestration:** `assessment-service` manages the lifecycle of assessments, saves question snapshots, tracks answers, and handles submission.
- **Evaluation service:** `evaluation-service` grades submitted assessments using the stored questions and candidate answers.
- **Internal service authentication:** `SERVICE_TOKEN` is used for trusted service-to-service calls when configured.


## Actual Service List

| Service | Port | Responsibility |
|---|---|---|
| api-gateway | 3000 | Optional gateway if used; routes requests into services |
| auth-service | 3001 | User authentication, JWT issuance, refresh tokens |
| user-service | 3002 | Candidate profile, skills cache, skill selection storage |
| question-bank-service | 3003 | Skill catalog, question generation orchestration |
| assessment-service | 3004 | Assessment session lifecycle, question snapshots, answer progress |
| proctoring-service | 3005 | Live proctoring, violation warnings, assessment termination |
| evaluation-service | 3006 | Assessment evaluation, grading, result reporting |
| mock-ai-service | 3007 | Mock AI question generator and evaluator |


## High-level Flow

1. **Candidate signs up / logs in** using `auth-service`.
2. **Candidate selects skills** in `user-service` via `/api/users/profile/skills`.
3. **Assessment start:** Client calls `assessment-service` `/api/assessments/start`.
   - `assessment-service` fetches candidate profile from `user-service`.
   - It ensures selected skills exist and are non-empty.
   - Builds an assessment blueprint with skills, experience level, difficulty, and distribution.
4. **Question generation:** `assessment-service` calls `question-bank-service` `/api/questions/generate`.
   - `question-bank-service` validates skill IDs and names.
   - It forwards the blueprint to `mock-ai-service` for actual question generation.
5. **Assessment creation:** `assessment-service` stores the assessment record and question snapshots.
6. **Answer saving:** Candidate saves each answer with `/api/assessments/:assessmentId/answer`.
   - `assessment-service` tracks answered count, attempted count, marked-for-review count, and progress percent.
7. **Submission:** Candidate submits with `/api/assessments/:assessmentId/submit`.
   - `assessment-service` counts answers and skipped questions.
   - It updates submission stats and progress.
   - If configured, it calls `evaluation-service` to grade the assessment and transition the status to `evaluated`.
8. **Evaluation:** `evaluation-service` fetches assessment data from `assessment-service`, invokes AI evaluation, and saves the result.


## Current Improvements implemented

- `selectedSkills` are stored as an array in `user-service`.
- `question-bank-service` can accept batch skill creation and validates arrays of skills.
- `assessment-service` now tracks:
  - `answeredCount`
  - `attemptedCount`
  - `lastAnsweredAt`
  - `submissionAnswerCount`
  - `progressPercent`
  - `markedForReviewCount`
  - `skippedCount`
- `submitAssessment` collects answer stats and persists them on the assessment record.
- `evaluation-service` accepts an internal `SERVICE_TOKEN` for trusted service-to-service calls.


## Architecture Details

### Skill selection
- Candidate skills are selected once in `user-service`.
- Those skills are reused by `assessment-service` when starting an assessment.
- `question-bank-service` validates skill IDs/names and uses them for question generation.

### Assessment lifecycle
- `assessment-service` creates an assessment record with `questionCount` and creates snapshots for each generated question.
- Answers are stored in `CandidateAnswer` documents.
- Submission updates assessment progress and optionally triggers grading.

### Evaluation flow
- `evaluation-service` is responsible for grading only submitted assessments.
- It retrieves full assessment payload from `assessment-service` and sends it to `mock-ai-service` for evaluation.
- Results are saved in `evaluation-service` with a separate evaluation document.


## Environment and setup

Each service should have its own `.env` file and MongoDB connection. The key shared variables are:
- `JWT_ACCESS_SECRET`
- `REQUEST_TIMEOUT`
- `SERVICE_TOKEN` (for trusted service-to-service communication)
- `USER_SERVICE_URL`, `QUESTION_BANK_SERVICE_URL`, `ASSESSMENT_SERVICE_URL`, `EVALUATION_SERVICE_URL`, `AI_SERVICE_URL`


## API documentation

- Service-specific Swagger docs are available under each service's `src/docs` folder.
- Main API contract files are:
  - `auth-service/src/docs/swagger.js`
  - `user-service/src/docs/user.swagger.js`
  - `question-bank-service/src/docs/ai-question.swagger.js`
  - `assessment-service/src/docs/assessment.swagger.js`
  - `evaluation-service/src/docs/evaluation.swagger.js`


## How to run locally

1. Install dependencies per service with `npm install`.
2. Start MongoDB locally or via Docker.
3. Configure each service's `.env` with the correct URLs and secrets.
4. Start services individually with `npm run dev` in each folder.


## Notes

- This repo is built for a microservice architecture and intentionally keeps service boundaries clean.
- The evaluation path uses `SERVICE_TOKEN` when configured, but also supports normal JWT auth for admin requests.
- `mock-ai-service` is currently a stubbed AI provider used by the question bank and evaluation services.



