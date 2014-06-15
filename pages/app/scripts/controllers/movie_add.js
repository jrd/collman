'use strict';

function getCodeNameList(lst) {
  var ret = [];
  for (var i = 0; i < lst.length; i++) {
    if (Array.isArray(lst[i])) {
      ret.push({code: lst[i][0], name: lst[i][1]});
    } else {
      ret.push({code: lst[i], name: lst[i]});
    }
  }
  return ret;
}

angular.module('collMan').controller('MovieAddCtrl', ['$scope', '$routeParams', '$location', 'dao',
  function ($scope, $routeParams, $location, dao) {
    $scope.movie = {
      title: null,
      origTitle: null,
      rlzYear: null,
      length: null,
      countries: [],
      directors: [],
      producers: [],
      cast: [],
      synopsys: null,
      format: null,
      tags: [],
      languages: [],
      subtitles: [],
      region: null,
      serie: null,
      volume: null,
      numberOfDisks: null
    };
    $scope.countries = getCodeNameList([
      ['us', 'USA'],
      ['fr', 'France'],
      ['it', 'Italy']
    ]);
    $scope.formats = getCodeNameList([
      ['DVD', 'DVD'],
      ['BRD', 'Blu-ray'],
      ['VHS', 'VHS'],
      ['Custom', 'Custom format']
    ]);
    $scope.regions = ['1', '2', '3', '4', '5', '6', 'A', 'B', 'C'];
    $scope.langs = getCodeNameList([
      ['en_US', 'English (US)'],
      ['fr_FR', 'French'],
      ['it_IT', 'Italian']
    ]);
    var addToList = function(list, value, fnValid) {
      if (fnValid(value)) {
        list.push(value);
        return true;
      } else {
        return false;
      }
    };
    var removeFromList = function(list, idx) {
      list.splice(idx, 1);
    };
    var EmptyPerson = function() { return { firstname: '', lastname: ''}; };
    $scope.director = new EmptyPerson();
    $scope.addDirector = function() { if (addToList($scope.movie.directors, $scope.director, function(director) {
      return director.firstname && director.lastname;
    })) { $scope.director = new EmptyPerson(); } };
    $scope.removeDirector = function(idx) { removeFromList($scope.movie.directors, idx); };
    $scope.producer = '';
    $scope.addProducer = function() { if (addToList($scope.movie.producers, $scope.producer, function(producer) {
      return producer.firstname && producer.lastname;
    })) { $scope.producer = new EmptyPerson(); } };
    $scope.removeProducer = function(idx) { removeFromList($scope.movie.producers, idx); };
    $scope.actor = {actor: new EmptyPerson(), character: ''};
    $scope.addActor = function() { if (addToList($scope.movie.cast, $scope.actor, function(actor) {
      return actor.actor.firstname && actor.actor.lastname;
    })) { $scope.actor = {actor: new EmptyPerson(), character: ''}; } };
    $scope.removeActor = function(idx) { removeFromList($scope.movie.cast, idx); };
    $scope.tag = '';
    $scope.addTag = function() { if (addToList($scope.movie.tags, $scope.tag, function(tag) { return tag && true; })) { $scope.tag = ''; } };
    $scope.removeTag = function(idx) { removeFromList($scope.movie.tags, idx); };
    $scope.saveMovie = function() {
      dao.saveMovie($scope.movie).success(function(movieId) {
        $location.url('movie/{id}'.format({'id': movieId}));
      });
    };
  }
]);
