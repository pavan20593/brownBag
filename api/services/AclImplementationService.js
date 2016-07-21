'use strict';


//Repositories and npm package declarations
var _ = require('lodash');
var error = require("../errors/errors.js");

/*
 * AclImplementationService: It is Class which is user to implement ACL for Watro 
 * for Customer and Vendor Application Only
 */
class AclImplementationService {

    /**
     * hasAdminPermissions: It is an function to check for ACL for Admin in the admin Portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    hasAdminPermissions(params, callback) {
        var self = {};
        self.params = params;

        var authenticationProvidersService = new AuthenticationProvidersService();

        async.waterfall([
            async.apply(getAccessTokenDetailsBasedOnAccessToken, self),
            getAuthDetailsBasedOnAuthId,
            authenticationProvidersService.getUserDetailsBasedOnAuthId,
            authenticationDetailsCheck,
            checkAdminCredentials
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
     * hasAppPermissions: It is an function to check for ACL for Users on the mobile application for brown bag application. 
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    hasAppPermissions(params, callback) {
        var self = {};
        self.params = params;

        var authenticationProvidersService = new AuthenticationProvidersService();

        async.waterfall([
            async.apply(getAccessTokenDetailsBasedOnAccessToken, self),
            getAuthDetailsBasedOnAuthId,
            authenticationProvidersService.getUserDetailsBasedOnAuthId,
            authenticationDetailsCheck,
            userDetailsCheckForMobileApplication,
            getSubCapabilitiesDetails,
            getCapabilitiesDetails,
            getPermissionDetails
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, self.params);
            }
        });

    }
}

module.exports = AclImplementationService;

/**
 * getAccessTokenDetailsBasedOnAccessToken: It is an function to get access token details based on the access token passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getAccessTokenDetailsBasedOnAccessToken(self, callback) {

    var accessTokensService = new AccessTokensService();

    var options = {
        where: {
            accessToken: self.params.accessToken
        }
    }

    accessTokensService.find(options, function(err, result) {
        if (err || !result) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (result) {
            self.accessTokenDetails = result;
            return callback(null, self);
        }
    });
}

/**
 * getAuthDetailsBasedOnAuthId: It is an function to get Authentication Details  based on the authentication provider Id passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getAuthDetailsBasedOnAuthId(self, callback) {

    var authenticationProvidersService = new AuthenticationProvidersService();

    var options = {
        where: {
            id: self.accessTokenDetails.authenticationProviderId,
        }
    };

    authenticationProvidersService.find(options, function(err, result) {
        if (err || !result) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (result) {
            self.authDetails = result;
            return callback(null, self);
        }
    });
}

/**
 * authenticationDetailsCheck: It is an function to get authenticate a user for ACL.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function authenticationDetailsCheck(self, callback) {

    if (self.authDetails.isEmailVerified) {

        if (self.authDetails.isActivated) {

            if (!self.authDetails.isBlocked) {
                return callback(null, self);
            }

            if (self.authDetails.isBlocked) {
                return callback(error.givenUserIsNotAuthorised());
            }
        }

        if (!self.authDetails.isActivated) {
            return callback(error.givenUserIsNotAuthorised());
        }
    }

    if (!self.authDetails.isEmailVerified) {
        return callback(error.givenUserIsNotAuthorissed());
    }
}

/**
 * checkAdminCredentials: It is an function to get check Admin Credentials for Admin ACL.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function checkAdminCredentials(self, callback) {

    if (_.isEqual(self.userDetails.roleId, sails.config.globals.adminRoleId) && _.isEqual(self.userDetails.id, self.params.userId)) {
        return callback(null, self.params);
    }

    if (!_.isEqual(self.userDetails.roleId, sails.config.globals.adminRoleId) || !_.isEqual(self.userDetails.id, self.params.userId)) {
        return callback(error.givenUserIsNotAuthorised());
    }
}

/**
 * userDetailsCheckForMobileApplication: It is an function to get check user credentials for mobile application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function userDetailsCheckForMobileApplication(self, callback) {

    if (self.userDetails.roleId == sails.config.globals.userRoleId) {
        if (self.userDetails.id != self.params.userId) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (self.userDetails.id == self.params.userId) {
            return callback(null, self);
        }
    }

    if (self.userDetails.roleId != sails.config.globals.userRoleId) {
        return callback(error.givenUserIsNotAuthorised());
    }

}

/**
 * getSubCapabilitiesDetails: It is an function to get sub capability based on sub capability passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getSubCapabilitiesDetails(self, callback) {

    var subCapabilitiesService = new SubCapabilitiesService();

    var options = {
        where: {
            subCapability: self.params.subCapability
        }
    };

    subCapabilitiesService.find(options, function(err, result) {
        if (err || !result) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (result) {
            self.subCapabilitiesDetails = result;
            return callback(null, self);
        }
    });
}

/**
 * getCapabilitiesDetails: It is an function to get capability based on capability passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getCapabilitiesDetails(self, callback) {

    var capabilitiesService = new CapabilitiesService();

    var options = {
        where: {
            capability: self.params.capability
        }
    };

    capabilitiesService.find(options, function(err, result) {
        if (err || !result) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (result) {
            self.capabilitiesDetails = result;
            return callback(null, self);
        }
    });
}

/**
 * getPermissionDetails: It is an function to get permission based on permission parameters passed.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getPermissionDetails(self, callback) {

    var permissionsService = new PermissionsService();

    var options = {
        where: {
            roleId: self.userDetails.roleId,
            subCapabilityId: self.subCapabilitiesDetails.id,
            capabilityId: self.capabilitiesDetails.id,
            isEnable: true
        }
    };

    permissionsService.find(options, function(err, result) {

        if (err || !result) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (result) {
            self.params.authDetails = self.authDetails;
            return callback(null, self);
        }
    });
}