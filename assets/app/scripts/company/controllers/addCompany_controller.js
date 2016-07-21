angular.module('app').controller('addCompanyController',['$state','companyService','toastr',function($state,companyService,toastr){
	var vm = this;

	

	vm.cancel = function(){
		$state.go('companyList');
	}

	vm.addCompany = function(companyDetails){
		companyDetails.domain='@'+companyDetails.domain;
		companyService.addCompany(companyDetails,function(response){
			if(response.status === 200){
				$state.go('companyList');
				return toastr.success(response.data.message);
			}

			if(response.status === 400){
				return toastr.error(response.data.exception);
			}

		});
	}

}]);