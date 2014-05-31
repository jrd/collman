//http://localhost:3000/get/movie/DEFAULT/3
angular.module('collMan').factory('dao',['$http',function($http) {
  'use strict';
  return {
    findMovie: function(id) {
	    return $http.get('get/movie/DEFAULT/' + id);
	  }
  };
}]);
