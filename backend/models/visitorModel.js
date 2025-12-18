import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, unique: true },
    visits: { type: Number, default: 1 },
    lastVisitedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const visitorModel =
  mongoose.models.visitor || mongoose.model("visitor", visitorSchema);

export default visitorModel;
