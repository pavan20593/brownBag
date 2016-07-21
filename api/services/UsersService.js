'use strict';

const isEmailVerifiedForSignUp = true;
const isActivatedForSignUp = true;
const isBlockedForSignUp = false;
const blockedAtForSignUp = null;
const tempPasswordForSignUp = null;

var UsersRepository = require('../repositories/UsersRepository.js');
var AuthenticationProviderRepository = require('../repositories/AuthenticationProvidersRepository.js');
var PassportsRepository = require("../repositories/PassportsRepository.js");
var validations = require("../validations/validations.js");
var regExs = require("../regExs/regExs.js");
var error = require("../errors/errors.js");
var errors = require("../errors/errors.js");
var utils = require("../utils/utils.js");
var _ = require("lodash");

class UsersService {
    /**
     * save: It is an function to save user details in the users table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var usersRepository = new UsersRepository();
        usersRepository.save(params, callback);
    }

    /**
     * find: It is an function to find user details in the users table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var usersRepository = new UsersRepository();
        usersRepository.find(params, callback);
    }

    updateAndFind(params, options, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService()
        self = params;

        self.capability = "PROFILE";
        self.subCapability = "PUT";

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.givenUserIsNotAuthorised());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.givenUserIsNotAuthorised());
        }

        aclImplementationService.hasAppPermissions(self, function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                updateUserDetails(params, options, function(err, response) {
                    if (err) {
                        return callback(err);
                    }
                    if (result) {
                        return callback(null, response);
                    }
                });
            }
        });
    }

    /**
     * socialLogin: It is an function to allow social login for a user using mobile application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    socialLogin(params, callback) {
        var self = this;
        var authenticationProvidersService = new AuthenticationProvidersService();
        self = params;

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

        if (!validations.linkedInIdValidation(self.linkedInId)) {
            return callback(error.linkedInParamsMissings());
        }

        if (self.profilePic) {
            if (!validations.pictureUrlValidation(self.profilePic)) {
                return callback(error.invalidProfilePicParams());
            }
        }

        if (!validations.linkedInPublicProfileUrlValidation(self.linkedInPublicProfileUrl)) {
            return callback(error.linkedInParamsMissing());
        }

        if (self.companyName) {
            if (!validations.companyNameValidation(self.companyName)) {
                return callback(error.companyNameValidationFailed());
            }
        }

        if (!self.companyName) {
            self.companyName = null;
        }

        if (self.designation) {
            if (!validations.designationValidation(self.designation)) {
                return callback(error.designationValidationFailed());
            }
        }

        if (!self.designation) {
            self.designation = null;
        }

        async.waterfall([
            async.apply(checkForEmail, self),
            checkForLinkedInId,
            flagChecksForSocialLogin,
            checkIfItIsNewUser,
            socialLinkage,
            assignAuthDetails,
            authenticationProvidersService.getUserDetailsBasedOnAuthId,
            updateProfilePicDetails,
            updateCompanyNameDetails,
            updateDesignationDetails,
            updateLinkedInPublicProfileUrl,
            authenticationProvidersService.generateAccessToken,
            authenticationProvidersService.createAccessToken,
            authenticationProvidersService.updateDeviceDetails,
            authenticationProvidersService.responseCreationForLoginMobileApplication
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
     * forgetPassword: It is an function to do forget password module for a user using mobile application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    forgetPassword(params, callback) {

        var self = this;
        self = params;

        var authenticationProvidersService = new AuthenticationProvidersService();

        if (!validations.emailIsPresentValidation(self.email)) {
            return callback(error.emailNotEntered());
        }

        if (!regExs.validateEmail(self.email)) {
            return callback(error.invalidEmailEntered());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }

        async.waterfall([
            async.apply(checkForEmail, self),
            emailCheckForForgotPassword,
            authenticationProvidersService.getPassportDetails,
            checkIfTempPasswordAlreadyExistForAUser,
            createTempPasswordForForgotPassword,
            updateTempPasswordForTheGivenUserForForgotPassword,
            sendEmailForForgetPassword,
            responseCreationForForgetPassword
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
     * resetPassword: It is an function to do reset password module for a user using mobile application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    resetPassword(params, callback) {
        var self = this;
        self = params;

        var authenticationProvidersService = new AuthenticationProvidersService();

        if (!validations.emailIsPresentValidation(self.email)) {
            return callback(error.emailNotEntered());
        }

        if (!regExs.validateEmail(self.email)) {
            return callback(error.invalidEmailEntered());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }

        if (!validations.passwordValidation(self.tempPassword)) {
            return callback(error.invalidTempPasswordPassed());
        }

        if (!validations.passwordValidation(self.newPassword)) {
            return callback(error.invalidNewPasswordPassed());
        }

        async.waterfall([
            async.apply(checkForEmail, self),
            emailCheckForForgotPassword,
            authenticationProvidersService.getPassportDetails,
            tempPasswordMatchingforResetPassword,
            encryptNewPasswordEnteredForResetPassword,
            updateNewAndTempPasswordForGivenUserForResetPassword,
            responseCreationForResetPassword
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
     * getRegisteredUsers: It is an function to get all the registered users for the admin portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getRegisteredUsers(params, callback) {
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
            getUserDetailsForRegisteredUserApiAdmin,
            responseCreationForRegisteredUserApiAdmin
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
     * signUp: It is an function to signup a user on the brown bag platform.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    signUp(params, callback) {
        var self = this;
        var authenticationProvidersService = new AuthenticationProvidersService();
        self = params;

        if (!validations.fullNameValidation(self.fullName)) {
            return callback(error.fullNameValidationFailed());
        }

        if (!validations.emailIsPresentValidation(self.email)) {
            return callback(error.emailNotEntered());
        }

        if (!regExs.validateEmail(self.email)) {
            return callback(error.invalidEmailEntered());
        }

        if (!validations.companyNameValidation(self.companyName)) {
            return callback(error.companyNameValidationFailed());
        }

        if (!validations.designationValidation(self.designation)) {
            return callback(error.designationValidationFailed());
        }

        if (self.profilePic) {
            if (!validations.pictureUrlValidation(self.profilePic)) {
                return callback(error.profilePicValidationFailed());
            }
        }

        if (!self.profilePic) {
            self.profilePic = null;
        }

        if (self.linkedInPublicProfileUrl) {
            if (!validations.linkedInPublicProfileUrlValidation(self.linkedInPublicProfileUrl)) {
                return callback(error.linkedInPublicProfilePicUrlFailed());
            }
        }

        if (!self.linkedInPublicProfileUrl) {
            self.linkedInPublicProfileUrl = null;
        }

        if (self.linkedInId) {
            if (!validations.linkedInIdValidation(self.linkedInId)) {
                return callback(error.linkedInParamsMissing());
            }
        }

        if (!self.linkedInId) {
            self.linkedInId = null;
            if (!validations.passwordIsPresentValidation(self.password)) {
                return callback(error.passwordNotEntered());
            }
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
            async.apply(checkForEmail, self),
            emailFlagCheckForSignUp,
            checkForLinkedInId,
            linkedInIdFlagCheckForSignUp,
            encryptPasswordForSignUp,
            authenticationProvidersService.generateAccessToken,
            createUser,
            authenticationProvidersService.responseCreationForLoginMobileApplication
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
     * uploadProfilePicture: It is an function to upload a user profile pic on the brown bag platform.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    uploadProfilePicture(params, callback) {

        var self = this;
        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService()
        self = params;

        self.capability = "PROFILE";
        self.subCapability = "PUT";

        //////////////////
        // Validations  //
        //////////////////

        if (!validations.userIdValidation(self.userId)) {
            self.file.upload(function() {});
            return callback(error.invalidUserParams());
        }
        if (!validations.fileExistanceValidation(self.file)) {
            self.file.upload(function() {});
            return callback(error.fileNotExistValidation());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            self.file.upload(function() {});
            return callback(error.invalidUserAgentProvided());
        }

        if (!('isNoop' in self.file)) {
            //file MetaData
            //get the file name
            self.fileName = self.file._files[0].stream.filename;
            //get the file size
            self.fileSizeInBytes = self.file._files[0].stream.byteCount;
            //get the file extension for the given file
            self.fileExtensionValue = utils.getFileExtension(self.fileName);
        }

        if ('isNoop' in self.file) {
            self.file.upload(function() {});
            return callback(error.fileNotExistValidation());
        }


        async.waterfall([
            async.apply(aclImplementationService.hasAppPermissions, self),
            validateImageFile,
            authenticationProvidersService.getUserDetailsBasedOnAuthId,
            deleteExistingProfilePictureURL,
            uploadProfilePicToS3,
            updateProfilePicForAGivenUser,
            responseCreationForProfilePicUpload
        ], function(err, result) {
            if (err) {
                self.file.upload(function() {});
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }

        });
    }
}

module.exports = UsersService;

function updateUserDetails(params, options, callback) {
    var usersRepository = new UsersRepository();
    var query = 'UPDATE Users, AuthenticationProviders SET';

    if (params.fullName) {
        query += ' Users.fullName =:fullName, ';
    }
    if (params.designation) {
        query += ' Users.designation =:designation, ';
    }
    if (params.companyName) {
        query += ' Users.companyName =:companyName, ';
    }
    if (params.email) {
        query += ' AuthenticationProviders.email =:email, ';
    }
    var index = query.lastIndexOf(',');
    query = query.substring(0, index);


    query += ' WHERE AuthenticationProviders.id = Users.authenticationProviderId and Users.id =:userId ';


    var replacements = {
        fullName: params.fullName,
        designation: params.designation,
        companyName: params.companyName,
        email: params.email,
        userId: options.where.id
    };

    var queryType = sequelize.QueryTypes.UPDATE;

    usersRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result || !result) {
            getUserDetails(params, options, callback);
        }
    });
}

function getUserDetails(params, options, callback) {
    var usersRepository = new UsersRepository();
    var query = 'SELECT Users.fullName, Users.designation,' +
        ' Users.companyName, AuthenticationProviders.email FROM Users' +
        ' LEFT JOIN AuthenticationProviders ON AuthenticationProviders.id = Users.authenticationProviderId' +
        ' where Users.id =:userId';

    var replacements = {
        userId: options.where.id
    };

    var queryType = sequelize.QueryTypes.SELECT;

    usersRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            var response = {};
            response.userDetails = result[0];
            return callback(null, response);
        }
    });
}

/**
 * checkForEmail: It is an function to check for the authentication details based on email in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */
function checkForEmail(self, callback) {
    var authenticationProvidersService = new AuthenticationProvidersService();

    if (self.email) {

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
                self.authDetails = result;
                self.emailFlag = true;
                return callback(null, self);
            }

            if (!result) {
                self.emailFlag = false;
                return callback(null, self);
            }
        });
    }

    if (!self.email) {
        self.emailFlag = false;
        return callback(null, self);
    }
}

/**
 * checkForLinkedInId: It is an function to check for the authentication details based on linkedIn Id in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function checkForLinkedInId(self, callback) {
    var authenticationProvidersService = new AuthenticationProvidersService();

    var where = {
        where: {
            linkedInId: self.linkedInId
        }
    };

    authenticationProvidersService.find(where, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result) {
            self.linkedInIdFlag = true;
            self.authDetails2 = result;
            return callback(null, self);
        }

        if (!result) {
            self.linkedInIdFlag = false;
            return callback(null, self);
        }

    });
}

/**
 * flagChecksForSocialLogin: It is an function to check for the various flag for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function flagChecksForSocialLogin(self, callback) {
    if (self.emailFlag == true && self.linkedInIdFlag == false && !self.authDetails.linkedInId) {
        self.socialLinkage = true;
        self.takeAuthDetails = true;
        self.takeAuthDetails2 = false;
        self.giveAccess = true;
        return callback(null, self);
    }

    if (self.emailFlag == true && self.linkedInIdFlag == true && self.authDetails.id == self.authDetails2.id) {
        self.giveAccess = true;
        self.takeAuthDetails = true;
        self.takeAuthDetails2 = false;
        return callback(null, self);
    }

    if (self.emailFlag == false && self.linkedInIdFlag == true) {
        self.giveAccess = true;
        self.takeAuthDetails = false;
        self.takeAuthDetails2 = true;
        return callback(null, self);
    }

    if (self.emailFlag == false && self.linkedInIdFlag == false) {
        self.giveAccess = false;
        return callback(null, self);
    }

    if (self.emailFlag == true && self.linkedInIdFlag == true && self.authDetails.id != self.authDetails2.id) {
        self.invalidLinkage = true;
        return callback(null, self);
    }

    if (self.emailFlag == true && self.linkedInIdFlag == false && self.authDetails.linkedInId) {
        self.socialLinkage = false;
        self.takeAuthDetails = true;
        self.takeAuthDetails2 = false;
        self.giveAccess = true;
        return callback(null, self);
    }
}

/**
 * checkIfItIsNewUser: It is an function to check if the user is a new user or not for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function checkIfItIsNewUser(self, callback) {
    if (!self.giveAccess) {
        return callback(error.newUserValidation(self));
    }

    if (self.giveAccess) {
        return callback(null, self);
    }
}

/**
 * socialLinkage: It is an function to do the social linkage for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function socialLinkage(self, callback) {
    if (self.socialLinkage) {
        var authenticationProviderRepository = new AuthenticationProviderRepository();

        var query = 'UPDATE brownBag.AuthenticationProviders as authenticationProviders  SET linkedInId=:linkedInId' +
            ' where authenticationProviders.email=:email';

        var replacements = {
            linkedInId: self.linkedInId,
            email: self.email
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        authenticationProviderRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                self.authDetails.linkedInId = self.linkedInId;
                return callback(null, self);
            }

        });
    }

    if (!self.socialLinkage) {
        return callback(null, self);
    }
}

/**
 * assignAuthDetails: It is an function to assign authentication provider details for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function assignAuthDetails(self, callback) {
    if (self.takeAuthDetails) {
        return callback(null, self);
    }

    if (self.takeAuthDetails2) {
        self.authDetails = self.authDetails2;
        return callback(null, self);
    }
}


/**
 * updateProfilePicDetails: It is an function to update profile pic details for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateProfilePicDetails(self, callback) {
    if (!self.userDetails.profilePic && self.profilePic) {
        var usersRepository = new UsersRepository();

        var query = 'UPDATE brownBag.Users as users  SET profilePic= :profilePic' +
            ' where users.id= :userId';

        var replacements = {
            profilePic: self.profilePic,
            userId: self.userDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        usersRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                self.userDetails.profilePic = self.profilePic;
                return callback(null, self);
            }

        });
    }

    if (self.userDetails.profilePic) {
        return callback(null, self);
    }

    if (!self.userDetails.profilePic && !self.profilePic) {
        return callback(null, self);
    }
}

/**
 * updateCompanyNameDetails: It is an function to update Company name details for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateCompanyNameDetails(self, callback) {
    if (!self.userDetails.companyName && self.companyName) {
        var usersRepository = new UsersRepository();

        var query = 'UPDATE brownBag.Users as users  SET companyName= :companyName' +
            ' where users.id= :userId';

        var replacements = {
            companyName: self.companyName,
            userId: self.userDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        usersRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                self.userDetails.companyName = self.companyName;
                return callback(null, self);
            }

        });
    }

    if (self.userDetails.companyName) {
        return callback(null, self);
    }

    if (!self.userDetails.companyName && !self.companyName) {
        return callback(null, self);
    }
}

/**
 * updateDesignationDetails: It is an function to update designation details for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateDesignationDetails(self, callback) {
    if (!self.userDetails.designation && self.designation) {
        var usersRepository = new UsersRepository();

        var query = 'UPDATE brownBag.Users as users  SET designation= :designation' +
            ' where users.id= :userId';

        var replacements = {
            designation: self.designation,
            userId: self.userDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        usersRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                self.userDetails.designation = self.designation;
                return callback(null, self);
            }

        });
    }

    if (self.userDetails.designation) {
        return callback(null, self);
    }

    if (!self.userDetails.designation && !self.designation) {
        return callback(null, self);
    }
}

/**
 * updateLinkedInPublicProfileUrl: It is an function to update linkedin public profile pic details for social login api in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateLinkedInPublicProfileUrl(self, callback) {
    if (!self.userDetails.linkedInPublicProfileUrl && self.linkedInPublicProfileUrl) {
        var usersRepository = new UsersRepository();

        var query = 'UPDATE brownBag.Users as users  SET linkedInPublicProfileUrl= :linkedInPublicProfileUrl' +
            ' where users.id= :userId';

        var replacements = {
            linkedInPublicProfileUrl: self.linkedInPublicProfileUrl,
            userId: self.userDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        usersRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                self.userDetails.linkedInPublicProfileUrl = self.linkedInPublicProfileUrl;
                return callback(null, self);
            }

        });
    }

    if (self.userDetails.linkedInPublicProfileUrl) {
        return callback(null, self);
    }

    if (!self.userDetails.linkedInPublicProfileUrl && !self.linkedInPublicProfileUrl) {
        return callback(null, self);
    }
}

/**
 * emailCheckForForgotPassword: It is an function to check for the presence of an email for forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function emailCheckForForgotPassword(self, callback) {
    if (self.emailFlag) {
        return callback(null, self);
    }

    if (!self.emailFlag) {
        return callback(error.emailIdNotRegistered());
    }
}

/**
 * checkIfTempPasswordAlreadyExistForAUser: It is an function to check for the presence of an temp password existance for forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function checkIfTempPasswordAlreadyExistForAUser(self, callback) {

    if (self.passportDetails.tempPassword) {
        self.doNotCreateTempPassword = true;
        self.createTempPassword = false;
        return callback(null, self);
    }

    if (!self.passportDetails.tempPassword) {
        self.doNotCreateTempPassword = false;
        self.createTempPassword = true;
        return callback(null, self);
    }
}

/**
 * createTempPasswordForForgotPassword: It is an function to create the temp password for forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function createTempPasswordForForgotPassword(self, callback) {
    if (self.createTempPassword && !self.doNotCreateTempPassword) {
        self.tempPassword = utils.createTempPassword();
        return callback(null, self);
    }

    if (self.doNotCreateTempPassword && !self.createTempPassword) {
        return callback(null, self);
    }
}

/**
 * updateTempPasswordForTheGivenUserForForgotPassword: It is an function to update the temp password in the database for forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateTempPasswordForTheGivenUserForForgotPassword(self, callback) {

    if (self.tempPassword) {
        var passportsRepository = new PassportsRepository();

        var query = 'UPDATE brownBag.Passports as passports  SET tempPassword= :tempPassword' +
            ' where passports.authenticationProviderId= :authenticationProviderId';

        var replacements = {
            tempPassword: self.tempPassword,
            authenticationProviderId: self.authDetails.id
        };

        var queryType = sequelize.QueryTypes.UPDATE;

        passportsRepository.exec(query, replacements, queryType, function(err, result) {
            if (err) {
                return callback(error.inconvenienceMessage());
            }

            if (result || !result) {
                return callback(null, self);
            }
        });
    }

    if (!self.tempPassword) {
        return callback(null, self);
    }
}


/**
 * sendEmailForForgetPassword: It is an function to send forget password email for forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function sendEmailForForgetPassword(self, callback) {
    //Currently ByPassed
    return callback(null, self);
}

/**
 * responseCreationForForgetPassword: It is an function for response creation of the forget password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForForgetPassword(self, callback) {
    var response = {};
    response.message = "The temporary password was generated and sent to your registered email.";
    return callback(null, response);
}

/**
 * tempPasswordMatchingforResetPassword: It is an function to match the temp password of the reset password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function tempPasswordMatchingforResetPassword(self, callback) {

    if (self.passportDetails.tempPassword === self.tempPassword) {
        return callback(null, self);
    }

    if (self.passportDetails.tempPassword != self.tempPassword) {
        return callback(error.incorrectTempPasswordEntered());
    }

}

/**
 * encryptNewPasswordEnteredForResetPassword: It is an function to encrypt the new password provided in the reset password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function encryptNewPasswordEnteredForResetPassword(self, callback) {
    self.encryptedNewPassword = utils.encrypt(self.newPassword);
    return callback(null, self);
}

/**
 * updateNewAndTempPasswordForGivenUserForResetPassword: It is an function to update the new password provided in the reset password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateNewAndTempPasswordForGivenUserForResetPassword(self, callback) {

    var passportsRepository = new PassportsRepository();

    var query = 'UPDATE brownBag.Passports as passports  SET password= :password, tempPassword=null' +
        ' where passports.authenticationProviderId= :authenticationProviderId';

    var replacements = {
        password: self.encryptedNewPassword,
        authenticationProviderId: self.authDetails.id
    };

    var queryType = sequelize.QueryTypes.UPDATE;

    passportsRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result || !result) {
            return callback(null, self);
        }
    });
}

/**
 * responseCreationForResetPassword: It is an function for the response creation for the reset password module in the brown bag platform.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForResetPassword(self, callback) {
    var response = {};
    response.message = "Your password has been reset successfully.";
    return callback(null, response);
}

/**
 * getUserDetailsForRegisteredUserApiAdmin: It is an function to get the registered users details for the admin portal
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getUserDetailsForRegisteredUserApiAdmin(self, callback) {

    var usersRepository = new UsersRepository();

    var query = 'select users.id as userId,users.fullName,authenticationProviders.email,' +
        ' users.designation,users.companyName,authenticationProviders.isActivated as isActive' +
        ' from brownBag.Users as users' +
        ' left join brownBag.AuthenticationProviders as authenticationProviders' +
        ' on authenticationProviders.id=users.authenticationProviderId' +
        ' where users.roleId= :userRoleId';

    var replacements = {
        userRoleId: sails.config.globals.userRoleId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    usersRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.userDetails = result;
            return callback(null, self);
        }

        if (result.length == 0) {
            self.userDetails = [];
            return callback(null, self);
        }

        if (result.length < 0) {
            self.userDetails = [];
            return callback(null, self);
        }

    });
}

/**
 * responseCreationForRegisteredUserApiAdmin: It is an function to create the response for the get registered users details for the admin portal
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForRegisteredUserApiAdmin(self, callback) {
    var response = {};
    response.userDetails = [];
    if (self.userDetails.length > 0) {
        _.forEach(self.userDetails, function(user) {
            if (user.isActive) {
                user.isActive = true;
            }

            if (!user.isActive) {
                user.isActive = false;
            }
            response.userDetails.push(user);
        });
    }

    if (self.userDetails.length == 0) {
        response.userDetails = [];
    }

    if (self.userDetails.length < 0) {
        response.userDetails = [];
    }

    return callback(null, response);
}

/**
 * emailFlagCheckForSignUp: It is an function to check the presence of the email for the sign up module for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function emailFlagCheckForSignUp(self, callback) {
    if (self.emailFlag) {
        return callback(error.emailIsAlreadyRegistered());
    }

    if (!self.emailFlag) {
        return callback(null, self);
    }
}

/**
 * linkedInIdFlagCheckForSignUp: It is an function to check the presence of the linkedIn id for the sign up module for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function linkedInIdFlagCheckForSignUp(self, callback) {

    if (self.linkedInIdFlag && !_.isNull(self.linkedInId) && self.linkedInId == self.authDetails2.linkedInId) {
        return callback(error.emailIsAlreadyRegistered());
    }

    if (self.linkedInIdFlag && _.isNull(self.linkedInId)) {
        return callback(null, self);
    }

    if (!self.linkedInIdFlag) {
        return callback(null, self);
    }
}

/**
 * encryptPasswordForSignUp: It is an function to encrypt the password entered for the sign up module for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function encryptPasswordForSignUp(self, callback) {
    self.encryptedPassword = utils.encrypt(self.password);
    return callback(null, self);
}

/**
 * createUser: It is an function to create the user for the sign up module for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function createUser(self, callback) {

    return sequelize.transaction(function(t) {

        // chain all your queries here. make sure you return them.
        // Create Authentication Details
        return AuthenticationProviders.create({
            email: self.email,
            isEmailVerified: isEmailVerifiedForSignUp,
            linkedInId: self.linkedInId,
            isActivated: isActivatedForSignUp,
            isBlocked: isBlockedForSignUp,
            activatedAt: sequelize.fn('NOW'),
            blockedAt: blockedAtForSignUp,
            createdAt: sequelize.fn('NOW'),
            updatedAt: sequelize.fn('NOW')
        }, { transaction: t }).then(function(authDetails) {
            self.authDetails = authDetails;

            // Create User Details
            return Users.create({
                fullName: self.fullName,
                companyName: self.companyName,
                designation: self.designation,
                profilePic: self.profilePic,
                linkedInPublicProfileUrl: self.linkedInPublicProfileUrl,
                createdAt: sequelize.fn('NOW'),
                updatedAt: sequelize.fn('NOW'),
                authenticationProviderId: self.authDetails.id,
                roleId: sails.config.globals.userRoleId
            }, { transaction: t }).then(function(userDetails) {
                self.userDetails = userDetails;

                //Create Passport Details
                if (!self.linkedInId) {
                    return Passports.create({
                        password: self.encryptedPassword,
                        tempPassword: tempPasswordForSignUp,
                        authenticationProviderId: self.authDetails.id,
                        createdAt: sequelize.fn('NOW'),
                        updatedAt: sequelize.fn('NOW'),
                    }, { transaction: t }).then(function(passportDetails) {
                        self.passportDetails = passportDetails;

                        //Upsert Device Details
                        return Devices.upsert({
                            deviceId: self.deviceId,
                            playerId: self.playerId,
                            requestType: self.requestType,
                            deviceType: self.deviceType,
                            createdAt: sequelize.fn('NOW'),
                            updatedAt: sequelize.fn('NOW'),
                            userId: self.userDetails.id,
                        }, { transaction: t }).then(function(deviceDetails) {
                            //create AccessToken Details
                            return AccessTokens.create({
                                accessToken: self.accessToken,
                                createdAt: sequelize.fn('NOW'),
                                updatedAt: sequelize.fn('NOW'),
                                authenticationProviderId: self.authDetails.id
                            }, { transaction: t }).then(function(accessTokenDetails) {
                                self.accessTokenDetails = accessTokenDetails;
                            });
                        });
                    });
                }

                if (self.linkedInId) {
                    return Devices.upsert({
                        deviceId: self.deviceId,
                        playerId: self.playerId,
                        requestType: self.requestType,
                        deviceType: self.deviceType,
                        createdAt: sequelize.fn('NOW'),
                        updatedAt: sequelize.fn('NOW'),
                        userId: self.userDetails.id,
                    }, { transaction: t }).then(function(deviceDetails) {
                        //create AccessToken Details
                        return AccessTokens.create({
                            accessToken: self.accessToken,
                            createdAt: sequelize.fn('NOW'),
                            updatedAt: sequelize.fn('NOW'),
                            authenticationProviderId: self.authDetails.id
                        }, { transaction: t }).then(function(accessTokenDetails) {
                            self.accessTokenDetails = accessTokenDetails;
                        });
                    });
                }
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
 * validateImageFile: It is an function to validate the image file for the user profile pic upload for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function validateImageFile(self, callback) {
    if (!validations.fileValidation(self.fileSizeInBytes, self.fileExtensionValue)) {
        return callback(validations.invalidFileProvided());
    }

    if (validations.fileValidation(self.fileSizeInBytes, self.fileExtensionValue)) {
        return callback(null, self);
    }
}

/**
 * deleteExistingProfilePictureURL: It is an function to delete the image file for the user profile pic upload for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function deleteExistingProfilePictureURL(self, callback) {

    if (_.isNull(self.userDetails.picture)) {
        return callback(null, self);
    }
    if (!_.isNull(self.userDetails.picture)) {
        var s3Service = new S3Service();
        self.fileS3Url = self.userDetails.picture;

        s3Service.removeFileFromS3(self, function(err, response) {
            if (err) {
                return callback(err);
            }

            if (response) {
                return callback(null, self);
            }
        });
    }
}

/**
 * uploadProfilePicToS3: It is an function to upload the image file into S3 Bucket for the user profile pic upload for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function uploadProfilePicToS3(self, callback) {
    var s3Service = new S3Service();
    self.s3fileName = "image-brownBag-" + self.userId + "-" + self.userDetails.fullName.split(" ")[0] + "." + self.fileExtensionValue;

    s3Service.uploadFileToS3(self, function(err, response) {
        if (self.file.length == 0) {
            // clear the buffer link: https://github.com/balderdashy/skipper/issues/65
            self.file.upload(function() {});
            return callback(err.invalidFileProvided());
        }
        if (err) {
            return callback(err);
        }

        if (response) {
            self.imageURL = decodeURI(response[0].extra.Location);
            return callback(null, self);
        }
    });
}

/**
 * updateProfilePicForAGivenUser: It is an function to update the new image file into S3 Bucket for the user profile pic upload for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function updateProfilePicForAGivenUser(self, callback) {

    var usersRepository = new UsersRepository();

    var options = {
        profilePic: self.imageURL
    };
    var whereClause = {
        where: {
            id: self.userId
        }
    };

    usersRepository.update(options, whereClause, function(err, response) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (response || !response) {
            return callback(null, self);
        }
    });
}

/**
 * responseCreationForProfilePicUpload: It is an function to create response for the user profile pic upload for the brown bag application.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function responseCreationForProfilePicUpload(self, callback) {
    var response = {};
    response.profilePic = self.imageURL;
    return callback(null, response);
}

