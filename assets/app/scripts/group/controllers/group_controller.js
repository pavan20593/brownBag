angular.module('app').controller('groupController',['groupService','$uibModal','toastr','$scope','moment','$state',function(groupService,$uibModal,toastr,$scope,moment,$state){

	var vm = this;
	createdAt = vm.createdAt;
	
	companyId = vm.companyId;
	
groupService.getGroupList(vm.createdAt, vm.companyId,function(response) {
		if (response.status === 200) {	
			vm.groups = response.data.groupList;
			return;	
		}
		if (response.status === 400) {
			return toastr.error(response.data.exception);
		}
		
	});
	

	groupService.getCompanyDetails(function(response){
		if(response.status==200){
			vm.getCompanyDetails = response.data.companyDetails; 
			return;
		}

		if(response.status==400){
			return toastr.error(response.data.exception);
		}
	});

	
	
vm.getGroupList = function(createdAt,companyId){

	createdAt = moment(createdAt).format('YYYY-MM-DD');
	
	groupService.getGroupList(createdAt, companyId,function(response) {
		if (response.status === 200) {

			vm.groups = response.data.groupList;
			return;	
		}
		if (response.status === 400) {
			return toastr.error(response.data.exception);
		}
		
	});


}		

	vm.viewGroupDetail = function(userDetails) {

		var scope = $scope.$new();
		scope.userDetails = userDetails;
		vm.userDetails=userDetails;

		vm.modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'app/views/groups/group_details_modal.html',
			windowClass: 'd-modal',
			size: 'lg',
			scope: scope	
		});
	}

	vm.clearFilter = function(){
		vm.companyId = undefined;
		vm.createdAt = new Date();

		groupService.getGroupList(undefined, undefined,function(response) {
		if (response.status === 200) {	
			vm.groups = response.data.groupList;
			return;	
		}
		if (response.status === 400) {
			return toastr.error(response.data.exception);
		}
		
	});
		
	}
	
	
		

	$scope.today = function() {
           $scope.dt = new Date();
           // vm.createdAt = new Date();
       };
       $scope.today();

       vm.createdAt= new Date();

       $scope.toggleMin = function() {
           $scope.minDate = new Date();
       };
       $scope.toggleMin();

      

       $scope.maxDate = new Date(2050, 12, 31);
       $scope.startDate = new Date(2016, 01, 01);

       $scope.openFrom = function($event) {
           $scope.status.opened = true;
           $scope.status.opened1 = true;
           $scope.status.opened2 = false;
       };

       $scope.openTo = function($event) {
           $scope.status.opened1 = false;
           $scope.status.opened2 = true;
       };

       $scope.setDate = function(year, month, day) {
           $scope.dt = new Date(year, month, day);
       };

       $scope.dateOptions = {
           formatYear: 'yy',
           startingDay: 1,
           showWeeks:false
       };

       $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'shortDate'];
       $scope.format = $scope.formats[0];

       $scope.status = {
           opened: false,
           opened1: false,
           opened2: false
       };

       var tomorrow = new Date();
       tomorrow.setDate(tomorrow.getDate() + 1);

       var afterTomorrow = new Date();
       afterTomorrow.setDate(tomorrow.getDate() + 2);

       $scope.events = [{
           date: tomorrow,
           status: 'full'
       }, {
           date: afterTomorrow,
           status: 'partially'
       }];

       /* END ui-bootstrap datepicker */

}]);





