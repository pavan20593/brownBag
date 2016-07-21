'use strict';

const updateDetails = "UPDATE";
const insertDetails = "INSERT";

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


class ProximityNormalGroupService {

    /**
     * save: It is an function to save details into the ProximityNormalGroupService table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var proximityNormalGroupRepository = new ProximityNormalGroupRepository();
        proximityNormalGroupRepository.save(params, callback);
    }

    /**
     * find: It is an function to find details into the ProximityNormalGroupService table based on parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var proximityNormalGroupRepository = new ProximityNormalGroupRepository();
        proximityNormalGroupRepository.find(params, callback);
    }

    /**
     * settings: It is an function to update settings in the admin portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    settings(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();

        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.proximityForGeneralUsersValidation(self.proximity)) {
            return callback(error.incorrectProximityEntered());
        }


        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            checkForPresenceOfProximity,
            upsertOperationOnProximityNormalGroupTable,
            responseCreationForSettingsApi
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        });
    }

    get(params, callback) {

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
            checkForPresenceOfProximity,
            responseCreationForGetSettingsApi
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

module.exports = ProximityNormalGroupService;

/**
 * checkForPresenceOfProximity: It is an function to check the presence of the proximity in the database table.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function checkForPresenceOfProximity(self, callback) {

    var proximityNormalGroupRepository = new ProximityNormalGroupRepository();

    var query = 'Select * from brownBag.ProximityNormalGroups';

    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    proximityNormalGroupRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length == 1) {
            self.proximityNormalGroupsDetails = result[0];
            self.proximityStatus = updateDetails;
            return callback(null, self);
        }

        if (result.length > 1) {
            return callback(error.proximityMutipleEntriesPresent());
        }

        if (result.length == 0) {
            self.proximityStatus = insertDetails;
            return callback(null, self);
        }

        if (result.length < 0) {
            self.proximityStatus = insertDetails;
            return callback(null, self);
        }
    });
}

/**
 * upsertOperationOnProximityNormalGroupTable: It is an function to upsert the the proximity in the database table.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function upsertOperationOnProximityNormalGroupTable(self, callback) {

    var proximityNormalGroupRepository = new ProximityNormalGroupRepository();

    if (self.proximityStatus == updateDetails) {

        var query = 'Update brownBag.ProximityNormalGroups as proximityNormalGroups SET proximity= :proximity' +
            ' where proximityNormalGroups.id= :id';

        var replacements = {
            proximity: self.proximity,
            id: self.proximityNormalGroupsDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

    }

    if (self.proximityStatus == insertDetails) {
        var query = ' INSERT into brownBag.ProximityNormalGroups(proximity,createdAt,updatedAt) VALUES' +
            ' (:proximity,NOW(),NOW())';

        var replacements = {
            proximity: self.proximity
        };

        var queryType = sequelize.QueryTypes.INSERT;
    }

    proximityNormalGroupRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result || !result) {
            return callback(null, self);
        }
    });
}

/**
 * responseCreationForSettingsApi: It is an function for responce creation for the settings api in the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForSettingsApi(self, callback) {
    var response = {};
    response.message = "The proximity for general users was changed successfully.";
    return callback(null, response);
}

/**
 * responseCreationForGetSettingsApi: It is an function for responce creation for the Get settings api in the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForGetSettingsApi(self,callback){
    var response={};
    response.settingsDetails=self.proximityNormalGroupsDetails;
    return callback(null, response);
}