# Proctoring Service

The Proctoring Service handles live violation events during assessments, emits warnings to the candidate in real time, and can terminate assessments when violations cross a threshold.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values.
3. Start the service:
   ```bash
   npm run dev
   ```

## API docs

`http://localhost:3005/api-docs`

## Endpoints

- `POST /api/proctoring/event` — log a violation event
- `GET /api/proctoring/{assessmentId}/status` — fetch current warning status

## Socket.io client example

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3005", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to proctoring service", socket.id);
});

socket.on("warning", (payload) => {
  console.log("Proctoring warning:", payload);
  // Show warning UI to candidate
});

socket.on("terminated", (payload) => {
  console.log("Assessment terminated:", payload);
  // Redirect candidate to assessment end page
});

socket.on("error", (payload) => {
  console.error("Proctoring socket error:", payload);
});

const sendViolation = ({ assessmentId, candidateId, eventType, severity, message, snapshotUrl }) => {
  socket.emit("violation", {
    assessmentId,
    candidateId,
    eventType,
    severity,
    message,
    snapshotUrl,
  });
};

// Example usage
sendViolation({
  assessmentId: "ASSESS-123",
  candidateId: "USER-456",
  eventType: "tab_switch",
  severity: "medium",
  message: "User switched browser tab during assessment.",
});
```

## Validation

The server validates socket payloads using the same Joi schema as the REST endpoint. Invalid payloads produce a socket `error` event with details.
