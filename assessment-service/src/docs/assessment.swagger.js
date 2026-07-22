/**
 * @swagger
 * tags:
 *   name: Assessments
 *   description: Assessment Management APIs
 */

/**
 * @swagger
 * /api/assessments/start:
 *   post:
 *     summary: Start a new assessment
 *     description: Creates a new assessment, generates AI-powered questions, stores the assessment snapshot, and returns the questions to the candidate.
 *     tags: [Assessments]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - difficulty
 *               - distribution
 *
 *             properties:
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - easy
 *                   - medium
 *                   - hard
 *                 example: medium
 *
 *               durationMinutes:
 *                 type: integer
 *                 example: 60
 *
 *               distribution:
 *                 type: object
 *
 *                 required:
 *                   - mcq
 *                   - technical
 *                   - coding
 *
 *                 properties:
 *
 *                   mcq:
 *                     type: integer
 *                     example: 10
 *
 *                   technical:
 *                     type: integer
 *                     example: 5
 *
 *                   coding:
 *                     type: integer
 *                     example: 5
 *
 *     responses:
 *
 *       201:
 *         description: Assessment started successfully.
 *
 *       400:
 *         description: Validation failed.
 *
 *       401:
 *         description: Unauthorized.
 *
 *       409:
 *         description: Candidate already has an assessment in progress.
 *
 *       503:
 *         description: Failed to communicate with dependent services.
 */

/**
 * @swagger
 * /api/assessments/{assessmentId}/answer:
 *   post:
 *     summary: Save Candidate Answer
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - questionId
 *
 *             properties:
 *
 *               questionId:
 *                 type: string
 *
 *               selectedAnswer:
 *                 type: string
 *
 *               codingSubmission:
 *                 type: string
 *
 *               markedForReview:
 *                 type: boolean
 *
 *     responses:
 *       200:
 *         description: Answer saved successfully.
 */

/**
 * @swagger
 * /api/assessments/{assessmentId}:
 *   get:
 *     summary: Get Assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Assessment fetched successfully.
 */

/**
 * @swagger
 * /api/assessments/{assessmentId}/submit:
 *   post:
 *     summary: Submit Assessment
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Assessment submitted successfully.
 */

/**
 * @swagger
 * /api/assessments/history:
 *   get:
 *     summary: Get Assessment History
 *     tags: [Assessments]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Assessment history fetched successfully.
 */