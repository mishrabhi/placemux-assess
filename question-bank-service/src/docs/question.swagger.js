/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question Bank APIs
 */


/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create Manual Question
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
 *                 example: What is Express.js middleware?
 *
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Function
 *                   - Variable
 *                   - Database
 *                   - Package
 *
 *               correctAnswer:
 *                 type: string
 *                 example: Function
 *
 *               explanation:
 *                 type: string
 *                 example: Middleware is a function executed between request and response.
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - express
 *                   - middleware
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
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/ai-import:
 *   post:
 *     summary: Import AI Generated Questions
 *     tags: [Questions]
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
 *
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
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                       example: 0.95
 *
 *     responses:
 *
 *       201:
 *         description: AI Questions Imported Successfully
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
 * /api/questions:
 *   get:
 *     summary: Get Filtered Questions
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
 *         description: Internal server error
 *
 * /**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question Bank APIs
 */


/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create Manual Question
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
 *                 example: What is Express.js middleware?
 *
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Function
 *                   - Variable
 *                   - Database
 *                   - Package
 *
 *               correctAnswer:
 *                 type: string
 *                 example: Function
 *
 *               explanation:
 *                 type: string
 *                 example: Middleware is a function executed between request and response.
 *
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - express
 *                   - middleware
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
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/questions/ai-import:
 *   post:
 *     summary: Import AI Generated Questions
 *     tags: [Questions]
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
 *
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
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
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
 *                       example: 0.95
 *
 *     responses:
 *
 *       201:
 *         description: AI Questions Imported Successfully
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
 * /api/questions:
 *   get:
 *     summary: Get Filtered Questions
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
 *         description: Internal server error
 */