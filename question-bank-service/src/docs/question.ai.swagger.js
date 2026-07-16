/**
 * @swagger
 * tags:
 *   name: AI Question Review
 *   description: AI Question Import & Review APIs
 */

/**
 * @swagger
 * /api/questions/ai-import:
 *   post:
 *     summary: Import AI Generated Questions
 *     description: Import AI generated questions into the repository. Imported questions remain in pending state until reviewed.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               questions:
 *                 type: array
 *
 *                 items:
 *                   type: object
 *
 *                   required:
 *                     - skillId
 *                     - type
 *                     - difficulty
 *                     - questionText
 *                     - correctAnswer
 *                     - generatedBy
 *                     - modelVersion
 *                     - confidence
 *
 *                   properties:
 *
 *                     skillId:
 *                       type: string
 *                       example: nodejs
 *
 *                     type:
 *                       type: string
 *                       enum:
 *                         - mcq
 *                         - technical
 *                         - coding
 *
 *                     difficulty:
 *                       type: string
 *                       enum:
 *                         - easy
 *                         - medium
 *                         - hard
 *
 *                     experienceLevel:
 *                       type: string
 *                       enum:
 *                         - fresher
 *                         - experienced
 *                         - both
 *
 *                     questionText:
 *                       type: string
 *                       example: Which middleware parses JSON body?
 *
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *
 *                     correctAnswer:
 *                       type: string
 *
 *                     explanation:
 *                       type: string
 *
 *                     generatedBy:
 *                       type: string
 *                       example: Llama-3
 *
 *                     modelVersion:
 *                       type: string
 *                       example: v2.1
 *
 *                     confidence:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 1
 *                       example: 0.95
 *
 *     responses:
 *
 *       201:
 *         description: AI Questions imported successfully
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/pending:
 *   get:
 *     summary: Get Pending AI Questions
 *     description: Returns all AI-generated questions awaiting admin approval.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Pending questions fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/{id}/approve:
 *   patch:
 *     summary: Approve AI Question
 *     description: Approve a pending AI-generated question.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *         example: 687f43da7abf2bc123456789
 *
 *     responses:
 *
 *       200:
 *         description: Question approved successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Question not found
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/{id}/reject:
 *   patch:
 *     summary: Reject AI Question
 *     description: Reject a pending AI-generated question.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *         example: 687f43da7abf2bc123456789
 *
 *     responses:
 *
 *       200:
 *         description: Question rejected successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Question not found
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/bulk-approve:
 *   patch:
 *     summary: Bulk Approve Questions
 *     description: Approve multiple pending AI-generated questions in one request.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - questionIds
 *
 *             properties:
 *
 *               questionIds:
 *                 type: array
 *
 *                 items:
 *                   type: string
 *
 *                 example:
 *                   - 687f43da7abf2bc123456781
 *                   - 687f43da7abf2bc123456782
 *                   - 687f43da7abf2bc123456783
 *
 *     responses:
 *
 *       200:
 *         description: Questions approved successfully
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/bulk-reject:
 *   patch:
 *     summary: Bulk Reject Questions
 *     description: Reject multiple pending AI-generated questions in one request.
 *     tags: [AI Question Review]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - questionIds
 *
 *             properties:
 *
 *               questionIds:
 *                 type: array
 *
 *                 items:
 *                   type: string
 *
 *                 example:
 *                   - 687f43da7abf2bc123456781
 *                   - 687f43da7abf2bc123456782
 *                   - 687f43da7abf2bc123456783
 *
 *     responses:
 *
 *       200:
 *         description: Questions rejected successfully
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       500:
 *         description: Internal server error
 */