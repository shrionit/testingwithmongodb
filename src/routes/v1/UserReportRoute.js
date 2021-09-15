import express from "express";
import UserReportService from "../../services/UserReportService.js";

const userreport = express.Router();

userreport.get("", async (req, res) => {
  let out = {};
  out = await UserReportService.get(req);
  res.json(out);
});

// userreport.post("", async (req, res) => {
//   let out = {};
//   out = await UserReportService.create(req);
//   res.json(out);
// });

export default userreport;
