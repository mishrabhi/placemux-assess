# placemux-assess

> A modular Node.js + Express assessment platform with AI-powered evaluation, real-time proctoring, and skill-based test generation — built for scale.



## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Cache & Queue | Redis + Bull |
| Real-time | Socket.io |
| Auth | JWT (Access + Refresh tokens) |
| Storage | AWS S3 |
| Reverse Proxy | NGINX |
| Containerization | Docker + Docker Compose |



## Architecture Pattern

**Modular Monolith** — one deployable unit with cleanly separated internal modules. Each module owns its routes, controller, service, and model. Cross-module communication happens only through service-layer function calls — making future extraction into microservices a low-friction operation.



## Documentation

| Document | Description |
|---|---|
| [Architecture Diagram](./docs/ARCHITECTURE.md) | System architecture, module responsibilities, infrastructure layer |
| [Class Diagram](./docs/CLASS_DIAGRAM.md) | MongoDB models, fields, types, and relationships |
| [Data Flow Diagram](./docs/DATA_FLOW.md) | End-to-end data flow across all user journeys, sequence diagrams |



## Project Structure

```
placemux-assess/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/          # DB, Redis, Queue, Env
│   ├── modules/         # auth · user · skills · questions
│   │                    # assessment · proctoring · submission
│   │                    # result · notification
│   ├── jobs/            # evaluation.job.js (Bull consumer)
│   ├── middlewares/     # auth · role · error · rateLimit
│   ├── sockets/         # proctoring.socket.js
│   └── utils/           # jwt · bcrypt · s3 · apiResponse
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CLASS_DIAGRAM.md
│   └── DATA_FLOW.md
├── .env.example
├── Dockerfile
└── docker-compose.yml
```