const express = require("express");
const app = express();
require("dotenv").config();
require("./config/dbConfig");
const cors = require("cors");

const checkIndiaIp = require("./middlewares/ipinfo");
app.use(checkIndiaIp);

app.use(express.json());
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  if (req.isIndia) {
    res.sendFile(__dirname + "/public/index.html");
  } else {
    res.send("Access is denied. Allowed country - India");
  }
});
app.use("/register", require("./routes/auth"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
