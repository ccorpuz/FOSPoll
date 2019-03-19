const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const polls = require("./routes/api/polls");

var http = require("http").Server(app);
var io = require("socket.io")(http);

const app = express();

//  Serve html pages
app.use(express.static("public"));

//  Passport middleware
app.use(passport.initialize());

//  Passport Config
require("./config/passport")(passport);

//  Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

// Use routes
app.use("/api/users", users);
app.use("/api/polls", polls);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
