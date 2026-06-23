/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - experienceLevel
 *             properties:
 *               email:
 *                 type: string
 *                 example: abhi@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               experienceLevel:
 *                 type: string
 *                 enum:
 *                   - fresher
 *                   - experienced
 *                 example: fresher
 *
 *     responses:
 *
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Validation failed
 *
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: User already exists
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: abhi@gmail.com
 *
 *               password:
 *                 type: string
 *                 example: password123
 *
 *     responses:
 *
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Validation failed
 *
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid email or password
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */


/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *
 *     responses:
 *
 *       200:
 *         description: Token refreshed successfully
 *
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid or expired refresh token
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */


/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *
 *     responses:
 *
 *       200:
 *         description: Logout successful
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Internal server error
 */
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: User fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Unauthorized
 *
 *       404:
 *         description: User not found
 *
 *       500:
 *         description: Internal server error
 */