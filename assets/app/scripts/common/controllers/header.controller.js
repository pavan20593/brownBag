angular.module('app').controller('headerController', ['$state', 'authenticationService', 'loginService',

    function($state, authenticationService, loginService) {

        var vm = this;

        vm.logout = function() {
            authenticationService.clearCredentials();
            $state.go('login', { reload: true });
        }

        vm.loggedInUserDetails = loginService.getUserDetails();

    }
]);