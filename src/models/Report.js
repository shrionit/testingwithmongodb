import mongoose from "mongoose";

import { v1 as uuidv1 } from "uuid";

const ReportSchema = mongoose.Schema({
  _id: {
    type: String,
    default: function genUUID() {
      return uuidv1();
    },
  },
  users: {
    type: Array,
    default: [],
  },
  priceUnit: {
    type: String,
    default: "Kg",
  },
  price: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Number,
    default: function () {
      return Date.now();
    },
  },
  reportDetails: [{ type: mongoose.Schema.ObjectId, ref: "UserReport" }],
});

export default mongoose.model("Report", ReportSchema);
