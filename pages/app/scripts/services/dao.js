//http://localhost:3000/get/movie/DEFAULT/3
angular.module('collMan').factory('dao',['$http',function($http) {
  'use strict';
  return {
    findMovie: function(id, name) {
      if (typeof(name) === 'undefined') {
        name = 'DEFAULT';
      }
	    return $http.get('get/movie/{name}/{id}'.format({'id': id, 'name': name}));
	  }
  };
}]);
