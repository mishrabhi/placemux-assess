/**
 * @swagger
 * tags:
 *   - name: Evaluations
 *     description: Assessment Evaluation APIs
 */

/**
 * @swagger
 * /api/evaluations/evaluate:
 *   post:
 *     summary: Evaluate a submitted assessment
 *     tags: [Evaluations]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *
 *           schema:
 *             type: object
 *
 *             required:
 *               - assessmentId
 *
 *             properties:
 *
 *               assessmentId:
 *                 type: string
 *                 example: ASM-20260722-A91D82F7
 *
 *     responses:
 *       201:
 *         description: Assessment evaluated successfully.
 *
 *       404:
 *         description: Assessment not found.
 *
 *       409:
 *         description: Assessment already evaluated.
 */

/**
 * @swagger
 * /api/evaluations/result/{assessmentId}:
 *   get:
 *     summary: Get candidate result
 *
 *     tags: [Evaluations]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Result fetched successfully.
 */