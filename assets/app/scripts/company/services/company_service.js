(function() {    
  'use strict';

  angular.module('app').factory('companyService', companyService);

  companyService.$inject = ['httpi','API'];

  function companyService(httpi,API) {

    var service = {};

    service.getCompanyList = getCompanyList;
    service.addCompany = addCompany;
    service.editCompany = editCompany;

    return service;
    
    function getCompanyList(callback) {
      httpi({
        method: "get",
        url: API.getCompanies
    
     }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
   }


   function addCompany(companyDetails, callback) {
    httpi({
      method: "post",
      url: API.addCompany,
      data: {
        companyName: companyDetails.companyName,
        domain: companyDetails.domain,
        mode: companyDetails.mode,
        proximity: companyDetails.proximity,
        thresholdPerGroup: companyDetails.thresholdPerGroup,
        isActive: companyDetails.isActive
      }
    }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
  }

  function editCompany(companyDetails, callback) {
    httpi({
      method: "put",
      url: API.editCompany,
      params:{
        companyId: companyDetails.companyId,
        domainId: companyDetails.domainId
      },
      data: {
        companyName: companyDetails.companyName,
        domain: companyDetails.domain,
        mode: companyDetails.mode,
        proximity: companyDetails.proximity,
        thresholdPerGroup: companyDetails.thresholdPerGroup,
        isActive: companyDetails.isActive
      }
    }).then(function(response) {
      callback(response);
    }, function(response) {
      callback(response);
    });
  }


}		

})();