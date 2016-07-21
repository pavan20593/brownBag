angular.module('app').controller('settingsController',['settingsService','$state','toastr',function(settingsService,$state,toastr){

		var vm = this;

		settingsService.getSettings(function(response){
				if(response.status === 200){
					vm.proximity = response.data.settingsDetails.proximity;
					return;
				}
				if(response.status === 400){
					return toastr.error(response.data.exception);
				}
			})

		vm.addSettings = function(proximity){
			settingsService.addSettings(proximity,function(response){
				if(response.status === 200){
					$state.reload();
					 return toastr.success(response.data.message,{
  						closeButton: true
					});
				}
				 if (response.status === 400) {
                return toastr.error(response.data.exception);
            	}
            	
			});
	
		};

		
			
		
			


}]);