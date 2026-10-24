
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Management System API is running!");
});

app.use("/api/students", require("./routes/studentRoutes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
