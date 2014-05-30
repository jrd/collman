var express = require('express');
var router = express.Router();
var mocks = require('../lib/mocks');
var dao = require('../lib/dao');

/////////////////////////////
// MOVIES ///////////////////
/////////////////////////////

router.get('/list/movies/:name', function(req, res) {
  var db = dao.selectDb('movie', req.params.name);
  var json = mocks.moviesCollection;
  json.name = req.params.name;
  res.json(json);
});

router.get('/get/movie/:name/:id', function(req, res) {
  var db = dao.selectDb('movie', req.params.name);
  dao.findMovie(db, req.params.id, function(movie) {
    var json;
    if (movie) {
      json = movie;
    } else {
      json = mocks.movie;
      json.id = req.params.id;
    }
    res.json(json);
  });
});

module.exports = router;
