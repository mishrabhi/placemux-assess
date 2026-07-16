/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill Management APIs
 */

/**
 * @swagger
 * /api/skills:
 *   post:
 *     summary: Create Skill
 *     tags: [Skills]
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
 *               - name
 *               - category
 *
 *             properties:
 *
 *               name:
 *                 type: string
 *                 example: Node.js
 *
 *               category:
 *                 type: string
 *                 example: Backend
 *
 *     responses:
 *
 *       201:
 *         description: Skill created successfully
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
 *         description: Skill already exists
 *
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get All Skills
 *     tags: [Skills]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Skills fetched successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       500:
 *         description: Internal Server Error
 */


/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete Skill
 *     tags: [Skills]
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
 *     responses:
 *
 *       200:
 *         description: Skill deleted successfully
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Admin access required
 *
 *       404:
 *         description: Skill not found
 *
 *       500:
 *         description: Internal Server Error
 */