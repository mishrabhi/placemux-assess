# Architecture Diagram

> **Pattern:** Microservices
> **Stack:** Node.js + Express (per service) | MongoDB (per service) | Redis | RabbitMQ | Socket.io



## System Architecture

```mermaid
flowchart TD
    Client(["🖥️ Client\n(Web App)"])

    subgraph PublicLayer["Public Layer"]
        NGINX["NGINX\n(SSL · CORS · Load Balancer)"]
        GW["API Gateway — Port 3000\n(JWT Verify · Rate Limit · Route Proxy)"]
    end

    subgraph Services["Microservices — Internal Network"]
        direction TB

        subgraph AuthCluster["Auth and Identity"]
            AS["🔐 Auth Service — Port 3001"]
            US["👤 User Service — Port 3002"]
        end

        subgraph QuestionCluster["Question Domain"]
            QBS["📋 Question Bank Service — Port 3003"]
        end

        subgraph TestCluster["Test Lifecycle"]
            AMS["📝 Assessment Service — Port 3004"]
            PS["📷 Proctoring Service — Port 3005"]
        end

        subgraph EvalCluster["Evaluation Pipeline"]
            SS["📤 Submission Service — Port 3006"]
            RS["📊 Result Service — Port 3007"]
            NS["🔔 Notification Service — Port 3008"]
        end
    end

    subgraph Infra["Infrastructure Layer"]
        direction LR
        AuthDB[("auth_db")]
        UserDB[("user_db")]
        QBDB[("question_bank_db")]
        AssDB[("assessment_db")]
        ProcDB[("proctoring_db")]
        SubDB[("submission_db")]
        ResDB[("result_db")]
        NotifDB[("notification_db")]
        REDIS[("Redis — Cache and Rate Limit")]
        MQ["RabbitMQ — Message Queue"]
    end

    subgraph AILayer["AI Evaluation Layer"]
        AIJOB["evaluation.consumer.js\nQueue Consumer in Result Service"]
        AIEP["AI/ML Evaluation Endpoint\nExternal"]
    end

    Client -->|"HTTPS"| NGINX
    Client <-->|"WebSocket"| PS
    NGINX --> GW

    GW -->|"/api/auth/*"| AS
    GW -->|"/api/users/*"| US
    GW -->|"/api/skills /api/questions"| QBS
    GW -->|"/api/assessments/*"| AMS
    GW -->|"/api/proctoring/*"| PS
    GW -->|"/api/submissions/*"| SS
    GW -->|"/api/results/*"| RS

    AMS -->|"GET questions by skill and level"| QBS
    PS -->|"PATCH session status terminated"| AMS
    RS -->|"POST trigger notification"| NS

    AS --- AuthDB
    US --- UserDB
    QBS --- QBDB
    AMS --- AssDB
    PS --- ProcDB
    SS --- SubDB
    RS --- ResDB
    NS --- NotifDB

    AS --- REDIS
    GW --- REDIS
    AMS --- REDIS
    PS --- REDIS

    SS -->|"publish: submission.created"| MQ
    MQ -->|"consume: submission.created"| AIJOB
    AIJOB -->|"HTTP POST answers and session"| AIEP
    AIEP -->|"scores, verdict, feedback"| AIJOB
    AIJOB -->|"save result"| RS
    RS -->|"publish: evaluation.completed"| MQ
```



## Service Responsibilities

| Service | Port | DB | Responsibility |
|---|---|---|---|
| **API Gateway** | 3000 | — | JWT verification, rate limiting, route proxying to all downstream services |
| **Auth Service** | 3001 | auth_db | Signup, login, JWT issue/refresh/revoke, bcrypt password handling |
| **User Service** | 3002 | user_db | Candidate profile, experience level, skill selection management |
| **Question Bank Service** | 3003 | question_bank_db | Skills catalog, question CRUD (MCQ/technical/coding), difficulty and experience-level filtering |
| **Assessment Service** | 3004 | assessment_db | Test session creation, question assignment, timer state, session lifecycle management |
| **Proctoring Service** | 3005 | proctoring_db | Camera/mic permissions, Socket.io violation events, warning counter, auto-bar trigger |
| **Submission Service** | 3006 | submission_db | Answer ingestion, session validation, idempotency enforcement, queue publish |
| **Result Service** | 3007 | result_db | Consumes evaluation queue, stores AI verdict/scores, serves results to candidate |
| **Notification Service** | 3008 | notification_db | Email/push dispatch for warnings, submission confirmation, result ready alerts |



## Communication Patterns

| Pattern | Between | Used For |
|---|---|---|
| **HTTPS REST** | Client → API Gateway → Services | All user-facing requests |
| **WebSocket (Socket.io)** | Client ↔ Proctoring Service | Real-time violation alerts, live warnings |
| **Internal HTTP (Axios)** | Service to Service | Assessment → Question Bank (fetch questions), Proctoring → Assessment (terminate), Result → Notification (trigger) |
| **Async Queue (RabbitMQ)** | Submission → Result Service via AI | Evaluation pipeline — keeps submission API non-blocking |



## Infrastructure Components

| Component | Purpose |
|---|---|
| **MongoDB x8** | One database per service — full data isolation |
| **Redis** | JWT blacklist (Auth), rate limiting (Gateway), live session timer and warning count (Assessment, Proctoring) |
| **RabbitMQ** | Async message broker for submission to AI evaluation to result pipeline |
| **AWS S3** | Camera violation snapshots (Proctoring), candidate resume uploads (User) |
| **NGINX** | SSL termination, load balancing, reverse proxy to API Gateway |