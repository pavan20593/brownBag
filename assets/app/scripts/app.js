(function () {
    'use strict';

    angular
    .module('app', ['ui.router','ui.bootstrap','ui.bootstrap.modal','ui.bootstrap.datepicker','httpi','datatables','ngAnimate','toastr', 'ngCookies','ngLodash','angularMoment'])
    .config(config)
    .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/login");

        // Now set up the states
        $stateProvider

        .state('login', {
            url: '/login',
            templateUrl: 'app/views/login/login.html',
            controller:'loginController',
            controllerAs:'vm'

        })

        
        .state('companyList', {
            url: '/companyList',
            templateUrl: 'app/views/company/company_list.html',
            controller:'companyController',
            controllerAs:'vm'

        })

        .state('addCompany', {
            url: '/addCompany',
            templateUrl: 'app/views/company/add_company_normal.html',
            controller: 'addCompanyController',
            controllerAs: 'vm'
            
        })

        .state('editCompany', {
            url: '/editCompany',
            templateUrl: 'app/views/company/edit_company_normal.html',
            controller: 'editCompanyController',
            controllerAs: 'vm',
            params:{
                companyDetails:null
            }         
        })

        .state('groupList', {
            url: '/groupList',
            templateUrl: 'app/views/groups/group_list.html',
            controller: 'groupController',
            controllerAs: 'vm'
            // resolve:{
            //     getCompanyDetails: ['groupService','$q',function(groupService,$q){
            //         var deferred = $q.defer();
            //         deferred.resolve({
            //             getCompanyDetailsList : function(){
            //                 return groupService.getCompanyDetails();
            //             }
            //         });
            //         return deferred.promise;
                    

            //     }]
            //}

        })
        .state('userList', {
            url: '/userList',
            templateUrl: 'app/views/user/registered_users.html',
            controller: 'userController',
            controllerAs: 'vm'

        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'app/views/settings/setting.html',
            controller:'settingsController',
            controllerAs:'vm'

        })

    }

    run.$inject = ['$rootScope', '$cookieStore', '$http', '$location','$state','authenticationService'];

    function run($rootScope, $cookieStore, $http, $location, $state,authenticationService) {
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['content-type'] = 'application/json';
            $http.defaults.headers.common['userid'] = $rootScope.globals.currentUser.userId;
            $http.defaults.headers.common['access-token'] = $rootScope.globals.currentUser.accessToken;
        }

        $rootScope.$auth = authenticationService;

        $rootScope.$on('$locationChangeStart', function(event, next, current) {

            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['content-type'] = 'application/json';
                $http.defaults.headers.common['userid'] = $rootScope.globals.currentUser.userId;
                $http.defaults.headers.common['access-token'] = $rootScope.globals.currentUser.accessToken;
            }

            var restrictedRoutes = "/login";
            var restrictedPage = ($location.path()==restrictedRoutes);
            
            var loggedIn = ($rootScope.globals.currentUser ? true: false);
            if (restrictedPage || !restrictedPage) {

                if(loggedIn){
                    if(next!=current && $location.path()!=restrictedRoutes){
                        $state.go($location.path().replace('/',''));
                    } 
                    if($location.path()==restrictedRoutes){
                        $state.go('companyList');
                    }
                }

                if(!loggedIn){
                    $location.path('/login');
                }  
            }
        });
    }

    // run.$inject = ['$rootScope', '$cookieStore', 'authenticationService'];

    // function run($rootScope, $cookieStore, authenticationService) {
    //     $rootScope.globals = $cookieStore.get('globals') || {};

    //     $rootScope.$auth = authenticationService;
    // }

    

})();