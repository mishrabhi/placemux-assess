### Questions are generated/trained by the AI/ML & Data team. We should not manually push questions into our database.

* It should look like:
```
                   AIML Team
                      |
                      |
        AI Model / Inference Service
                      |
          (REST API / gRPC / Queue)
                      |
                      v
           Question Bank Service
                      |
             Business Logic Layer
                      |
              Assessment Service
                      |
                   Candidate
```

* responsibility of Question Bank Service?

I would redefine it as:

- Knows which skills exist.
- Knows which AI model to call.
- Knows how many questions to request.
- Validates the AI response.
- Converts AI output into a standard internal format.
- Caches questions if necessary.
- Returns questions to Assessment Service.

### What should be stored in MongoDB?
We would not store every generated question.
Instead, store only metadata.

For example:

Skill
------
Node.js

React

MongoDB

Python

Java

and

AIModel
--------

modelName

version

endpoint

supportedSkills

isActive

timeout

priority

Example:
```
{
  "modelName": "Question Generator v2",

  "endpoint":
  "http://aiml-service/generate",

  "supportedSkills":[
      "Node.js",
      "Express"
  ],

  "version":"2.1"
}
```
Then what happens when a student starts a test?

Example:
```
Student

Skills

Node.js

Express

MongoDB

Experience

Fresher
```

Assessment Service says:

I need

20 questions

Node

Easy

Fresher

Instead of MongoDB...

Question Bank Service calls
```
POST /generate-questions
```
to AI.

Request:
```
{
  "skill":"Node.js",

  "difficulty":"easy",

  "experience":"fresher",

  "count":20
}
```

AI returns:
```
{
  "questions":[

      ...

  ]
}
```
```
Question Bank validates

↓

returns to Assessment Service

↓

Assessment Service creates the assessment.
```

Should we store AI generated questions?

My answer is: Short answer = Yes

but not always.

Best Option:
Cache only.
```
Redis

↓

Expiry

30 min

↓

Delete
```

Reason:

Next candidate requesting
```
Node

Easy

Fresher
```
doesn't hit AI again.


### What this service really doing:
Recommend one final adjustment before we continue coding:

- Assessment Service should own candidate lookup and orchestration.
- Question Bank Service should stay focused on generating questions from a supplied assessment specification.
- The frontend never sends skills or experience directly; it only requests that an assessment be started.
- The Assessment Service derives the candidate's skills and experience from the User Service, decides the assessment blueprint (counts, distribution, etc.), and sends that blueprint to the Question Bank Service.
- The Question Bank Service validates the blueprint, calls the AI model, normalizes the AI response, and returns questions.