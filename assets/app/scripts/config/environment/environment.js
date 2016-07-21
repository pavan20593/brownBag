(function () {
    angular.module('app').factory('ENVIRONMENT', ENVIRONMENT);

    ENVIRONMENT.$inject = ['connections'];

    function ENVIRONMENT(connections) {
        return {
            BASEURL: connections.DEVELOPMENT
        }
    }
})();