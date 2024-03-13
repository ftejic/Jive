const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const port = 5000;

dotenv.config();
app.use(express.json());
connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
