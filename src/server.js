import app from "./app.js";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("listing on port 8080");
});
