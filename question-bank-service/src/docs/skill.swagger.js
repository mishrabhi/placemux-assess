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
 *     responses:
 *       201:
 *         description: Skill created successfully
 *
 *       409:
 *         description: Skill already exists
 */


/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get All Skills
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Skills fetched successfully
 */


/**
 * @swagger
 * /api/skills/{id}:
 *   delete:
 *     summary: Delete Skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Skill deleted successfully
 */