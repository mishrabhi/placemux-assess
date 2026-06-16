# Architecture Diagram

> **Pattern:** Modular Monolith (Microservices-ready)
> **Stack:** Node.js + Express | MongoDB | Redis | Bull Queue | Socket.io



## System Architecture

```mermaid
flowchart TD
    Client(["🖥️ Client\n(Web App)"])

    subgraph Gateway["API Layer"]
        AG["NGINX / API Gateway\n(Rate Limiting · CORS · SSL)"]
        MW["Express Middlewares\n(JWT Auth · Role Guard · Error Handler)"]
    end

    subgraph Monolith["nexus-assess — Node.js + Express App"]
        direction TB

        subgraph Core["Core Modules"]
            AM["🔐 Auth Module\nSignup · Login · JWT · Refresh"]
            UM["👤 User Module\nProfile · Skill Selection"]
            SKM["🧠 Skills Module\nSkills Catalog"]
            QM["📋 Questions Module\nMCQ · Technical · Coding"]
        end

        subgraph TestLifecycle["Test Lifecycle Modules"]
            ASM["📝 Assessment Module\nSession Create · Timer · Status"]
            PM["📷 Proctoring Module\nViolations · Warnings · Auto-bar"]
            SM["📤 Submission Module\nAnswer Store · Queue Push"]
        end

        subgraph Output["Output Modules"]
            RM["📊 Result Module\nScores · Verdict · Feedback"]
            NM["🔔 Notification Module\nEmail · Push"]
        end
    end

    subgraph Infra["Infrastructure Layer"]
        MDB[("🍃 MongoDB\nskill_assessment_db")]
        RDS[("⚡ Redis\nSession Cache · Rate Limit · Queue")]
        BQ["🐂 Bull Queue\nEvaluation Jobs"]
        S3["☁️ AWS S3\nSnapshots · Resumes"]
    end

    subgraph AI["AI Evaluation Layer"]
        EJ["⚙️ evaluation.job.js\n(Bull Consumer)"]
        AIE["🤖 AI/ML Evaluation\nEndpoint (External)"]
    end

    SOCK["🔌 Socket.io\nReal-time Proctoring Events"]

    %% Client to Gateway
    Client -->|"HTTPS REST"| AG
    Client <-->|"WebSocket"| SOCK

    %% Gateway to App
    AG --> MW
    MW --> Core
    MW --> TestLifecycle
    MW --> Output

    %% Socket to Proctoring
    SOCK --> PM

    %% Internal module calls
    UM --> SKM
    ASM --> QM
    PM -->|"terminateSession()"| ASM
    SM --> BQ

    %% App to Infra
    Core --> MDB
    TestLifecycle --> MDB
    Output --> MDB
    Core --> RDS
    ASM --> RDS
    PM --> S3

    %% Async Evaluation Pipeline
    BQ --> EJ
    EJ -->|"HTTP POST"| AIE
    AIE -->|"scores + verdict"| EJ
    EJ --> RM
    RM --> NM
    NM --> MDB
```



## Module Responsibilities

| Module | Responsibility |
|---|---|
| **Auth** | Signup, login, JWT issue/refresh/revoke, password hashing |
| **User** | Profile management, experience level, skill selection |
| **Skills** | Skills catalog CRUD, category management |
| **Questions** | Question bank — MCQ, technical, coding; difficulty & experience-level mapping |
| **Assessment** | Test session creation, question assignment, timer, lifecycle status management |
| **Proctoring** | Camera/mic permission, violation event logging, warning counter, auto-bar trigger |
| **Submission** | Answer collection, session validation, queue push, idempotency enforcement |
| **Result** | Store AI-evaluated scores, verdict, feedback; serve to candidate |
| **Notification** | Email/push dispatch for warnings, submission confirmation, result ready |



## Communication Patterns

| Pattern | Used For |
|---|---|
| **Synchronous REST** | Login, profile, session create, question fetch, result fetch |
| **WebSocket (Socket.io)** | Real-time proctoring alerts, live timer sync |
| **Async Queue (RabbitMQ)** | Submission → AI Evaluation → Result → Notification pipeline |
| **Internal function calls** | Cross-module calls within the monolith (e.g. `assessmentService.terminateSession()`) |



## Infrastructure Components

| Component | Purpose |
|---|---|
| **MongoDB** | Primary data store — all collections in `skill_assessment_db` |
| **Redis** | Active session state (timer, current question), token blacklist, rate limiting, RabbitMQ backing |
| **RabbitMQ** | Async job queue for AI evaluation pipeline (backed by Redis) |
| **AWS S3** | Camera snapshots during proctoring, candidate resume uploads |
| **NGINX** | Reverse proxy, SSL termination, rate limiting at the edge |