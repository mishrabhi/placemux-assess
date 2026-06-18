# Class Diagram

> Each service owns its own MongoDB database. Models are grouped by service.
> Cross-service references store the remote `ObjectId` only — no joins, no shared collections.



## Full Class Diagram

```mermaid
classDiagram
    %% ═══════════════════════════════════════
    %% AUTH SERVICE — auth_db
    %% ═══════════════════════════════════════
    class User {
        <<auth_db>>
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
        <<auth_db>>
        +ObjectId _id
        +ObjectId userId
        +String token
        +Date expiresAt
        +Date createdAt
    }

    %% ═══════════════════════════════════════
    %% USER SERVICE — user_db
    %% ═══════════════════════════════════════
    class Profile {
        <<user_db>>
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
        <<embedded in Profile>>
        +ObjectId skillId
        +String skillName
        +Date selectedAt
    }

    %% ═══════════════════════════════════════
    %% QUESTION BANK SERVICE — question_bank_db
    %% ═══════════════════════════════════════
    class Skill {
        <<question_bank_db>>
        +ObjectId _id
        +String name
        +String category
        +Boolean isActive
        +Date createdAt
    }

    class Question {
        <<question_bank_db>>
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
        <<embedded in Question>>
        +String[] allowedLanguages
        +String starterCode
        +TestCase[] testCases
    }

    class TestCase {
        <<embedded in CodingMeta>>
        +String input
        +String expectedOutput
        +Boolean isHidden
    }

    %% ═══════════════════════════════════════
    %% ASSESSMENT SERVICE — assessment_db
    %% ═══════════════════════════════════════
    class TestSession {
        <<assessment_db>>
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
        <<embedded in TestSession>>
        +ObjectId questionId
        +String type
        +Number orderIndex
        +Number maxScore
    }

    %% ═══════════════════════════════════════
    %% PROCTORING SERVICE — proctoring_db
    %% ═══════════════════════════════════════
    class ProctoringEvent {
        <<proctoring_db>>
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +String eventType
        +String severity
        +String snapshotUrl
        +Date timestamp
    }

    class ViolationCounter {
        <<proctoring_db>>
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +Number totalWarnings
        +String status
        +Date lastUpdatedAt
    }

    %% ═══════════════════════════════════════
    %% SUBMISSION SERVICE — submission_db
    %% ═══════════════════════════════════════
    class Submission {
        <<submission_db>>
        +ObjectId _id
        +ObjectId testSessionId
        +ObjectId userId
        +Answer[] answers
        +Date submittedAt
        +String evaluationStatus
    }

    class Answer {
        <<embedded in Submission>>
        +ObjectId questionId
        +String questionType
        +String answer
        +String code
        +String language
        +Number timeTakenSeconds
    }

    %% ═══════════════════════════════════════
    %% RESULT SERVICE — result_db
    %% ═══════════════════════════════════════
    class Result {
        <<result_db>>
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

    %% ═══════════════════════════════════════
    %% NOTIFICATION SERVICE — notification_db
    %% ═══════════════════════════════════════
    class Notification {
        <<notification_db>>
        +ObjectId _id
        +ObjectId userId
        +String type
        +String channel
        +String message
        +String status
        +Date sentAt
        +Date createdAt
    }

    %% ═══════════════════════════════════════
    %% RELATIONSHIPS
    %% ═══════════════════════════════════════

    %% auth_db
    User "1" --> "0..*" RefreshToken : has

    %% user_db
    Profile "1" --> "0..*" SkillRef : selectedSkills

    %% question_bank_db
    Skill "1" --> "0..*" Question : has
    Question "1" --> "0..1" CodingMeta : has
    CodingMeta "1" --> "0..*" TestCase : contains

    %% assessment_db
    TestSession "1" --> "0..*" QuestionRef : contains

    %% proctoring_db
    TestSession "1" --> "0..*" ProctoringEvent : generates
    TestSession "1" --> "1" ViolationCounter : tracked by

    %% submission_db
    Submission "1" --> "0..*" Answer : contains

    %% cross-service references (ObjectId only — no joins)
    Profile ..> User : userId ref
    SkillRef ..> Skill : skillId ref
    TestSession ..> User : userId ref
    QuestionRef ..> Question : questionId ref
    ProctoringEvent ..> TestSession : testSessionId ref
    ViolationCounter ..> TestSession : testSessionId ref
    Submission ..> TestSession : testSessionId ref
    Result ..> Submission : testSessionId ref
    Notification ..> User : userId ref
```


## Cross-Service Reference Rules

> Since each service has its own database, these are **reference-only** — no joins happen at the DB level.
> The owning service is responsible for fetching related data via HTTP when needed.

| Reference (stored as ObjectId) | Stored In | Owned By |
|---|---|---|
| `userId` | Profile, TestSession, ProctoringEvent, ViolationCounter, Submission, Result, Notification | Auth Service |
| `skillId` | SkillRef (in Profile), TestSession.skillsSelected | Question Bank Service |
| `questionId` | QuestionRef (in TestSession), Answer (in Submission) | Question Bank Service |
| `testSessionId` | ProctoringEvent, ViolationCounter, Submission, Result | Assessment Service |



## Enum Values Reference

| Model | Field | Allowed Values |
|---|---|---|
| User | role | `candidate` · `admin` |
| User | experienceLevel | `fresher` · `experienced` |
| Question | type | `mcq` · `technical` · `coding` |
| Question | difficulty | `easy` · `medium` · `hard` |
| Question | experienceLevel | `fresher` · `experienced` · `both` |
| TestSession | status | `created` · `permission_pending` · `in_progress` · `submitted` · `terminated` · `expired` |
| ProctoringEvent | eventType | `face_not_detected` · `multiple_faces` · `tab_switch` · `noise_detected` · `no_camera` |
| ProctoringEvent | severity | `low` · `medium` · `high` |
| ViolationCounter | status | `active` · `warned` · `barred` |
| Submission | evaluationStatus | `pending` · `in_progress` · `completed` · `failed` |
| Result | verdict | `pass` · `fail` |
| Notification | type | `warning` · `submission_received` · `result_ready` |
| Notification | channel | `email` · `push` |
| Notification | status | `queued` · `sent` · `failed` |