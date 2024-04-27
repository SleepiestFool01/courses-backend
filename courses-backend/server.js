var express = require("express");
var cors = require("cors");
var coursesRouter = require("./routes/courses");

var app = express();

const cor = cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
});
app.use(cor);
app.options("*", cor);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
var mysql = require("mysql");
app.use(function (req, res, next) {
  res.locals.connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "student",
  });
  res.locals.connection.connect();
  next();
});

app.use("/courses", coursesRouter);
// set port, listen for requests
const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}

module.exports = app;
