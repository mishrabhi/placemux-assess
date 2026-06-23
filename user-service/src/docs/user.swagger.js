/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Profile APIs
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Profile fetched successfully
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
 *         description: Profile not found
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Users]
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
 *               fullName:
 *                 type: string
 *                 example: Abhishek Mishra
 *
 *               phone:
 *                 type: string
 *                 example: 9876543210
 *
 *               yearsOfExperience:
 *                 type: number
 *                 example: 2
 *
 *               resumeUrl:
 *                 type: string
 *                 example: https://s3.amazonaws.com/resume.pdf
 *
 *     responses:
 *
 *       200:
 *         description: Profile updated successfully
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
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/profile/skills:
 *   post:
 *     summary: Add skills to profile
 *     tags: [Users]
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
 *               skills:
 *                 type: array
 *
 *                 items:
 *                   type: object
 *
 *                   properties:
 *
 *                     skillId:
 *                       type: string
 *                       example: 687f43da7abf2bc1234
 *
 *                     skillName:
 *                       type: string
 *                       example: Node.js
 *
 *     responses:
 *
 *       200:
 *         description: Skills added successfully
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal server error
 */
