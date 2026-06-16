# 🗂️ Class Diagram

> Represents the Mongoose models (collections), their fields, types, and relationships across the `skill_assessment_db` MongoDB database.



## Class Diagram

```mermaid
classDiagram

    %% ── AUTH ──────────────────────────────────────────────
    class User {
        +ObjectId _id
        +String email
        +String password
        +String role
        +String experienceLevel
        +Boolean isVerified
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
    }

    class RefreshToken {
        +ObjectId _id
        +ObjectId userId
        +String token
        +Date expiresAt
        +Date createdAt
    }

    %% ── USER ──────────────────────────────────────────────
    class Profile {
        +ObjectId _id
        +ObjectId userId
        +String fullName
        +String phone
        +Number yearsOfExperience
        +String resumeUrl
        +SkillRef[] selectedSkills
        +Date createdAt
        +Date updatedAt
    }

    class SkillRef {
        +ObjectId skillId
        +String skillName
        +Date selectedAt
    }

    %% ── SKILLS & QUESTIONS ────────────────────────────────
    class Skill {
        +ObjectId _id
        +String name
        +String category
        +Boolean isActive
        +Date createdAt
    }

    class Question {
        +ObjectId _id
        +ObjectId skillId
        +String type
        +String difficulty
        +String experienceLevel
        +String questionText
        +String[] options
        +String correctAnswer
        +Number maxScore
        +Number timeLimitSeconds
        +CodingMeta codingMeta
        +Date createdAt
        +Date updatedAt
    }

    class CodingMeta {
        +String[] allowedLanguages
        +String starterCode
        +TestCase[] testCases
    }

    class TestCase {
        +String input
        +String expectedOutput
        +Boolean isHidden
    }

    %% ── ASSESSMENT ────────────────────────────────────────
    class TestSession {
        +ObjectId _id
        +ObjectId userId
        +ObjectId[] skillsSelected
        +String experienceLevel
        +String status
        +QuestionRef[] questions
        +Number durationMinutes
        +Boolean cameraPermission
        +Boolean micPermission
        +Date startedAt
        +Date endedAt
        +Date createdAt
        +Date updatedAt
    }

    class QuestionRef {
        +ObjectId questionId
        +String type
        +Number orderIndex
        +Number maxScore
    }

    %% ── PROCTORING ────────────────────────────────────────
    class ProctoringEvent {
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +String eventType
        +String severity
        +String snapshotUrl
        +Date timestamp
    }

    class ViolationCounter {
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +Number totalWarnings
        +String status
        +Date lastUpdatedAt
    }

    %% ── SUBMISSION ────────────────────────────────────────
    class Submission {
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +Answer[] answers
        +Date submittedAt
        +String evaluationStatus
    }

    class Answer {
        +ObjectId questionId
        +String questionType
        +String answer
        +String code
        +String language
        +Number timeTakenSeconds
    }

    %% ── RESULT ────────────────────────────────────────────
    class Result {
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +Number mcqScore
        +Number technicalScore
        +Number codingScore
        +Number overallScore
        +String verdict
        +String feedback
        +Date evaluatedAt
        +Date createdAt
    }

    %% ── NOTIFICATION ──────────────────────────────────────
    class Notification {
        +ObjectId _id
        +ObjectId userId
        +String type
        +String channel
        +String message
        +String status
        +Date sentAt
        +Date createdAt
    }

    %% ── RELATIONSHIPS ─────────────────────────────────────

    User "1" --> "0..*" RefreshToken : has
    User "1" --> "1" Profile : has
    Profile "1" --> "0..*" SkillRef : selectedSkills
    SkillRef "0..*" --> "1" Skill : references

    Skill "1" --> "0..*" Question : has
    Question "1" --> "0..1" CodingMeta : has
    CodingMeta "1" --> "0..*" TestCase : has

    User "1" --> "0..*" TestSession : takes
    TestSession "1" --> "0..*" QuestionRef : contains
    QuestionRef "0..*" --> "1" Question : references
    TestSession "1" --> "0..*" Skill : based on

    TestSession "1" --> "0..*" ProctoringEvent : generates
    TestSession "1" --> "1" ViolationCounter : tracked by

    TestSession "1" --> "1" Submission : has
    Submission "1" --> "0..*" Answer : contains
    Answer "0..*" --> "1" Question : answers

    Submission "1" --> "1" Result : evaluated into
    User "1" --> "0..*" Notification : receives
```



## Field Type Reference

| Type | Description |
|---|---|
| `ObjectId` | MongoDB document reference (`_id` or foreign key ref) |
| `String` | Text field — enums noted in schema |
| `Number` | Integer or float |
| `Boolean` | true / false flag |
| `Date` | ISO timestamp |
| `[]` | Array of the noted type |



## Enum Values Quick Reference

| Field | Allowed Values |
|---|---|
| `User.role` | `candidate` · `admin` |
| `User.experienceLevel` | `fresher` · `experienced` |
| `Question.type` | `mcq` · `technical` · `coding` |
| `Question.difficulty` | `easy` · `medium` · `hard` |
| `Question.experienceLevel` | `fresher` · `experienced` · `both` |
| `TestSession.status` | `created` · `permission_pending` · `in_progress` · `submitted` · `terminated` · `expired` |
| `ViolationCounter.status` | `active` · `warned` · `barred` |
| `ProctoringEvent.eventType` | `face_not_detected` · `multiple_faces` · `tab_switch` · `noise_detected` · `no_camera` |
| `ProctoringEvent.severity` | `low` · `medium` · `high` |
| `Submission.evaluationStatus` | `pending` · `in_progress` · `completed` · `failed` |
| `Result.verdict` | `pass` · `fail` |
| `Notification.type` | `warning` · `submission_received` · `result_ready` |
| `Notification.channel` | `email` · `push` |
| `Notification.status` | `queued` · `sent` · `failed` |