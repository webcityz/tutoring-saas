import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    // User who performed the action (optional for system actions)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Action type (CRUD + custom actions)
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "VIEW",
        "PAYMENT",
        "ENROLL",
        "OTHER",
      ],
    },

    // Entity name (Course, Lesson, User, Payment, etc.)
    entity: {
      type: String,
      required: true,
      trim: true,
    },

    // ID of the affected entity
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Request & response metadata
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Request origin info
    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
    },

    // Result of the action
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS",
    },

    // Error message (if any)
    errorMessage: {
      type: String,
      default: null,
    },

    // Optional: request tracing (useful for microservices)
    requestId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔎 Indexes for performance
auditSchema.index({ userId: 1 });
auditSchema.index({ entity: 1, entityId: 1 });
auditSchema.index({ action: 1 });
auditSchema.index({ createdAt: -1 });

// Export model
const Audit = mongoose.model("Audit", auditSchema);
export default Audit;


