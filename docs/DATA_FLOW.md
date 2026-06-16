# Data Flow Diagram

> Traces how data moves through the system across all major user journeys — from signup to final result.



## Level 0 — System Context (Bird's Eye View)

```mermaid
flowchart LR
    Candidate(["👤 Candidate"])
    Admin(["🛠️ Admin"])
    AIML(["🤖 AI/ML Service"])
    System["⬛ nexus-assess\nPlatform"]

    Candidate -->|"Register · Login · Take Test · View Result"| System
    Admin -->|"Manage Skills · Questions · View Reports"| System
    System -->|"Evaluation Request (answers + session)"| AIML
    AIML -->|"Scores · Verdict · Feedback"| System
    System -->|"Result · Notifications"| Candidate
```



## Level 1 — Full Data Flow

```mermaid
flowchart TD
    %% ── ACTOR ──────────────────────────────────────────
    C(["Candidate"])

    %% ── AUTH FLOW ───────────────────────────────────────
    subgraph AuthFlow["1️⃣  Auth Flow"]
        A1["POST /auth/signup\nor /auth/login"]
        A2["Auth Module\nValidate · Hash · Issue JWT"]
        A3[("users\nrefreshTokens")]
        A4["JWT Access Token\n+ Refresh Token"]
    end

    %% ── PROFILE & SKILL SELECTION ────────────────────────
    subgraph ProfileFlow["2️⃣  Profile & Skill Selection"]
        P1["PUT /users/profile\nPOST /users/profile/skills"]
        P2["User Module\nSave Profile · Record Skills"]
        P3[("profiles")]
        P4["GET /skills\n→ Skills list to client"]
        P5[("skills")]
    end

    %% ── SESSION CREATION ─────────────────────────────────
    subgraph SessionFlow["3️⃣  Test Session Creation"]
        S1["POST /assessments"]
        S2["Assessment Module\nFilter questions by\nskill + level + difficulty"]
        S3[("questions")]
        S4[("testSessions\n(status: created)")]
        S5["Session ID returned to client"]
    end

    %% ── PROCTORING SETUP ─────────────────────────────────
    subgraph ProctorSetup["4️⃣  Proctoring Permissions"]
        PR1["PATCH /assessments/:id/permissions\n(camera: true, mic: true)"]
        PR2["Proctoring Module\nRecord permissions"]
        PR3[("testSessions\n(status: permission_pending\n→ in_progress)")]
    end

    %% ── LIVE TEST + PROCTORING ───────────────────────────
    subgraph LiveTest["5️⃣  Live Test + Real-time Proctoring"]
        direction LR
        LT1["Candidate answers questions\n(MCQ · Technical · Coding)"]
        LT2["Socket.io Events\n(face_not_detected · tab_switch · etc.)"]
        LT3["Proctoring Module\nLog event · Increment counter"]
        LT4[("proctoringEvents\nviolationCounters")]
        LT5{"warnings ≥\nthreshold?"}
        LT6["assessmentService\n.terminateSession()\n→ status: terminated"]
        LT7["⚠️ Warning sent\nto client via Socket"]
        LT8["Timer & session state\ncached in Redis"]
    end

    %% ── SUBMISSION ───────────────────────────────────────
    subgraph SubFlow["6️⃣  Submission"]
        SB1["POST /submissions/:sessionId"]
        SB2["Submission Module\nValidate session · Check idempotency"]
        SB3[("submissions\nevaluationStatus: pending)")]
        SB4["Push job to\nBull Queue"]
        SB5["202 Accepted\nreturned to client"]
    end

    %% ── ASYNC EVALUATION PIPELINE ────────────────────────
    subgraph EvalFlow["7️⃣  Async AI Evaluation Pipeline"]
        E1["evaluation.job.js\n(Bull Queue Consumer)"]
        E2["HTTP POST →\nAI/ML Evaluation Endpoint"]
        E3["AI evaluates:\nMCQ (rule-based)\nTechnical + Coding (AI model)"]
        E4["scores · verdict · feedback\nreturned"]
        E5["Result Module\nSave result to DB"]
        E6[("results\nevaluationStatus: completed")]
        E7["Notification Module\nSend result email/push"]
        E8[("notifications")]
    end

    %% ── RESULT FETCH ─────────────────────────────────────
    subgraph ResultFlow["8️⃣  Result Fetch"]
        R1["GET /results/:sessionId"]
        R2["Result Module\nFetch from results collection"]
        R3["Return: scores · verdict · feedback"]
    end

    %% ── CONNECTIONS ──────────────────────────────────────

    C --> A1
    A1 --> A2
    A2 --> A3
    A2 --> A4
    A4 --> C

    C -->|"authenticated"| P1
    P1 --> P2
    P2 --> P3
    P4 --> P5
    P4 --> C

    C --> S1
    S1 --> S2
    S2 --> S3
    S2 --> S4
    S4 --> S5
    S5 --> C

    C --> PR1
    PR1 --> PR2
    PR2 --> PR3

    PR3 -->|"test starts"| LT1
    LT1 --> LT8
    LT2 --> LT3
    LT3 --> LT4
    LT3 --> LT5
    LT5 -->|"No"| LT7
    LT7 --> C
    LT5 -->|"Yes"| LT6
    LT6 --> PR3

    LT1 --> SB1
    SB1 --> SB2
    SB2 --> SB3
    SB2 --> SB4
    SB2 --> SB5
    SB5 --> C

    SB4 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> E5
    E5 --> E6
    E5 --> E7
    E7 --> E8
    E7 -->|"email / push"| C

    C --> R1
    R1 --> R2
    R2 --> R3
    R3 --> C
```



## Level 2 — Submission to Result (Zoomed In)

```mermaid
sequenceDiagram
    actor Candidate
    participant API as Express API
    participant SubSvc as Submission Service
    participant SubDB as submissions (MongoDB)
    participant Queue as Bull Queue (Redis)
    participant Job as evaluation.job.js
    participant AI as AI/ML Endpoint
    participant ResDB as results (MongoDB)
    participant NotifSvc as Notification Service

    Candidate->>API: POST /submissions/:sessionId
    API->>SubSvc: validateSession() + checkIdempotency()
    SubSvc->>SubDB: save answers (evaluationStatus: pending)
    SubSvc->>Queue: push evaluation job
    API-->>Candidate: 202 Accepted

    Note over Queue,Job: Async — decoupled from HTTP response

    Queue->>Job: dequeue job (testSessionId + answers)
    Job->>SubDB: update evaluationStatus → in_progress
    Job->>AI: POST { answers, skills, experienceLevel }
    AI-->>Job: { mcqScore, technicalScore, codingScore, verdict, feedback }
    Job->>ResDB: save result (verdict, scores, feedback)
    Job->>SubDB: update evaluationStatus → completed
    Job->>NotifSvc: triggerNotification(userId, result_ready)
    NotifSvc-->>Candidate: Email / Push — "Your result is ready"

    Candidate->>API: GET /results/:sessionId
    API-->>Candidate: { verdict, scores, feedback }
```



## Level 2 — Proctoring Event Flow (Zoomed In)

```mermaid
sequenceDiagram
    actor Candidate
    participant SW as Socket.io Server
    participant ProcSvc as Proctoring Service
    participant ProcDB as proctoringEvents (MongoDB)
    participant ViolDB as violationCounters (MongoDB)
    participant AsmSvc as Assessment Service
    participant AsmDB as testSessions (MongoDB)
    participant Redis as Redis Cache

    Candidate->>SW: emit('violation', { type: 'face_not_detected', severity: 'high' })
    SW->>ProcSvc: handleViolationEvent()
    ProcSvc->>ProcDB: insert proctoringEvent (+ snapshotUrl if applicable)
    ProcSvc->>ViolDB: increment totalWarnings
    ProcSvc->>Redis: update live warning count

    alt warnings < threshold
        ProcSvc->>SW: emit('warning', { count: N, message: "Face not detected" })
        SW-->>Candidate: Warning shown on UI
    else warnings >= threshold
        ProcSvc->>ViolDB: status → barred
        ProcSvc->>AsmSvc: terminateSession(sessionId)
        AsmSvc->>AsmDB: status → terminated
        ProcSvc->>SW: emit('terminated', { reason: "Max violations reached" })
        SW-->>Candidate: Test terminated
    end
```



## Data Store Responsibilities

| Store | What Lives There |
|---|---|
| **MongoDB** | All persistent data — users, sessions, questions, answers, results, notifications |
| **Redis** | Live session timer, current question index, warning count, JWT blacklist, Bull queue |
| **AWS S3** | Camera snapshots (proctoring), candidate resume files |
| **RabbitMQx** | Async evaluation jobs (backed by Redis, consumed by `evaluation.job.js`) |