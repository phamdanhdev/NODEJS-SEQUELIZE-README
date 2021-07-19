const express = require("express");
const app = express();
const db = require("mysql2");
const apiRoutes = require("./routes/apiRoutes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", apiRoutes);

app.listen("3001", () => {
  console.log(`SERVER STARTED ON PORT 3001`);
});
