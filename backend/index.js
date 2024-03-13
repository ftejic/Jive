const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require("./config/db");

const app = express();
const port = 5000;

dotenv.config();
connectToDB();

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});