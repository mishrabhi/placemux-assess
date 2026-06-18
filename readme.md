# nexus-assess

> A modular Node.js + Express assessment platform with AI-powered evaluation, real-time proctoring, and skill-based test generation — built for scale.


## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express.js (per service) |
| Database | MongoDB (Mongoose ODM) — database per service |
| Cache | Redis (session state, rate limiting, token blacklist) |
| Message Queue | RabbitMQ / Kafka (async evaluation pipeline) |
| Real-time | Socket.io (proctoring service) |
| Auth | JWT (Access + Refresh tokens) |
| Storage | AWS S3 (snapshots, resumes) |
| API Gateway | NGINX + Express Gateway |
| Containerization | Docker + Docker Compose / Kubernetes |


## Architecture Pattern

**Microservices** — each service is an independently deployable Node.js + Express application with its own MongoDB database, its own `package.json`, and its own `Dockerfile`. Services communicate via REST (synchronous) and RabbitMQ/Kafka (asynchronous). No service queries another service's database directly.


## Services

| Service | Port | Responsibility |
|---|---|---|
| api-gateway | 3000 | Single entry point — routing, JWT verification, rate limiting |
| auth-service | 3001 | Signup, login, JWT issue/refresh, token revocation |
| user-service | 3002 | Candidate profile, experience level, skill selections |
| question-bank-service | 3003 | Skills catalog, MCQ/technical/coding question bank |
| assessment-service | 3004 | Test session lifecycle, question assignment, timer |
| proctoring-service | 3005 | Camera/mic permissions, violation events, auto-bar |
| submission-service | 3006 | Answer collection, idempotency, queue push |
| result-service | 3007 | AI evaluation scores, verdict, feedback storage |
| notification-service | 3008 | Email/push notifications |


## Documentation

| Document | Description |
|---|---|
| [Architecture Diagram](./docs/ARCHITECTURE.md) | Full system architecture, service responsibilities, infra layer |
| [Class Diagram](./docs/CLASS_DIAGRAM.md) | MongoDB models per service, fields, types, relationships |
| [Data Flow Diagram](./docs/DATA_FLOW.md) | End-to-end data flow, sequence diagrams per journey |


## Project Structure

```
nexus-assess/
├── api-gateway/
├── auth-service/
├── user-service/
├── question-bank-service/
├── assessment-service/
├── proctoring-service/
├── submission-service/
├── result-service/
├── notification-service/
├── shared/                  # Shared constants, event names, utility types
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CLASS_DIAGRAM.md
│   └── DATA_FLOW.md
├── docker-compose.yml       # Spins up all services + infra locally
└── README.md
```