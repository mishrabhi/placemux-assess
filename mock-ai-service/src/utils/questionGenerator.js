const mcqTemplates = [
  {
    questionText: "What is Express.js primarily used for?",
    options: [
      "Backend Framework",
      "Database",
      "Programming Language",
      "Operating System",
    ],
    correctAnswer: "Backend Framework",
    explanation: "Express.js is a web framework for Node.js.",
  },

  {
    questionText: "Which method starts an Express server?",
    options: [
      "app.listen()",
      "app.start()",
      "server.run()",
      "express.start()",
    ],
    correctAnswer: "app.listen()",
    explanation: "app.listen() starts the HTTP server.",
  },

  {
    questionText: "Which keyword declares a constant in JavaScript?",
    options: [
      "const",
      "var",
      "let",
      "static",
    ],
    correctAnswer: "const",
    explanation: "const creates block scoped constants.",
  },
];

const technicalTemplates = [
  {
    questionText: "Explain middleware in Express.js.",
    correctAnswer:
      "Middleware functions execute during the request-response lifecycle.",
    explanation:
      "They can modify request, response or terminate the request.",
  },

  {
    questionText: "Explain Event Loop in Node.js.",
    correctAnswer:
      "Event Loop allows Node.js to perform non-blocking I/O.",
    explanation:
      "It continuously checks the callback queue.",
  },

  {
    questionText: "Difference between process.nextTick() and setImmediate().",
    correctAnswer:
      "nextTick executes before the next event loop phase.",
    explanation:
      "setImmediate executes during the check phase.",
  },
];

const codingTemplates = [
  {
    questionText:
      "Reverse a string without using built-in reverse().",

    starterCode:
`function reverseString(str){

}`,

    testCases: [
      {
        input: "hello",
        expectedOutput: "olleh",
      },
      {
        input: "placemux",
        expectedOutput: "xumecalp",
      },
    ],
  },

  {
    questionText:
      "Check whether a string is palindrome.",

    starterCode:
`function isPalindrome(str){

}`,

    testCases: [
      {
        input: "madam",
        expectedOutput: "true",
      },
      {
        input: "hello",
        expectedOutput: "false",
      },
    ],
  },
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateMockQuestions({
  skills,
  experienceLevel,
  difficulty,
  distribution,
}) {

  const questions = [];

  const createQuestion = (type, template) => {

    const skill = randomItem(skills);

    return {
      skillId: skill.skillId,
      skillName: skill.skillName,

      type,

      difficulty,

      experienceLevel,

      questionText: template.questionText,

      options: template.options || [],

      correctAnswer: template.correctAnswer || "",

      explanation: template.explanation || "",

      codingMeta:
        type === "coding"
          ? {
              allowedLanguages: [
                "javascript",
                "python",
                "java",
              ],

              starterCode: template.starterCode,

              testCases: template.testCases,
            }
          : null,

      maxScore:
        type === "coding" ? 30 : 10,

      timeLimitSeconds:
        type === "coding" ? 900 : 60,

      generatedBy: "Placemux Mock AI",

      modelVersion: "v1.0",

      confidence:
        Number((0.85 + Math.random() * 0.14).toFixed(2)),
    };

  };

  for (let i = 0; i < distribution.mcq; i++) {
    questions.push(
      createQuestion(
        "mcq",
        randomItem(mcqTemplates)
      )
    );
  }

  for (let i = 0; i < distribution.technical; i++) {
    questions.push(
      createQuestion(
        "technical",
        randomItem(technicalTemplates)
      )
    );
  }

  for (let i = 0; i < distribution.coding; i++) {
    questions.push(
      createQuestion(
        "coding",
        randomItem(codingTemplates)
      )
    );
  }

  return questions;
}