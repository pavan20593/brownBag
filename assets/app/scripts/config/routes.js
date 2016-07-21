(function () {

	angular.module('app').factory('routes', routes);

	function routes() {

		return {
			login: "/bb/v1/admin/login",
			getUsers: "/bb/v1/admin/users",
			getCompanies: "/bb/v1/admin/company",
			getGroups:"/bb/v1/admin/groupList",
			settings:"/bb/v1/admin/settings",
			addCompany:"/bb/v1/admin/company",
			editCompany:"/bb/v1/admin/company/:companyId/domain/:domainId",
			getCompanyDetails:"/bb/v1/admin/getOnlyCompanies",
			
		}

	}
})();