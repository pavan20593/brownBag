function () {
    'use strict';
 
    angular
        .module('app')
        .factory('userService', userService);
 
    userService.$inject = ['$http'];
    function userService($http) {
        
        var service = {};
        service.GetByUsername = GetByUsername;
        return service;
 
        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }
 
        // private functions
 
        function handleSuccess(res) {
            return res.data;
        }
 
        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
 
})();