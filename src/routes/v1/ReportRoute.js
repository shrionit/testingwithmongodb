import express from "express";
import ReportService from "../../services/ReportService.js";

const report = express.Router();

report.get("", async (req, res) => {
  let out = {};
  out = await ReportService.get(req);
  res.json(out);
});

report.post("", async (req, res) => {
  let out = {};
  out = await ReportService.create(req);
  res.json(out);
});

export default report;
