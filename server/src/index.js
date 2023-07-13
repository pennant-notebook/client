const express = require("express");
var cors = require("cors");

const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "../dist")));

app.get(["/", "/*"], function (req, res, next) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () =>
  console.log(`Snack OverFlow Server listening on port: ${PORT}`)
);
