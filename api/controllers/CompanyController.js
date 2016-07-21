/**
 * CompanyController
 *
 * @description :: Server-side logic for managing Companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * getCompanyDetails: It is an API required to get all the company and various domains for the company details view in the Admin Portal 
     * @param  {object} req The request must contain userId and accessToken.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    getCompanyDetails: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token']
        };

        var companysService = new CompanysService();

        companysService.getCompanyDetails(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    },

    /**
     * create: It is an API required to create company by the Admin in the admin Portal of the brown Bag Application. 
     * @param  {object} req The request must contain userId , accessToken and the new company details.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    create: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token'],
            companyName: req.body.companyName,
            domain: req.body.domain,
            mode: req.body.mode,
            proximity: req.body.proximity,
            thresholdPerGroup: req.body.thresholdPerGroup,
            isActive: req.body.isActive
        };

        var companysService = new CompanysService();

        companysService.create(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    },

    /**
     * edit: It is an API required to edit the company details by the Admin in the admin Portal of the brown Bag Application. 
     * @param  {object} req The request must contain userId , accessToken, companyId, domainId and the editted company details.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    edit: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token'],
            companyId: parseInt(req.param('companyId')),
            domainId: parseInt(req.param('domainId')),
            companyName: req.body.companyName,
            domain: req.body.domain,
            mode: req.body.mode,
            proximity: req.body.proximity,
            thresholdPerGroup: req.body.thresholdPerGroup,
            isActive: req.body.isActive
        };

        var companysService = new CompanysService();

        companysService.edit(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    },

    /**
     * getOnlyCompanies: It is an API required to get only the company details for the applying in the group details page in the Admin portal of the brown bag Application.
     * @param  {object} req The request must contain userId and accessToken
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    getOnlyCompanies: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token'],
        };

        var companysService = new CompanysService();

        companysService.getOnlyCompanies(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    }
};