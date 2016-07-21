angular.module('app').controller('editCompanyController', ['$state', '$stateParams', 'companyService', 'toastr', '$localStorage', function($state, $stateParams, companyService, toastr, $localStorage) {
    var vm = this;
    vm.companyDetails = $stateParams.companyDetails;

    if (!vm.companyDetails) {
        $state.go("companyList");
    }

    var companyInfo = vm.companyDetails;
    if ((JSON.stringify($localStorage.getObject("comp")) === '{}' || $localStorage.getObject("comp") != vm.companyDetails) && vm.companyDetails != null) {
        $localStorage.setObject("comp", companyInfo);
    } else if ($localStorage.getObject("comp")) {
        vm.companyDetails = $localStorage.getObject('comp');
    }

    vm.editCompany = function(companyDetails) {

        companyDetails.thresholdPerGroup = parseInt(companyDetails.thresholdPerGroup);
        companyDetails.proximity = parseInt(companyDetails.proximity);

        companyService.editCompany(companyDetails, function(response) {
            if (response.status === 200) {
                $state.go('companyList');
                return toastr.success(response.data.message);
            }

            if (response.status === 400) {
                return toastr.error(response.data.exception);
            }

        });
    }

    vm.goToCompanyList = function() {
        $localStorage.remove("comp");
        $state.go("companyList");
    }
}]);