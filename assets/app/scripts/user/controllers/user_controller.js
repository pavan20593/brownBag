angular.module('app').controller('userController',['userService','toastr',function(userService,toastr){

	var vm = this;

  

    userService.getUserList( function(response) {
        if (response.status === 200) {
            vm.users = response.data.userDetails;
            return;
        }
        if (response.status === 400) {
            return toastr.error(response.data.exception);
        }
        
    });


    vm.exportData = function() {

        // vm.listOfUsers = angular.copy(vm.users);

        // vm.filteredData = _.map(vm.listOfUsers, function(data){
        //     var status = (data.isActive==true)?'Active':'In-Active';
            
        //     var users = {'Name': data.fullName, 'Email': data.email, 'Designation': data.designation, 'Company Name': data.companyName,'Status':status}
        //     return users;
        // });

        // alasql('SELECT * INTO XLSX("download.xlsx",{headers:true}) FROM ?', [vm.filteredData]);

        alasql('SELECT * INTO XLSX("download.xlsx",{headers:true}) \
                    FROM HTML(".userDatatable",{headers:true})');
    }


	
    }]);




