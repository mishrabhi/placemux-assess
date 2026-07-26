/**
 * @swagger
 * tags:
 *   name: AI Questions
 *   description: AI Powered Question Generation APIs
 */

/**
 * @swagger
 * /api/questions/generate:
 *   post:
 *     summary: Generate Assessment Questions
 *     description: Generates assessment questions using the configured AI model based on the assessment blueprint.
 *     tags: [AI Questions]
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
 *             required:
 *               - assessmentId
 *               - candidateId
 *               - skills
 *               - experienceLevel
 *               - difficulty
 *               - distribution
 *             properties:
 *               assessmentId:
 *                 type: string
 *                 example: assess_001
 *               candidateId:
 *                 type: string
 *                 example: candidate_001
 *               experienceLevel:
 *                 type: string
 *                 enum:
 *                   - fresher
 *                   - experienced
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - easy
 *                   - medium
 *                   - hard
 *               skills:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     skillId:
 *                       type: string
 *                       example: nodejs
 *                     skillName:
 *                       type: string
 *                       example: Node.js
 *                     weight:
 *                       type: number
 *                       example: 40
 *               distribution:
 *                 type: object
 *                 properties:
 *                   mcq:
 *                     type: number
 *                     example: 10
 *                   technical:
 *                     type: number
 *                     example: 5
 *                   coding:
 *                     type: number
 *                     example: 5
 *     responses:
 *       200:
 *         description: Questions generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation failed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: AI Service unavailable.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */