import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
import v1 from "./routes/v1.js";

mongoose.connect(
  process.env.DBCONNECTION_LINK || "mongodb://localhost:27017/mydb",
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("connected to DB!");
  }
);

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/v1/", v1);

export default app;
