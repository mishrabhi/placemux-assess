# 📁 Folder Structure

> Each service is a fully self-contained Node.js + Express application.
> Every service has its own `package.json`, `Dockerfile`, `.env`, and MongoDB database.
> No service shares code with another at runtime — only the `/shared` directory holds
> common constants and event name contracts used at development time.


```
placemux-assess/
│
├── docker-compose.yml                  # Spins up all 9 services + MongoDB + Redis + RabbitMQ locally
├── README.md
│
├── shared/                             # Dev-time shared contracts (NOT a running service)
│   ├── constants/
│   │   ├── roles.js                    # 'candidate' | 'admin'
│   │   ├── sessionStatus.js            # 'created' | 'in_progress' | 'terminated' ...
│   │   └── violationTypes.js           # 'face_not_detected' | 'tab_switch' ...
│   ├── events/
│   │   ├── submissionEvents.js         # 'submission.created'
│   │   └── evaluationEvents.js         # 'evaluation.completed'
│   └── utils/
│       └── apiResponse.js              # Standard { success, data, message } response shape
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CLASS_DIAGRAM.md
│   ├── DATA_FLOW.md
│   └── FOLDER_STRUCTURE.md
│
│
├── api-gateway/                        # Port 3000
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                  # Env var validation
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js       # Verify JWT on every incoming request
│   │   │   ├── rateLimit.middleware.js  # Per-IP and per-user rate limiting (Redis-backed)
│   │   │   └── logger.middleware.js     # Request logging (Morgan / Winston)
│   │   ├── routes/
│   │   │   └── proxy.routes.js         # Route definitions → proxy to downstream services
│   │   └── utils/
│   │       └── httpProxy.js            # Axios/http-proxy-middleware forwarding logic
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── auth-service/                       # Port 3001 | DB: auth_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to auth_db
│   │   │   ├── redis.js                # Redis connection (token blacklist)
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── auth.controller.js      # signup, login, refresh, logout handlers
│   │   ├── services/
│   │   │   └── auth.service.js         # Business logic — hash, compare, issue JWT
│   │   ├── models/
│   │   │   ├── user.model.js           # users collection
│   │   │   └── refreshToken.model.js   # refreshTokens collection
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── middlewares/
│   │   │   └── validate.middleware.js  # Request body validation (Joi / Zod)
│   │   └── utils/
│   │       ├── jwt.js                  # signToken, verifyToken helpers
│   │       └── bcrypt.js               # hashPassword, comparePassword helpers
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── user-service/                       # Port 3002 | DB: user_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to user_db
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── user.controller.js      # getProfile, updateProfile, updateSkills handlers
│   │   ├── services/
│   │   │   └── user.service.js
│   │   ├── models/
│   │   │   └── profile.model.js        # profiles collection
│   │   ├── routes/
│   │   │   └── user.routes.js
│   │   ├── middlewares/
│   │   │   └── validate.middleware.js
│   │   └── utils/
│   │       └── s3.js                   # Resume upload helper
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── question-bank-service/              # Port 3003 | DB: question_bank_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to question_bank_db
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   ├── skill.controller.js     # listSkills, createSkill, toggleActive
│   │   │   └── question.controller.js  # listQuestions, createQuestion, getById
│   │   ├── services/
│   │   │   ├── skill.service.js
│   │   │   └── question.service.js     # filter by skillId + type + difficulty + level
│   │   ├── models/
│   │   │   ├── skill.model.js          # skills collection
│   │   │   └── question.model.js       # questions collection
│   │   ├── routes/
│   │   │   ├── skill.routes.js
│   │   │   └── question.routes.js
│   │   └── middlewares/
│   │       └── validate.middleware.js
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── assessment-service/                 # Port 3004 | DB: assessment_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to assessment_db
│   │   │   ├── redis.js                # Active session timer + state cache
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── assessment.controller.js # createSession, getSession, updatePermissions,
│   │   │                                # startSession, updateStatus
│   │   ├── services/
│   │   │   └── assessment.service.js   # Session logic, calls question-bank-service
│   │   │                               # via HTTP to fetch questions
│   │   ├── models/
│   │   │   └── testSession.model.js    # testSessions collection
│   │   ├── routes/
│   │   │   └── assessment.routes.js
│   │   ├── middlewares/
│   │   │   └── validate.middleware.js
│   │   └── utils/
│   │       └── questionFetcher.js      # HTTP client → question-bank-service
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── proctoring-service/                 # Port 3005 | DB: proctoring_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to proctoring_db
│   │   │   ├── redis.js                # Live warning count cache
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── proctoring.controller.js # logEvent (REST fallback), getStatus
│   │   ├── services/
│   │   │   └── proctoring.service.js   # handleViolation, incrementCounter,
│   │   │                               # triggerTermination → HTTP PATCH assessment-service
│   │   ├── models/
│   │   │   ├── proctoringEvent.model.js  # proctoringEvents collection
│   │   │   └── violationCounter.model.js # violationCounters collection
│   │   ├── routes/
│   │   │   └── proctoring.routes.js
│   │   ├── sockets/
│   │   │   └── proctoring.socket.js    # Socket.io event handlers
│   │   │                               # (violation events, warning emit, terminate emit)
│   │   └── utils/
│   │       └── s3.js                   # Camera snapshot upload
│   ├── app.js
│   ├── server.js                       # Boots Express + attaches Socket.io
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── submission-service/                 # Port 3006 | DB: submission_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to submission_db
│   │   │   ├── queue.js                # RabbitMQ / Kafka producer setup
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── submission.controller.js # submitAnswers handler
│   │   ├── services/
│   │   │   └── submission.service.js   # Validate session (HTTP → assessment-service),
│   │   │                               # save answers, publish 'submission.created'
│   │   ├── models/
│   │   │   └── submission.model.js     # submissions collection
│   │   ├── routes/
│   │   │   └── submission.routes.js
│   │   └── middlewares/
│   │       └── validate.middleware.js
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
├── result-service/                     # Port 3007 | DB: result_db
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                   # Mongoose connection to result_db
│   │   │   ├── queue.js                # RabbitMQ / Kafka consumer setup
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── result.controller.js    # getResult handler
│   │   ├── services/
│   │   │   └── result.service.js       # Save evaluated result,
│   │   │                               # trigger notification-service via HTTP
│   │   ├── models/
│   │   │   └── result.model.js         # results collection
│   │   ├── routes/
│   │   │   └── result.routes.js
│   │   └── jobs/
│   │       └── evaluation.consumer.js  # Consumes 'evaluation.completed' from queue,
│   │                                   # calls result.service.js to save + notify
│   ├── app.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
│
└── notification-service/               # Port 3008 | DB: notification_db
    ├── src/
    │   ├── config/
    │   │   ├── db.js                   # Mongoose connection to notification_db
    │   │   ├── mailer.js               # Nodemailer / SendGrid setup
    │   │   └── env.js
    │   ├── controllers/
    │   │   └── notification.controller.js # internal trigger endpoint
    │   ├── services/
    │   │   └── notification.service.js  # send email / push, log to notifications collection
    │   ├── models/
    │   │   └── notification.model.js    # notifications collection
    │   └── routes/
    │       └── notification.routes.js   # Internal-only routes (not exposed via gateway)
    ├── app.js
    ├── server.js
    ├── Dockerfile
    ├── .env.example
    └── package.json
```


## Key Rules

| Rule | Why |
|---|---|
| Every service has its own `package.json` | Independent dependency management and versioning |
| Every service has its own `Dockerfile` | Independent build, deploy, and scaling |
| Every service has its own `db.js` connecting to its own DB | Database-per-service — no shared DB access |
| Cross-service calls go through HTTP (Axios) or Queue only | Loose coupling — services don't import each other's code |
| `/shared` is a dev-time reference only | Contains only constants and event name strings — not imported at runtime via a shared process |
| `api-gateway` is the only service exposed to the public internet | All other services communicate internally (Docker network / K8s cluster) |