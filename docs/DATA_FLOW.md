# 🔄 Data Flow Diagram

> Traces how data moves across all 9 services from signup through to final result delivery.


## Level 0 — System Context

```mermaid
flowchart LR
    Candidate(["👤 Candidate"])
    Admin(["🛠️ Admin"])
    AIML(["🤖 AI/ML Service\n(External)"])
    Platform["nexus-assess\n9 Microservices"]

    Candidate -->|"Register, Login, Take Test, View Result"| Platform
    Admin -->|"Manage Skills, Questions, View Reports"| Platform
    Platform -->|"Evaluation request — answers and session data"| AIML
    AIML -->|"Scores, verdict, feedback"| Platform
    Platform -->|"Result and notifications"| Candidate
```

## Level 1 — Full End-to-End Data Flow

```mermaid
flowchart TD
    C(["👤 Candidate"])

    subgraph Step1["1️⃣  Auth Flow"]
        A1["POST /api/auth/signup\nPOST /api/auth/login"]
        A2["Auth Service\nValidate, hash, issue JWT"]
        A3[("auth_db\nusers, refreshTokens")]
        A4["JWT Access Token + Refresh Token"]
    end

    subgraph Step2["2️⃣  Profile and Skill Selection"]
        P1["PUT /api/users/profile\nPOST /api/users/profile/skills"]
        P2["User Service\nSave profile, record skills"]
        P3[("user_db\nprofiles")]
        P4["GET /api/skills"]
        P5["Question Bank Service\nReturn skills list"]
        P6[("question_bank_db\nskills")]
    end

    subgraph Step3["3️⃣  Test Session Creation"]
        S1["POST /api/assessments"]
        S2["Assessment Service\nHTTP GET → Question Bank Service\nFilter by skill + level + difficulty"]
        S3[("question_bank_db\nquestions")]
       S4[("assessment_db\ntestSessions | status: created")]
        S5["Session ID returned to client"]
    end

    subgraph Step4["4️⃣  Proctoring Permissions"]
        PR1["PATCH /api/assessments/:id/permissions\ncamera: true, mic: true"]
        PR2["Assessment Service\nRecord permissions"]
        PR3[("assessment_db\ntestSessions | status: permission_pending")]
        PR4["PATCH /api/assessments/:id/start"]
        PR5[("assessment_db\ntestSessions | status: in_progress")]
    end

    subgraph Step5["5️⃣  Live Test and Proctoring"]
        LT1["Candidate answers questions\nMCQ, Technical, Coding"]
        LT2["Socket.io Violation Event\nface_not_detected, tab_switch, etc."]
        LT3["Proctoring Service\nLog event, increment counter\nUpdate Redis live count"]
        LT4[("proctoring_db\nproctoringEvents\nviolationCounters")]
        LT5{"warnings\ngreater than or equal to\nthreshold?"}
        LT6["HTTP PATCH\nAssessment Service\nstatus: terminated"]
        LT7["emit warning to client\nvia Socket.io"]
        LT8[("Redis\nLive session timer\nWarning count")]
    end

    subgraph Step6["6️⃣  Submission"]
        SB1["POST /api/submissions/:sessionId"]
        SB2["Submission Service\nValidate session via HTTP GET Assessment Service\nCheck idempotency on testSessionId"]
        SB3[("submission_db\nsubmissions | evaluationStatus: pending")]
        SB4["Publish to RabbitMQ\nsubmission.created"]
        SB5["202 Accepted → client"]
    end

    subgraph Step7["7️⃣  Async AI Evaluation Pipeline"]
        E1["evaluation.consumer.js\nin Result Service\nconsumes submission.created"]
        E2["HTTP POST → AI/ML Endpoint\nanswers + session + skills"]
        E3["AI Model Evaluates\nMCQ: rule-based\nTechnical and Coding: AI model"]
        E4["scores, verdict, feedback returned"]
        E5["Result Service\nSave to result_db"]
        E6[("result_db\nresults | evaluationStatus: completed")]
        E7["HTTP POST → Notification Service\ntrigger result_ready"]
        E8[("notification_db\nnotifications")]
        E9["Email or Push sent to candidate"]
    end

    subgraph Step8["8️⃣  Result Fetch"]
        R1["GET /api/results/:sessionId"]
        R2["Result Service\nFetch from result_db"]
        R3["Return: scores, verdict, feedback"]
    end

    C --> A1
    A1 --> A2
    A2 --> A3
    A2 --> A4
    A4 --> C

    C -->|"authenticated"| P1
    P1 --> P2
    P2 --> P3
    C --> P4
    P4 --> P5
    P5 --> P6
    P5 --> C

    C --> S1
    S1 --> S2
    S2 --> S3
    S2 --> S4
    S4 --> S5
    S5 --> C

    C --> PR1
    PR1 --> PR2
    PR2 --> PR3
    C --> PR4
    PR4 --> PR5

    PR5 -->|"test begins"| LT1
    LT1 --> LT8
    LT2 --> LT3
    LT3 --> LT4
    LT3 --> LT8
    LT3 --> LT5
    LT5 -->|"No"| LT7
    LT7 --> C
    LT5 -->|"Yes"| LT6
    LT6 -->|"PATCH"| PR5

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
    E7 --> E9
    E9 --> C

    C --> R1
    R1 --> R2
    R2 --> R3
    R3 --> C
```


## Level 2 — Submission to Result (Sequence Diagram)

```mermaid
sequenceDiagram
    actor Candidate
    participant GW as API Gateway
    participant SS as Submission Service
    participant AMS as Assessment Service
    participant SubDB as submission_db
    participant MQ as RabbitMQ
    participant Consumer as evaluation.consumer.js
    participant AIEP as AI/ML Endpoint
    participant RS as Result Service
    participant ResDB as result_db
    participant NS as Notification Service
    participant NotifDB as notification_db

    Candidate->>GW: POST /api/submissions/:sessionId
    GW->>SS: forward request (JWT verified)
    SS->>AMS: GET /api/assessments/:sessionId (validate session is in_progress)
    AMS-->>SS: session valid
    SS->>SubDB: check idempotency (unique testSessionId)
    SS->>SubDB: save answers (evaluationStatus: pending)
    SS->>MQ: publish submission.created
    SS-->>GW: 202 Accepted
    GW-->>Candidate: 202 Accepted

    Note over MQ,Consumer: Async — fully decoupled from HTTP response

    MQ->>Consumer: deliver submission.created event
    Consumer->>SubDB: update evaluationStatus to in_progress
    Consumer->>AIEP: POST { answers, skills, experienceLevel }
    AIEP-->>Consumer: { mcqScore, technicalScore, codingScore, verdict, feedback }
    Consumer->>RS: save result
    RS->>ResDB: insert result document
    Consumer->>SubDB: update evaluationStatus to completed
    RS->>NS: POST /internal/notify { userId, type: result_ready }
    NS->>NotifDB: log notification
    NS-->>Candidate: Email or Push — Your result is ready

    Candidate->>GW: GET /api/results/:sessionId
    GW->>RS: forward request
    RS->>ResDB: fetch result by testSessionId
    RS-->>GW: { verdict, scores, feedback }
    GW-->>Candidate: result payload
```


## Level 2 — Proctoring Violation Flow (Sequence Diagram)

```mermaid
sequenceDiagram
    actor Candidate
    participant SW as Socket.io (Proctoring Service)
    participant PS as Proctoring Service
    participant ProcDB as proctoring_db
    participant Redis as Redis
    participant AMS as Assessment Service
    participant AssDB as assessment_db

    Candidate->>SW: emit violation { type: face_not_detected, severity: high }
    SW->>PS: handleViolationEvent()
    PS->>ProcDB: insert proctoringEvent (+ snapshotUrl if applicable)
    PS->>ProcDB: increment violationCounters.totalWarnings
    PS->>Redis: update live warning count for sessionId

    alt totalWarnings less than threshold
        PS->>SW: emit warning to client { count: N, message: Face not detected }
        SW-->>Candidate: Warning shown on UI
    else totalWarnings greater than or equal to threshold
        PS->>ProcDB: update violationCounters.status to barred
        PS->>AMS: PATCH /api/assessments/:id/status { status: terminated }
        AMS->>AssDB: update testSession.status to terminated
        AMS-->>PS: 200 OK
        PS->>SW: emit terminated { reason: Max violations reached }
        SW-->>Candidate: Test forcefully terminated
    end
```


## Data Store Summary

| Store | Owned By | What Lives There |
|---|---|---|
| **auth_db** | Auth Service | users, refreshTokens |
| **user_db** | User Service | profiles (with embedded skill selections) |
| **question_bank_db** | Question Bank Service | skills, questions (with embedded codingMeta and testCases) |
| **assessment_db** | Assessment Service | testSessions (with embedded questionRefs) |
| **proctoring_db** | Proctoring Service | proctoringEvents, violationCounters |
| **submission_db** | Submission Service | submissions (with embedded answers) |
| **result_db** | Result Service | results |
| **notification_db** | Notification Service | notifications |
| **Redis** | Shared Infra | JWT blacklist, rate limit counters, live session timer, live warning counts |
| **RabbitMQ** | Shared Infra | submission.created, evaluation.completed event queues |
| **AWS S3** | Shared Infra | Camera snapshots (Proctoring), resume files (User) |