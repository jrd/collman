var express = require('express');
var router = express.Router();
var mocks = require('../lib/mocks');

/////////////////////////////
// MOVIES ///////////////////
/////////////////////////////

router.get('/list/movies/:name', function(req, res) {
  var json = mocks.moviesCollection;
  json.name = req.params.name;
  res.json(json);
});
router.get('/get/movie/:id', function(req, res) {
  var json = mocks.movie;
  json.id = req.params.id;
  res.json(json);
});

module.exports = router;
