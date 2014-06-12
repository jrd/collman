//http://localhost:3000/get/movie/DEFAULT/3
angular.module('collMan').factory('dao',['$http',function($http) {
  'use strict';
  return {
    findMovie: function(id, name) {
      if (typeof(name) === 'undefined') {
        name = 'DEFAULT';
      }
	    return $http.get('/get/movie/{name}/{id}'.format({'id': id, 'name': name}));
	  },
    findMovies: function(name) {
      if (typeof(name) === 'undefined') {
        name = 'DEFAULT';
      }
      return $http.get('/list/movies/{name}'.format({'name': name}));
    },
    saveMovie: function(movie, name) {
      if (typeof(name) === 'undefined') {
        name = 'DEFAULT';
      }
      return $http.post('/add/movie/{name}'.format({'name': name}), {'json': movie});
    }
  };
}]);
