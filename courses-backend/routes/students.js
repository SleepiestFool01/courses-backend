var express = require("express");
var router = express.Router();

function validate(course) {
  var errorMessage = "[";

  if (course.id == null || course.id.length == 0) {
    errorMessage +=
      '{"attributeName":"id" , "message":"Must have id"}';
  }
  if (course.semester == null || course.semester.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"semester", "message":"Must have semester"}';
  }
  if (course.dept == null || course.dept.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage +=
      '{"attributeName":"dept" , "message":"Must have dept"}';
  }
  if (course.number == null || course.number.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"number" , "message":"Must have number code"}';
  }
  if (course.name == null || course.name.length == 0) {
    if (errorMessage.length > 1) errorMessage += ",";
    errorMessage += '{"attributeName":"name" , "message":"Must have name"}';
  }
  errorMessage += "]";
  return errorMessage;
}

/* GET course listing. */
router.get("/", function(req, res, next) {
  var offset;
  var limit;
  if (req.query.page == null) offset = 0;
  else offset = parseInt(req.query.page);
  if (req.query.per_page == null) limit = 20;
  else limit = parseInt(req.query.per_page);
  res.locals.connection.query(
    "SELECT * FROM course LIMIT ? OFFSET ?",
    [limit, offset],
    function(error, results, fields) {
      if (error) {
        res.status(500);
        res.send(JSON.stringify({ status: 500, error: error, response: null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.status(200);
        res.send(JSON.stringify(results));
        //If there is no error, all is good and response is 200OK.
      }
      res.locals.connection.end();
    }
  );
});
router.get("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("SELECT * FROM course WHERE id=?", id, function(
    error,
    results,
    fields
  ) {
    if (error) {
      res.status(500);
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.status(200);
      res.send(JSON.stringify(results));
      //If there is no error, all is good and response is 200OK.
    }
    res.locals.connection.end();
  });
});
router.put("/:id", function(req, res, next) {
  var id = req.params.id;
  var course = req.body;
  let errorMessage = validate(course);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "UPDATE course SET ? WHERE id=?",
      [req.body, id],
      function(error, results) {
        if (error) {
          res.status(500);
          res.send(
            JSON.stringify({ status: 500, error: error, response: null })
          );
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.status(200);
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
          //If there is no error, all is good and response is 200OK.
        }
        res.locals.connection.end();
      }
    );
  }
});
router.post("/", function(req, res, next) {
  var course = req.body;
  let errorMessage = validate(course);
  if (errorMessage.length > 2) {
    res.status(406);
    res.send(errorMessage);
  } else {
    res.locals.connection.query(
      "INSERT INTO course SET ? ",
      req.body,
      function(error, results) {
        if (error) {
          res.status(500);
          res.send(
            JSON.stringify({ status: 500, error: error, response: null })
          );
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.status(200);
          res.send(
            JSON.stringify({ status: 200, error: null, response: results })
          );
          //If there is no error, all is good and response is 200OK.
        }
        res.locals.connection.end();
      }
    );
  }
});

router.delete("/:id", function(req, res, next) {
  var id = req.params.id;
  res.locals.connection.query("DELETE FROM course WHERE id=?", id, function(
    error,
    results
  ) {
    if (error) {
      res.status = 500;
      res.send(JSON.stringify({ status: 500, error: error, response: null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.status = 200;
      res.send(JSON.stringify({ status: 200, error: null, response: results }));
      //If there is no error, all is good and response is 200OK.
    }
    res.locals.connection.end();
  });
});
module.exports = router;
