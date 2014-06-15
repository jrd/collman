var express = require('express');
var router = express.Router();
var mocks = require('../lib/mocks');
var dao = require('../lib/movie_dao');

/////////////////////////////
// MOVIES ///////////////////
/////////////////////////////

router.get('/list/movies/:name', function(req, res) {
  dao.findAll(req.params.name).then(
    function(json) {
      if (json === null) {
        json = mocks.moviesCollection;
        json.name = req.params.name;
      }
      res.json(json);
    }, function(err) {
      console.log(err);
      res.send(err);
    });
});

router.get('/get/movie/:name/:id', function(req, res) {
  dao.findById(req.params.name, req.params.id).then(
    function(json) {
      if (json === null) {
        json = mocks.movie;
        json.id = parseInt(req.params.id);
      }
      res.json(json);
    }, function(err) {
      console.log(err);
      res.send(err);
    });
});

router.post('/add/movie/:name', function(req, res) {
  movie = req.body.json;
  console.log(movie);
  dao.saveOrUpdate(req.params.name, movie).then(
    function(id) {
      console.log("movie id = " + id);
      res.json(id);
    }, function(err) {
      console.log(err);
      res.send(err);
    });
});

module.exports = router;
