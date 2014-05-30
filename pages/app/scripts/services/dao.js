//http://localhost:3000/list/movies/3
angular.module('collMan').factory('dao',['$http',function($http){
  return{
    findMovie: function(id){
	  return $http.get('list/movies/3');
	}
  };
}]);