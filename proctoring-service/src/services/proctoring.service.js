import axios from "axios";
import ProctoringEvent from "../models/proctoringEvent.model.js";
import ViolationCounter from "../models/violationCounter.model.js";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

const WARNING_THRESHOLDS = {
  low: 1,
  medium: 2,
  high: 3,
};

const TERMINATION_THRESHOLD = 3;

class ProctoringService {
  async handleViolationEvent(payload) {
    const { assessmentId, candidateId, eventType, severity, message, snapshotUrl } = payload;

    const proctoringEvent = await ProctoringEvent.create({
      assessmentId,
      candidateId,
      eventType,
      severity,
      message,
      snapshotUrl,
    });

    const counter = await this.incrementViolationCounter({
      assessmentId,
      candidateId,
      severity,
    });

    const terminated = counter.totalWarnings >= TERMINATION_THRESHOLD;
    const emittedWarning = counter.totalWarnings > 0 && !terminated;
    const status = terminated ? "barred" : counter.status;

    if (terminated) {
      await this.terminateAssessment(assessmentId);
    }

    return {
      proctoringEvent,
      totalWarnings: counter.totalWarnings,
      status,
      emittedWarning,
      terminated,
      message: terminated
        ? "Assessment terminated due to repeated proctoring violations."
        : "Warning: suspicious behavior detected.",
    };
  }

  async incrementViolationCounter({ assessmentId, candidateId, severity }) {
    const update = {
      $inc: {
        totalViolations: 1,
      },
      $set: {
        candidateId,
        lastViolationAt: new Date(),
      },
    };

    const counter = await ViolationCounter.findOneAndUpdate(
      { assessmentId },
      update,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    const warningDelta = severity === "high" ? 2 : severity === "medium" ? 1 : 1;
    counter.totalWarnings += warningDelta;

    if (counter.totalWarnings >= TERMINATION_THRESHOLD) {
      counter.status = "barred";
    } else if (counter.totalWarnings >= WARNING_THRESHOLDS.medium) {
      counter.status = "warned";
    }

    await counter.save();

    return counter;
  }

  async terminateAssessment(assessmentId) {
    try {
      await axios.patch(
        `${env.assessmentServiceUrl}/api/assessments/${assessmentId}/terminate`,
        {},
        {
          timeout: env.requestTimeout,
          headers: {
            Authorization: `Bearer ${env.serviceToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Unable to terminate assessment:", error.message);
    }
  }

  async getViolationStatus(assessmentId) {
    const counter = await ViolationCounter.findOne({ assessmentId });

    if (!counter) {
      return {
        assessmentId,
        status: "active",
        totalWarnings: 0,
        totalViolations: 0,
      };
    }

    return {
      assessmentId: counter.assessmentId,
      status: counter.status,
      totalWarnings: counter.totalWarnings,
      totalViolations: counter.totalViolations,
      lastViolationAt: counter.lastViolationAt,
    };
  }
}

export default new ProctoringService();
