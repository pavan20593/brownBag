angular.module('app').controller('loginController',['$rootScope','$cookieStore','$http','loginService', 'toastr', '$state', 'authenticationService','$scope',function ($rootScope,$cookieStore,$http,loginService, toastr, $state, authenticationService,$scope) {


    if($scope.$auth.isAuthenticated()){
        $state.go('companyList');
    }


    var vm = this;

    vm.login = function (userModel) {

        loginService.login(userModel, function (response) {

            if (response.status === 200) {
               authenticationService.setCredentials(response.data);
               $rootScope.globals = $cookieStore.get('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['content-type'] = 'application/json';
                    $http.defaults.headers.common['userid'] = $rootScope.globals.currentUser.userId;
                    $http.defaults.headers.common['access-token'] = $rootScope.globals.currentUser.accessToken;
                }

                $state.go('companyList');
                return;
            } 
            if(response.status === 400) {
            	return toastr.error("login Failed");
            }
        });
           }
       }]);