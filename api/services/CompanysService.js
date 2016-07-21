'use strict';

var CompanysRepository = require('../repositories/CompanysRepository.js');
var ProximityNormalGroupRepository = require('../repositories/ProximityNormalGroupRepository.js');
var AuthenticationProviderRepository = require('../repositories/AuthenticationProvidersRepository.js');
var DevicesRepository = require('../repositories/DevicesRepository.js');
var regExs = require("../regExs/regExs.js");
var validations = require("../validations/validations.js");
var _ = require("lodash");
var md5 = require("md5");
var moment = require("moment");
var error = require("../errors/errors.js");
var utils = require("../utils/utils.js");


class CompanysService {

    /**
     * save: It is an function to save Company Details into the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var companysRepository = new CompanysRepository();
        companysRepository.save(params, callback);
    }

    /**
     * find: It is an function to find Company Details based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var companysRepository = new CompanysRepository();
        companysRepository.find(params, callback);
    }

    /**
     * getCompanyDetails: It is an function to get all the Company Details for the admin portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getCompanyDetails(params, callback) {

        var self = this;
        var aclImplementationService = new AclImplementationService();

        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            getCompanyDetailsForGetCompanyDetailsAdminApi,
            responseCreationForGetCompanyDetailsAdminApi
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        });
    }

    /**
     * create: It is an function to create a new Company detail on the admin portal for the brown bag application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    create(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();

        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.companyNameValidation(self.companyName)) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        if (!validations.domainValidation(self.domain)) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        if (self.mode) {
            if (!validations.companyModeValidation(self.mode)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (!self.mode) {
            self.mode = null;
        }

        if (!validations.proximityForGeneralUsersValidation(self.proximity)) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        if (!validations.companyThresholdPerGroupValidation(self.thresholdPerGroup)) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        if (!validations.companyIsActiveValidation(self.isActive)) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            companyNameCheckForCompanyCreation,
            companyDomainCheckForCompanyCreation,
            companyNameAndDomainCheckForCompanyCreation,
            createCompanyInBrownBagApplicationUsingTransaction,
            responseCreationForCompanyCreationForAdminPortal
        ], function(err, result) {
            if (err) {
                return callback(err)
            }

            if (result) {
                return callback(null, result);
            }
        });
    }

    /**
     * edit: It is an function to edit a Company detail on the admin portal for the brown bag application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    edit(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        self = params;
        self.updateCompanyDetails = {};
        self.updateDomainDetails = {};

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.companyIdValidation(self.companyId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.domainIdValidation(self.domainId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (self.companyName) {
            self.updateCompanyDetails.companyName = self.companyName;
            if (!validations.companyNameValidation(self.companyName)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (self.domain) {
            self.updateDomainDetails.domain = self.domain;
            if (!validations.domainValidation(self.domain)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (self.mode) {
            self.updateCompanyDetails.mode = self.mode;
            if (!validations.companyModeValidation(self.mode)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (self.thresholdPerGroup) {
            self.updateCompanyDetails.thresholdPerGroup = self.thresholdPerGroup;
            if (!validations.companyThresholdPerGroupValidation(self.thresholdPerGroup)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (self.isActive) {
            self.updateCompanyDetails.isActive = self.isActive;
            if (!validations.companyIsActiveValidation(self.isActive)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        if (self.proximity) {
            self.updateCompanyDetails.proximity = self.proximity;
            if (!validations.proximityForGeneralUsersValidation(self.proximity)) {
                return callback(error.companyDetailsProvidedIsIncorrect());
            }
        }

        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            companyIdCheckForCompanyUpdate,
            domainIdCheckForCompanyUpdate,
            domainLinkageWithCompanyCheckForCompanyUpdate,
            companyNameCheckForCompanyCreation,
            companyDomainCheckForCompanyCreation,
            //companyNameAndDomainCheckForCompanyCreation,
            updateCompanyDetailsPreCheckForCompany,
            updateCompanyDetailsPreCheckForDomain,
            updateCompanyDetails,
            responseCreationForCompanyUpdateApi
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        });
    }

    /**
     * getCompanyIdCheckForGetGroupDetails: It is an function to get company Id for get group details api on the admin portal for the brown bag application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getCompanyIdCheckForGetGroupDetails(params, callback) {
        getCompanyIdCheckForGetGroupDetails(params, callback);
    }

    /**
     * getOnlyCompanies: It is an function to get only company details on the admin portal for the brown bag application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getOnlyCompanies(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            getOnlyCompanies
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        });

    }


}

module.exports = CompanysService;

/**
 * getCompanyDetailsForGetCompanyDetailsAdminApi: It is an function to get company details on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getCompanyDetailsForGetCompanyDetailsAdminApi(self, callback) {
    var companysRepository = new CompanysRepository();

    var query = 'SELECT * FROM brownBag.Companies as companies' +
        ' left join brownBag.CompanyDomains as companyDomains on companyDomains.companyId=companies.id' +
        ' left join brownBag.Domains as domains on domains.id=companyDomains.id' +
        ' order by companies.companyName,domains.domain;';

    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    companysRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.companyDetails = result;
            return callback(null, self);
        }

        if (result.length < 0) {
            self.companyDetails = [];
            return callback(null, self);
        }

        if (result.length == 0) {
            self.companyDetails = [];
            return callback(null, self);
        }
    });
}

/**
 * responseCreationForGetCompanyDetailsAdminApi: It is an function for response creation for get company details admin api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForGetCompanyDetailsAdminApi(self, callback) {
    var response = {};
    response.companyList = [];
    if (self.companyDetails.length > 0) {
        _.forEach(self.companyDetails, function(company) {
            if (company.isActive) {
                company.isActive = true;
            }

            if (!company.isActive) {
                company.isActive = false;
            }
            response.companyList.push(company);
        });
    }

    if (self.companyDetails.length == 0) {
        response.companyList = [];
    }

    if (self.companyDetails.length < 0) {
        response.companyList = [];
    }

    return callback(null, response);
}

/**
 * companyNameCheckForCompanyCreation: It is an function for company name check for company creation on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function companyNameCheckForCompanyCreation(self, callback) {

    var companysRepository = new CompanysRepository();

    if (self.companyName) {
        var query = 'SELECT * FROM brownBag.Companies as companies' +
            ' where companies.companyName= :companyName';

        var replacements = {
            companyName: self.companyName
        };

        var queryType = sequelize.QueryTypes.SELECT;

        companysRepository.exec(query, replacements, queryType, function(err, result) {

            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result.length > 0) {
                self.companyExistFlag = true;
                self.companyDetails = result[0];
                return callback(null, self);
            }

            if (result.length < 0) {
                self.companyDetails = {};
                self.companyExistFlag = false;
                return callback(null, self);
            }

            if (result.length == 0) {
                self.companyDetails = {};
                self.companyExistFlag = false;
                return callback(null, self);
            }
        });
    }

    if (!self.companyName) {
        self.companyDetails = {};
        self.companyExistFlag = false;
        return callback(null, self);
    }
}

/**
 * companyDomainCheckForCompanyCreation: It is an function for company domain check for company creation on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function companyDomainCheckForCompanyCreation(self, callback) {

    if (self.domain) {
        var companysRepository = new CompanysRepository();

        var query = 'SELECT * FROM brownBag.Domains as domains' +
            ' where domains.domain= :domain';

        var replacements = {
            domain: self.domain
        };

        var queryType = sequelize.QueryTypes.SELECT;

        companysRepository.exec(query, replacements, queryType, function(err, result) {

            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result.length > 0) {
                self.domainExistFlag = true;
                self.domainDetails = result[0];
                return callback(null, self);
            }

            if (result.length < 0) {
                self.domainDetails = {};
                self.domainExistFlag = false;
                return callback(null, self);
            }

            if (result.length == 0) {
                self.domainDetails = {};
                self.domainExistFlag = false;
                return callback(null, self);
            }
        });
    }

    if (!self.domain) {
        self.domainDetails = {};
        self.domainExistFlag = false;
        return callback(null, self);
    }
}

/**
 * companyNameAndDomainCheckForCompanyCreation: It is an function for domain exit flag for company creation on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function companyNameAndDomainCheckForCompanyCreation(self, callback) {
    if (self.domainExistFlag) {
        return callback(error.domainIsAlreadyPresent());
    }

    if (!self.domainExistFlag) {
        return callback(null, self);
    }
}


/**
 * createCompanyInBrownBagApplicationUsingTransaction: It is an function for company creation on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */


function createCompanyInBrownBagApplicationUsingTransaction(self, callback) {


    return sequelize.transaction(function(t) {
        // chain all your queries here. make sure you return them.
        // Create Domain Details
        return Domains.create({
            domain: self.domain,
            createdAt: sequelize.fn('NOW'),
            updatedAt: sequelize.fn('NOW')
        }, { transaction: t }).then(function(domainDetails) {
            self.domainDetails = domainDetails;

            if (!self.companyExistFlag) {

                return Company.create({
                    companyName: self.companyName,
                    proximity: self.proximity,
                    isActive: self.isActive,
                    thresholdPerGroup: self.thresholdPerGroup,
                    mode: self.mode,
                    createdAt: sequelize.fn('NOW'),
                    updatedAt: sequelize.fn('NOW'),
                }, { transaction: t }).then(function(companyDetails) {

                    self.companyDetails = companyDetails;

                    return CompanyDomains.create({
                        companyId: self.companyDetails.id,
                        domainId: self.domainDetails.id,
                        createdAt: sequelize.fn('NOW'),
                        updatedAt: sequelize.fn('NOW'),
                    }, { transaction: t }).then(function(companyDomainsDetails) {
                        self.companyDomainsDetails = companyDomainsDetails;
                    });
                });
            }

            if (self.companyExistFlag) {
                return CompanyDomains.create({
                    companyId: self.companyDetails.id,
                    domainId: self.domainDetails.id,
                    createdAt: sequelize.fn('NOW'),
                    updatedAt: sequelize.fn('NOW'),
                }, { transaction: t }).then(function(companyDomainsDetails) {
                    self.companyDomainsDetails = companyDomainsDetails;
                });
            }
        });
    }).then(function(result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        return callback(null, self);
    }).catch(function(err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        return callback(error.inconvenienceMessage());
    });
}

/**
 * responseCreationForCompanyCreationForAdminPortal: It is an function for response creation of company creation api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForCompanyCreationForAdminPortal(self, callback) {
    var response = {};
    response.message = "The company details were created successfully.";
    return callback(null, response);
}

/**
 * companyIdCheckForCompanyUpdate: It is an function for company Id check for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function companyIdCheckForCompanyUpdate(self, callback) {

    var companysRepository = new CompanysRepository();

    var query = 'SELECT * FROM brownBag.Companies as companies' +
        ' where companies.id= :companyId';

    var replacements = {
        companyId: self.companyId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    companysRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            return callback(null, self);
        }

        if (result.length < 0) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }

        if (result.length == 0) {
            return callback(error.companyDetailsProvidedIsIncorrect());
        }
    });
}

/**
 * domainIdCheckForCompanyUpdate: It is an function for domain Id check for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function domainIdCheckForCompanyUpdate(self, callback) {

    var companysRepository = new CompanysRepository();

    var query = 'SELECT * FROM brownBag.Domains as domains' +
        ' where domains.id= :domainId';

    var replacements = {
        domainId: self.domainId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    companysRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.domainExistFlag = true;
            return callback(null, self);
        }

        if (result.length < 0) {
            self.domainExistFlag = false;
            return callback(error.domainDetailProvidedIsIncorrect());
        }

        if (result.length == 0) {
            self.domainExistFlag = false;
            return callback(error.domainDetailProvidedIsIncorrect());
        }
    });
}

/**
 * updateCompanyDetailsPreCheckForCompany: It is an function for pre chack the company details for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateCompanyDetailsPreCheckForCompany(self, callback) {

    if (self.companyExistFlag) {
        if (self.companyDetails.id == self.companyId) {
            return callback(null, self);
        }

        if (self.companyDetails.id != self.companyId) {
            return callback(error.companyIdMismatch());
        }
    }

    if (!self.companyExistFlag) {
        return callback(null, self);
    }

}

/**
 * updateCompanyDetailsPreCheckForDomain: It is an function for pre chack the domain details for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateCompanyDetailsPreCheckForDomain(self, callback) {

    if (self.domainExistFlag) {
        if (self.domainDetails.id == self.domainId) {
            return callback(null, self);
        }

        if (self.domainDetails.id != self.domainId) {
            return callback(error.domainIdMismatch());
        }
    }

    if (!self.domainExistFlag) {
        return callback(null, self);
    }
}

/**
 * domainLinkageWithCompanyCheckForCompanyUpdate: It is an function for domain linkage check for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function domainLinkageWithCompanyCheckForCompanyUpdate(self, callback) {

    var companysRepository = new CompanysRepository();

    var query = 'SELECT * FROM brownBag.CompanyDomains as companyDomains' +
        ' where companyDomains.domainId= :domainId and companyDomains.companyId= :companyId';

    var replacements = {
        domainId: self.domainId,
        companyId: self.companyId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    companysRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            return callback(null, self);
        }

        if (result.length < 0) {
            return callback(error.companyNotLinkedToDomain());
        }

        if (result.length == 0) {
            return callback(error.companyNotLinkedToDomain());
        }
    });
}

/**
 * updateCompanyDetails: It is an function for company update for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateCompanyDetails(self, callback) {

    return sequelize.transaction(function(t) {
        // chain all your queries here. make sure you return them.
        // Create Domain Details
        return Domains.update(self.updateDomainDetails, {
            where: {
                id: self.domainId
            }
        }, { transaction: t }).then(function(domainDetails) {

            return Company.update(self.updateCompanyDetails, {
                where: {
                    id: self.companyId
                }
            }, { transaction: t }).then(function(companyDetails) {

            });
        });
    }).then(function(result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        return callback(null, self);
    }).catch(function(err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        return callback(error.inconvenienceMessage());
    });
}

/**
 * responseCreationForCompanyUpdateApi: It is an function for response creation  for company update api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForCompanyUpdateApi(self, callback) {
    var response = {};
    response.message = "The Company Details were updated successfully";
    return callback(null, response);
}

/**
 * getCompanyIdCheckForGetGroupDetails: It is an function for get company id check for get group details api on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getCompanyIdCheckForGetGroupDetails(self, callback) {
    var companysRepository = new CompanysRepository();

    if (self.companyId) {
        var query = 'SELECT * FROM brownBag.Companies as companies' +
            ' where companies.id= :companyId';

        var replacements = {
            companyId: self.companyId
        };

        var queryType = sequelize.QueryTypes.SELECT;

        companysRepository.exec(query, replacements, queryType, function(err, result) {

            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result.length > 0) {
                self.companyExist = true;
                return callback(null, self);
            }

            if (result.length < 0) {
                self.companyExist = false;
                return callback(null, self);
            }

            if (result.length == 0) {
                self.companyExist = false;
                return callback(null, self);
            }
        });
    }

    if (!self.companyId) {
        self.companyExist = true;
        return callback(null, self);
    }
}

/**
 * getOnlyCompanies: It is an function to get only company details on the admin portal for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getOnlyCompanies(self, callback) {
    var companysRepository = new CompanysRepository();

    var query = 'SELECT * FROM brownBag.Companies as companies';

    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    companysRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.response = {};
            self.response.companyDetails = result;
            self.companyDetails = result;
            return callback(null, self.response);
        }

        if (result.length < 0) {
            self.response = {};
            self.response.companyDetails = [];
            self.companyDetails = [];
            return callback(null, self.response);
        }

        if (result.length == 0) {
            self.response = {};
            self.response.companyDetails = [];
            self.companyDetails = [];
            return callback(null, self.response);
        }
    });
}