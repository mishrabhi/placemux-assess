/**
 * @swagger
 * tags:
 *   name: Proctoring
 *   description: Proctoring and live test monitoring endpoints
 */

/**
 * @swagger
 * /api/proctoring/event:
 *   post:
 *     tags: [Proctoring]
 *     summary: Log a proctoring violation event
 *     description: Logs a client-side proctoring event and returns warning/termination status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assessmentId
 *               - candidateId
 *               - eventType
 *               - severity
 *             properties:
 *               assessmentId:
 *                 type: string
 *               candidateId:
 *                 type: string
 *               eventType:
 *                 type: string
 *                 enum: [face_not_detected, multiple_faces, tab_switch, noise_detected, no_camera, mic_disabled, blur_window, unauthorized_app]
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *               message:
 *                 type: string
 *               snapshotUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Proctoring event logged successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request payload.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/proctoring/{assessmentId}/status:
 *   get:
 *     tags: [Proctoring]
 *     summary: Get current proctoring status for an assessment
 *     parameters:
 *       - in: path
 *         name: assessmentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Assessment identifier
 *     responses:
 *       200:
 *         description: Proctoring status fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Status not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
