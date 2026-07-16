/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question CRUD APIs
 */

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create Manual Question
 *     description: Create a new manual question. Only admins can create questions.
 *     tags: [Questions]
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
 *               - skillId
 *               - type
 *               - difficulty
 *               - questionText
 *               - correctAnswer
 *
 *             properties:
 *
 *               skillId:
 *                 type: string
 *                 example: nodejs
 *
 *               type:
 *                 type: string
 *                 enum:
 *                   - mcq
 *                   - technical
 *                   - coding
 *                 example: mcq
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - easy
 *                   - medium
 *                   - hard
 *                 example: medium
 *
 *               experienceLevel:
 *                 type: string
 *                 enum:
 *                   - fresher
 *                   - experienced
 *                   - both
 *                 example: fresher
 *
 *               questionText:
 *                 type: string
 *                 example: What is Express Middleware?
 *
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Function
 *                   - Variable
 *                   - Package
 *                   - Class
 *
 *               correctAnswer:
 *                 type: string
 *                 example: Function
 *
 *               explanation:
 *                 type: string
 *                 example: Middleware is a function executed during request processing.
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - express
 *                   - backend
 *
 *               maxScore:
 *                 type: number
 *                 example: 10
 *
 *               timeLimitSeconds:
 *                 type: number
 *                 example: 60
 *
 *     responses:
 *
 *       201:
 *         description: Question created successfully
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
 *       409:
 *         description: Question already exists
 *
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get Filtered Questions
 *     description: Returns approved questions based on filters.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: skillId
 *         schema:
 *           type: string
 *         example: nodejs
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - mcq
 *             - technical
 *             - coding
 *
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum:
 *             - easy
 *             - medium
 *             - hard
 *
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum:
 *             - fresher
 *             - experienced
 *             - both
 *
 *     responses:
 *
 *       200:
 *         description: Questions fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get Question By ID
 *     description: Fetch a single question using its ID.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
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
 *         description: Question fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Question not found
 *
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update Question
 *     description: Update an existing question. Only administrators can update questions.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 687f43da7abf2bc123456789
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *
 *               skillId:
 *                 type: string
 *                 example: nodejs
 *
 *               type:
 *                 type: string
 *                 enum:
 *                   - mcq
 *                   - technical
 *                   - coding
 *
 *               difficulty:
 *                 type: string
 *                 enum:
 *                   - easy
 *                   - medium
 *                   - hard
 *
 *               experienceLevel:
 *                 type: string
 *                 enum:
 *                   - fresher
 *                   - experienced
 *                   - both
 *
 *               questionText:
 *                 type: string
 *                 example: Explain Event Loop in Node.js
 *
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *               correctAnswer:
 *                 type: string
 *
 *               explanation:
 *                 type: string
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *
 *               maxScore:
 *                 type: number
 *
 *               timeLimitSeconds:
 *                 type: number
 *
 *     responses:
 *
 *       200:
 *         description: Question updated successfully
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
 *       404:
 *         description: Question not found
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Soft Delete Question
 *     description: Marks a question as inactive instead of permanently deleting it.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
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
 *         description: Question deleted successfully
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
 * /api/questions/search:
 *   get:
 *     summary: Search Questions
 *     description: Search questions using full-text search.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: q
 *         required: true
 *
 *         schema:
 *           type: string
 *
 *         example: express middleware
 *
 *     responses:
 *
 *       200:
 *         description: Search completed successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/random:
 *   get:
 *     summary: Get Random Questions
 *     description: Returns random approved questions based on provided filters. Intended for Assessment Service.
 *     tags: [Questions]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *
 *       - in: query
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *         example: nodejs
 *
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum:
 *             - easy
 *             - medium
 *             - hard
 *
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum:
 *             - fresher
 *             - experienced
 *             - both
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - mcq
 *             - technical
 *             - coding
 *
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 10
 *
 *     responses:
 *
 *       200:
 *         description: Random questions fetched successfully
 *
 *       400:
 *         description: Invalid query parameters
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */