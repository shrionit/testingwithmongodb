import express from "express";
import V1Map from "./v1/V1Map.js";

const v1 = express.Router();

// mapping routes
Object.entries(V1Map).forEach(([k, v]) => {
  v1.use(k, v);
});

// list all routes
v1.get("/", (req, res) => {
  res.send(Object.keys(V1Map));
});

export default v1;
