(function() {    
  'use strict';

  angular.module('app').factory('groupService', groupService);

  groupService.$inject = ['httpi','API'];

  function groupService(httpi,API) {

    var service = {};

    service.getGroupList = getGroupList;
     service.getCompanyDetails = getCompanyDetails;

    return service;
    
    function getGroupList(createdAt,companyId,callback) {
      httpi({
        method: "get",
        url: API.getGroups,
        params:{
         createdAt:createdAt,
         companyId: companyId
       }
     }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
   }

   function getCompanyDetails(callback){
    // var deferred = $q.defer();
    httpi({
      method:"get",
      url:API.getCompanyDetails
    }).then(function(response){
      // deferred.resolve(response.data);
      // return deferred.promise;
      return callback (response);
   
    });
    
   }
 }		

})();