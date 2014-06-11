'use strict';

angular.module('collMan')
  .controller('MovieAddCtrl', ['$scope', '$routeParams', 'dao',
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
      $scope.countries = [
        {code:'us', name:'USA'},
        {code:'fr', name:'France'},
        {code:'it', name:'Italy'}
      ];
      $scope.saveMovie = function() {
        dao.saveMovie($scope.movie).success(function(res) {
          console.log(res);
        });
      };
    }
]);
