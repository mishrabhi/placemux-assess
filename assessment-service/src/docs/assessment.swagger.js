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