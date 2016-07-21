(function() {    
    'use strict';

    angular.module('app').factory('settingsService', settingsService);

    settingsService.$inject = ['httpi', 'API'];

    function settingsService(httpi, API) {

        var service = {};

       
        service.addSettings = addSettings;
        service.getSettings = getSettings;
       

        return service;

       function addSettings(proximity,callback) {
            httpi({
                method: "put",
                url: API.settings,
	       		data:{
	       			proximity: proximity
	       		}
            }).then(function(response) {
                callback(response);
            }, function(response) {
                callback(response);
            });
        }

        function getSettings(callback){
            httpi({
                method:"get",
                url:API.settings
            }).then(function(response){
                callback(response);
            },function(response){
                callback(response);
            
            })
        }
    }

})();