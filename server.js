const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const polls = require("./routes/api/polls");
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello"));

// Use routes
app.use("/api/users", users);
app.use("/api/polls", polls);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
