const mongoose = require("mongoose");

const historySchema = mongoose.Schema(
  {
    // creating schema of mongoose
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // schemas of user id, language id, accuracy, score
    language_id: { type: String, required: true },
    score_percent: { type: Number, required: true },
    accuracy: { type: String, required: true },
  },
  // noting the time 
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

module.exports = History;
