(function () {    
    'use strict';

    angular.module('app').factory('loginService', loginService);

    loginService.$inject = ['httpi', 'API','$localStorage'];

    function loginService(httpi, API, $localStorage) {

        var service = {};

        service.login = login;
        service.setUserDetails = setUserDetails;
        service.getUserDetails = getUserDetails;


        return service;

        function login(user, callback) {

            httpi({
                method:"post",
                url: API.login,
                data: {
                    email:user.email,
                    password:user.password
                }
            }).then(function (response) {
               callback(response);
            }, function (response) {
                callback(response);
            });
        }
        
        function setUserDetails(data) {
            $localStorage.setObject("userData", data);
        }

        function getUserDetails() {
            return $localStorage.getObject("userData");
        }

    }
})();