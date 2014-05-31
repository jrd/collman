var express = require('express');
var router = express.Router();
var mocks = require('../lib/mocks');
var dao = require('../lib/dao');
var P = require('promised-io/promise');

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
  dao.findMovie(db, req.params.id).then(
    function(json) {
      if (json === null) {
        json = mocks.movie;
        json.id = parseInt(req.params.id);
        json.title = json.title + ' (Mock)';
      }
      res.json(json);
    }, function(err) {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
