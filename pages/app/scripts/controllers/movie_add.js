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

angular.module('collMan').controller('MovieAddCtrl', ['$scope', '$routeParams', 'dao',
  function ($scope, $routeParams, dao) {
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
    var addToList = function(list, value) {
      if (value) {
        list.push(value);
        return true;
      } else {
        return false;
      }
    };
    var removeFromList = function(list, idx) {
      list.splice(idx, 1);
    };
    $scope.director = '';
    $scope.addDirector = function() { if (addToList($scope.movie.directors, $scope.director)) { $scope.director = ''; } };
    $scope.removeDirector = function(idx) { removeFromList($scope.movie.directors, idx); };
    $scope.producer = '';
    $scope.addProducer = function() { if (addToList($scope.movie.producers, $scope.producer)) { $scope.producer = ''; } };
    $scope.removeProducer = function(idx) { removeFromList($scope.movie.producers, idx); };
    $scope.actor = {actor: '', character: ''};
    $scope.addActor = function() { if (addToList($scope.movie.cast, $scope.actor)) { $scope.actor = {actor: '', character: ''}; } };
    $scope.removeActor = function(idx) { removeFromList($scope.movie.cast, idx); };
    $scope.tag = '';
    $scope.addTag = function() { if (addToList($scope.movie.tags, $scope.tag)) { $scope.tag = ''; } };
    $scope.removeTag = function(idx) { removeFromList($scope.movie.tags, idx); };
    $scope.saveMovie = function() {
      dao.saveMovie($scope.movie).success(function(res) {
        console.log(res);
      });
    };
  }
]);
