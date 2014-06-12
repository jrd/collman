'use strict';

angular.module('collMan').controller('MoviesCtrl', ['$scope', '$routeParams', 'dao',
  function ($scope, $routeParams, dao) {
    console.log('loading Movies list');
    dao.findMovies().success(function(res) {
      console.log(res);
      $scope.movies = res.data;
      $scope.moviesName = res.name;
      $scope.moviesCount = res.totalSize;
      console.log($scope.movies);
    });
  }
]);
