const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const router = require("./routes/subdir");

const PORT = process.env.PORT || 3500;

// Custom middleware
app.use(logger);

// we will use cors after the logger
const allowedOrigins = [
  "http://localhost:3500",
  "https://www.google.com",
  "localhost:3500",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Built in middleware to handle urlencoded data
// In other words, form data
// "content-type": application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Built in middlweare for json
app.use(express.json());

// Serve statis files
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", express.static(path.join(__dirname, "/public")));
// app.use("/subdir", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.all("*", (req, res) => {
  res.status(400);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
