(function() {    
    'use strict';

    angular.module('app').factory('userService', userService);

    userService.$inject = ['httpi','API'];

    function userService(httpi, API) {

        var service = {};

        service.getUserList = getUserList;

        return service;
  
        function getUserList(callback) {
            httpi({
                method: "get",
                url: API.getUsers
                
            }).then(function(response) {
                callback(response);
            }, function(response) {
                callback(response);
            });
        }
	}		

})();