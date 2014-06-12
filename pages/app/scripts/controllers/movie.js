'use strict';
/**
 * controller for 1 movie detail.
 */
angular.module('collMan').controller('MovieCtrl', ['$scope', '$routeParams', 'dao',
  function ($scope, $routeParams, dao) {
    console.log('loading Movie' + $routeParams.id);
    var id = $routeParams.id;
    dao.findMovie(id).success(function(res) {
      $scope.movie = res;
      console.log($scope.movie);
    });
  }
]);
