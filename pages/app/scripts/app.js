'use strict';

angular
  .module('collMan', [
//    'ngCookies',
//    'ngResource',
//    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/movies', {
        templateUrl: 'views/movies.html',
        controller: 'MoviesCtrl'
      })
      .when('/movie/:id', {
        templateUrl: 'views/movie.html',
        controller: 'MovieCtrl'
      })
      .when('/movie_add', {
        templateUrl: 'views/movie_add.html',
        controller: 'MovieAddCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
