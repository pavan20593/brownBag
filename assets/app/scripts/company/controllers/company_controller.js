angular.module('app').controller('companyController',['companyService','toastr','$state', function(companyService,toastr,$state){

	var vm = this;

 

 companyService.getCompanyList(function(response) {
  if (response.status === 200) {
    vm.companies = response.data.companyList;
    return;
  }
  if (response.status === 400) {
    return toastr.error(response.data.exception);
  }
});

 vm.editCompanyList=function(company){
 	$state.go('editCompany',{companyDetails:company})
 }

 
}]);




