import mongoose from "mongoose";

import { v1 as uuidv1 } from "uuid";

const ReportDetailSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  marketID: {
    type: String,
    required: true,
  },
  marketName: {
    type: String,
    required: true,
  },
  cmdtyID: {
    type: String,
    required: true,
  },
  cmdtyName: {
    type: String,
    required: true,
  },
  priceUnit: {
    type: String,
    required: true,
  },
  convFctr: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export { ReportDetailSchema };

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
  reportDetails: [ReportDetailSchema],
});

export default mongoose.model("Report", ReportSchema);
