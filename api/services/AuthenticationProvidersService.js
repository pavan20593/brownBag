'use strict';

const logoutResponse = "You have successfully logged out of Brown Bag Application";
const adminLogOutResponse = " Admin has successfully logged out of the admin portal.";
const adminRoleId = sails.config.globals.adminRoleId;
const userRoleId = sails.config.globals.userRoleId;

var AuthenticationProviderRepository = require('../repositories/AuthenticationProvidersRepository.js');
var DevicesRepository = require('../repositories/DevicesRepository.js');
var regExs = require("../regExs/regExs.js");
var validations = require("../validations/validations.js");
var _ = require("lodash");
var md5 = require("md5");
var moment = require("moment");
var error = require("../errors/errors.js");
var utils = require("../utils/utils.js");

class AuthenticationProvidersService {

    /**
     * save: It is an function to save authentication  details in the database table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var authenticationProviderRepository = new AuthenticationProviderRepository();
        authenticationProviderRepository.save(params, callback);
    }

    /**
     * find: It is an function to find authentication  details in the database table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var authenticationProviderRepository = new AuthenticationProviderRepository();
        authenticationProviderRepository.find(params, callback);
    }

    /**
     * login: It is an function to login a user on the mobile application of brown bag based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    login(params, callback) {
        var self = this;
        self = params;

        if (!validations.emailIsPresentValidation(self.email)) {
            return callback(error.emailNotEntered());
        }

        if (!regExs.validateEmail(self.email)) {
            return callback(error.invalidEmailEntered());
        }

        if (!validations.passwordIsPresentValidation(self.password)) {
            return callback(error.passwordNotEntered());
        }

        if (!validations.deviceIdValidation(self.deviceId)) {
            return callback(error.invalidDeviceIdProvided());
        }

        if (!validations.playerIdValidation(self.playerId)) {
            return callback(error.invalidPlayerIdProvided());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }

        if (self.requestType) {
            if (!validations.requestTypeValidation(self.requestType)) {
                return callback(error.invalidRequestTypeProvided());
            }
        }

        if (!self.requestType) {
            self.requestType = 0;
        }

        if (!validations.osTypeValidation(self.deviceType)) {
            return callback(error.invalidOsTypeProvided());
        }

        async.waterfall([
            async.apply(getAuthDetailsBasedOnEmail, self),
            getPassportDetails,
            getUserDetailsBasedOnAuthId,
            roleIdCheckForUser,
            passwordVerification,
            generateAccessToken,
            createAccessToken,
            updateDeviceDetails,
            responseCreationForLoginMobileApplication
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
     * logout: It is an function to logout a user on the mobile application of brown bag based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    logout(params, callback) {
        var self = this;
        self = params;
        self.userId = parseInt(self.userId);

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.invalidUserParams());
        }

        async.waterfall([
            async.apply(getUserDetailsFromAccessTokens, self),
            deleteTheAccessToken,
            responseForLogoutApi
        ], function(error, result) {
            if (error) {
                return callback(error);
            }

            if (result) {
                return callback(null, result);
            }
        });
    }

    /**
     * adminLogin: It is an function to login the admin on the admin portal of brown bag based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    adminLogin(params, callback) {
        var self = this;
        self = params;

        if (!validations.emailIsPresentValidation(self.email)) {
            return callback(error.emailNotEntered());
        }

        if (!regExs.validateEmail(self.email)) {
            return callback(error.invalidEmailEntered());
        }

        if (!validations.passwordIsPresentValidation(self.password)) {
            return callback(error.passwordNotEntered());
        }

        async.waterfall([
            async.apply(getAuthDetailsBasedOnEmail, self),
            getPassportDetails,
            getUserDetailsBasedOnAuthId,
            passwordVerification,
            roleIdCheck,
            generateAccessToken,
            createAccessToken,
            responseCreationForAdminLogin
        ], function(err, result) {
            if (err) {
                if (err == error.emailIdNotRegistered()) {
                    return callback(error.givenUserIsNotAuthorised());
                }
                if (err != error.emailIdNotRegistered()) {
                    return callback(error);
                }

            }

            if (result) {
                return callback(null, result);
            }
        });

    }

    /**
     * adminLogOut: It is an function to logout the admin on the admin portal of brown bag based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    adminLogOut(params, callback) {
        var self = this;
        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.invalidUserParams());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.invalidAccessTokenParams());
        }

        async.waterfall([
            async.apply(getUserDetailsFromAccessTokens, self),
            roleIdCheck,
            deleteTheAccessToken,
            responseForAdminLogOut
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
     * getAuthDetailsBasedOnEmail: It is an function to get the authentication details based on the email id passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getAuthDetailsBasedOnEmail(self, callback) {
        getAuthDetailsBasedOnEmail(self, callback);
    }

    /**
     * generateAccessToken: It is an function to generate the access token for the mobile application and admin portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    generateAccessToken(self, callback) {
        generateAccessToken(self, callback);
    }

    /**
     * createAccessToken: It is an function to create the access token in the access token database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    createAccessToken(self, callback) {
        createAccessToken(self, callback);
    }

    /**
     * updateDeviceDetails: It is an function to upsert the device details in the devices database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    updateDeviceDetails(self, callback) {
        updateDeviceDetails(self, callback);
    }

    /**
     * getUserDetailsBasedOnAuthId: It is an function to get the user details based on the authentication provider id passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getUserDetailsBasedOnAuthId(self, callback) {
        getUserDetailsBasedOnAuthId(self, callback);
    }

    /**
     * responseCreationForLoginMobileApplication: It is an function to create response for login api in the mobile application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    responseCreationForLoginMobileApplication(self, callback) {
        responseCreationForLoginMobileApplication(self, callback);
    }

    /**
     * getPassportDetails: It is an function to get all the passport details based on the authentication provider Id passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getPassportDetails(self, callback) {
        getPassportDetails(self, callback);
    }

}

module.exports = AuthenticationProvidersService;

/**
 * getAuthDetailsBasedOnEmail: It is an function to get authentication details based on the email passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getAuthDetailsBasedOnEmail(self, callback) {
    var authenticationProvidersService = new AuthenticationProvidersService();

    var where = {
        where: {
            email: self.email
        }
    };

    authenticationProvidersService.find(where, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result) {
            if (result.isActivated) {
                self.authDetails = result;
                return callback(null, self);
            }

            if (!result.isActivated) {
                return callback(error.userIsNotActivated());
            }

        }

        if (!result) {
            return callback(error.emailIdNotRegistered());
        }

    });
}

/**
 * getPassportDetails: It is an function to get passport details based on the authentication provider id passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getPassportDetails(self, callback) {
    var passportsService = new PassportsService();

    var where = {
        where: {
            authenticationProviderId: self.authDetails.id
        }
    };

    passportsService.find(where, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result) {
            self.passportDetails = result;
            return callback(null, self);
        }

        if (!result) {
            return callback(error.missingData());
        }
    });
}

/**
 * getUserDetailsFromAccessTokens: It is an function to get user details based on the user id and access token passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getUserDetailsFromAccessTokens(self, callback) {

    var authenticationProviderRepository = new AuthenticationProviderRepository();

    var query = 'select * from brownBag.AccessTokens as accessTokens ' +
        'left join brownBag.AuthenticationProviders as authenticationProviders on authenticationProviders.id=accessTokens.authenticationProviderId ' +
        'left join brownBag.Users as users on users.authenticationProviderId=authenticationProviders.id ' +
        'where accessTokens.accessToken=:accessToken and users.id=:userId'

    var replacements = {
        accessToken: self.accessToken,
        userId: self.userId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    authenticationProviderRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.userDetails = result[0];
            return callback(null, self);
        }

        if (result.length <= 0) {
            return callback(error.givenUserIsNotAuthorised());
        }

    });
}

/**
 * deleteTheAccessToken: It is an function to delete an access token based on the access token passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function deleteTheAccessToken(self, callback) {
    var authenticationProviderRepository = new AuthenticationProviderRepository();

    var query = 'DELETE from brownBag.AccessTokens where accessToken=:accessToken';

    var replacements = {
        accessToken: self.accessToken
    };

    var queryType = sequelize.QueryTypes.DELETE;

    authenticationProviderRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result || !result) {
            return callback(null, self);
        }

    });
}

/**
 * passwordVerification: It is an function to verify the password provided with the password saved in the database
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function passwordVerification(self, callback) {
    if (validations.passwordVerificationCheck(md5(self.password), self.passportDetails.password)) {
        return callback(null, self);
    }

    if (!validations.passwordVerificationCheck(md5(self.password), self.passportDetails.password)) {
        return callback(error.invalidEmailOrPasswordEntered());
    }
}

/**
 * generateAccessToken: It is an function to generate an access token to be saved in the database.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function generateAccessToken(self, callback) {
    self.accessToken = utils.encrypt("'" + moment().unix() + "'" + "-BROWNBAG");
    return callback(null, self);
}

/**
 * roleIdCheck: It is an function to check if the given user is admin or not based on the role Id.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function roleIdCheck(self, callback) {
    if (self.userDetails.roleId != adminRoleId) {
        return callback(error.givenUserIsNotAdmin());
    }

    if (self.userDetails.roleId == adminRoleId) {
        return callback(null, self);
    }

}

/**
 * createAccessToken: It is an function to save the generated access token in the database table.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function createAccessToken(self, callback) {
    var accessTokensService = new AccessTokensService();

    var options = {
        accessToken: self.accessToken,
        authenticationProviderId: self.authDetails.id,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW')
    };

    accessTokensService.save(options, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result) {
            self.accessTokenDetails = result;
            return callback(null, self);
        }

        if (!result) {
            return callback(error.unableToCreateTheAccessToken());
        }
    });
}

/**
 * getUserDetailsBasedOnAuthId: It is an function to get authentication details based on the auth id passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getUserDetailsBasedOnAuthId(self, callback) {
    var usersService = new UsersService();

    var where = {
        where: {
            authenticationProviderId: self.authDetails.id
        }
    };

    usersService.find(where, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result) {
            self.userDetails = result;
            return callback(null, self);
        }

        if (!result) {
            return callback(error.missingData());
        }
    });
}

/**
 * updateDeviceDetails: It is an function to get upsert devices details in the devices table.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateDeviceDetails(self, callback) {
    var devicesRepository = new DevicesRepository();

    var options = {
        requestType: self.requestType,
        deviceType: self.deviceType,
        playerId: self.playerId,
        deviceId: self.deviceId,
        createdAt: sequelize.fn('NOW'),
        updatedAt: sequelize.fn('NOW'),
        userId: self.userDetails.id
    }

    devicesRepository.upsert(options, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (!result) {
            return callback(null, self);
        }

        if (result) {
            return callback(null, self);
        }
    });
}

/**
 * responseCreationForLoginMobileApplication: It is an function to create response for login api in the mobile application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForLoginMobileApplication(self, callback) {
    var response = {};
    response.userDetails = {};
    response.userDetails.userId = self.userDetails.id;
    response.userDetails.fullName = self.userDetails.fullName;
    response.userDetails.designation = self.userDetails.designation;
    response.userDetails.profilePic = self.userDetails.profilePic;
    response.userDetails.linkeInPublicProfileUrl = self.userDetails.linkeInPublicProfileUrl;
    response.userDetails.accessToken = self.accessTokenDetails.accessToken;
    response.userDetails.email = self.authDetails.email;
    response.userDetails.companyName = self.userDetails.companyName;
    response.userDetails.playerId = self.playerId;
    response.userDetails.deviceId = self.deviceId;
    response.userDetails.requestType = self.requestType;
    response.userDetails.deviceType = self.deviceType;
    response.userDetails.isActivated = self.authDetails.isActivated;
    response.userDetails.isBlocked = self.authDetails.isBlocked;
    return callback(null, response);
}

/**
 * responseForLogoutApi: It is an function to create response for logout api in the mobile application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseForLogoutApi(self, callback) {
    var response = {};
    response.message = logoutResponse;
    return callback(null, response);
}

/**
 * responseCreationForAdminLogin: It is an function to create response for admin login api in the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForAdminLogin(self, callback) {
    var response = {};
    response.userId = self.userDetails.id;
    response.fullName = self.userDetails.fullName;
    response.designation = self.userDetails.designation;
    response.profilePic = self.userDetails.profilePic;
    response.accessToken = self.accessTokenDetails.accessToken;
    response.email = self.authDetails.email;
    response.isActivated = self.authDetails.isActivated;
    response.isBlocked = self.authDetails.isBlocked;
    return callback(null, response);
}

/**
 * responseForAdminLogOut: It is an function to create response for admin logout api in the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseForAdminLogOut(self, callback) {
    var response = {};
    response.message = adminLogOutResponse;
    return callback(null, response);
}

/**
 * roleIdCheckForUser: It is an function to check if the given user is a user or not based on the role Id.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function roleIdCheckForUser(self, callback) {

    if (self.userDetails.roleId != userRoleId) {
        return callback(error.givenUserIsNotAuthorised());
    }

    if (self.userDetails.roleId == userRoleId) {
        return callback(null, self);
    }
}