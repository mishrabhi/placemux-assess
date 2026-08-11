import ProctoringService from "../services/proctoring.service.js";
import { proctoringEventSchema } from "../validators/proctoring.validator.js";

const initializeProctoringSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("[socket] Client connected", socket.id);

    socket.on("violation", async (payload) => {
      const { error } = proctoringEventSchema.validate(payload, {
        abortEarly: false,
      });

      if (error) {
        socket.emit("error", {
          message: "Invalid proctoring event payload.",
          details: error.details.map((detail) => detail.message),
        });
        return;
      }

      try {
        const result = await ProctoringService.handleViolationEvent(payload);

        if (result.emittedWarning) {
          socket.emit("warning", {
            assessmentId: payload.assessmentId,
            message: result.message,
            totalWarnings: result.totalWarnings,
            status: result.status,
          });
        }

        if (result.terminated) {
          socket.emit("terminated", {
            assessmentId: payload.assessmentId,
            reason: result.message,
            status: result.status,
          });
        }
      } catch (error) {
        console.error("[socket] Violation handler failed", error.message);
        socket.emit("error", {
          message: "Proctoring event processing failed.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("[socket] Client disconnected", socket.id);
    });
  });
};

export default initializeProctoringSocket;
