const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");

const PORT = process.env.PORT || 3500;

// Custom middleware
app.use(logger);

// Built in middleware to handle urlencoded data
// In other words, form data
// "content-type": application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Built in middlweare for json
app.use(express.json());

// Serve statis files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page");
});

app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Attempted to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// Chaining route handlers
const one = (req, res, next) => {
  console.log("One");
  next();
};

const two = (req, res, next) => {
  console.log("Two");
  next();
};

const three = (req, res) => {
  console.log("Three");
  res.send("Finished");
};

// [providind handlers in an array]
app.get("/chain(.html)?", [one, two, three]);

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
