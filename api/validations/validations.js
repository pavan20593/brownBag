const userAgentIosApp = sails.config.globals.userAgentIosApp;
const osTypeIos = sails.config.globals.osTypeIos;
const bytes = 1024; // no. of Bytes
const normalMode = "normal";
const specialMode = "special";
var _ = require("lodash");
var md5 = require("md5");
var imageFileSizeMin = 0.0009765625; //0.0029296875; // Image File Size Minimum in MB
var imageFileSizeMax = 7.0000000000; //Image file Size Maximum in MB
var supportedImageFormats = ['jpg', 'jpeg', 'png']; // different file extensions supported for Images
var moment = require("moment");

module.exports = {

    emailIsPresentValidation: function(email) {
        if (_.isNull(email) || _.isUndefined(email) || email.length <= 0) {
            return false;
        }

        return true;
    },

    passwordIsPresentValidation: function(password) {
        if (_.isNull(password) || _.isUndefined(password) || password.length <= 0) {
            return false;
        }

        return true;
    },

    deviceIdValidation: function(deviceId) {
        if (!_.isUndefined(deviceId) && !_.isInteger(deviceId)) {
            return true;
        }
        return false;
    },

    playerIdValidation: function(playerId) {
        if (_.isUndefined(playerId) || _.isInteger(playerId)) {
            return false;
        }
        return true;
    },

    userAgentValidation: function(userAgent) {
        if (_.isEqual(userAgent, userAgentIosApp)) {
            return true;
        }

        return false;
    },


    requestTypeValidation: function(requestType) {
        if (!_.isNull(requestType) && !_.isUndefined(requestType) && _.isInteger(requestType) && _.lt(requestType, 4) && _.gte(requestType, 0)) {
            return true
        }

        return false;
    },

    passwordVerificationCheck: function(password, dbPassword) {
        if (_.isEqual(password, dbPassword)) {
            return true;
        }

        return false;
    },

    osTypeValidation: function(osType) {
        if (_.isEqual(osType, osTypeIos)) {
            return true;
        }

        return false;
    },

    userIdValidation: function(userId) {

        if (_.isNull(userId) || _.isUndefined(userId) || !_.isInteger(userId)) {
            return false;
        }
        return true;
    },

    accessTokenValidation: function(accessToken) {
        if (!_.isNull(accessToken) && !_.isUndefined(accessToken) && _.isString(accessToken) && accessToken.length > 0) {
            return true
        }
        return false;
    },

    linkedInIdValidation: function(linkedInId) {

        if (!_.isNumber(linkedInId) && !_.isUndefined(linkedInId) && _.isString(linkedInId) && linkedInId.length > 0 && !_.isNull(linkedInId)) {
            return true;
        }

        return false;
    },

    pictureUrlValidation: function(profilePic) {

        if (!_.isNumber(profilePic) && !_.isNull(profilePic) && !_.isUndefined(profilePic) && _.isString(profilePic) && profilePic.length > 0) {
            return true;
        }

        return false;
    },

    linkedInPublicProfileUrlValidation: function(linkedInPublicProfileUrl) {
        if (!_.isNumber(linkedInPublicProfileUrl) && !_.isNull(linkedInPublicProfileUrl) && !_.isUndefined(linkedInPublicProfileUrl) && _.isString(linkedInPublicProfileUrl) && linkedInPublicProfileUrl.length > 0) {
            return true;
        }

        return false;
    },

    passwordValidation: function(password) {

        if (!_.isNumber(password) && !_.isNull(password) && !_.isUndefined(password) && _.isString(password) && password.length > 0) {
            return true;
        }
        return false;
    },

    proximityForGeneralUsersValidation: function(proximity) {

        if (_.isNull(proximity) || _.isUndefined(proximity) || _.isString(proximity)) {
            return false;
        }
        return true;
    },

    fullNameValidation: function(fullName) {
        if (!_.isNull(fullName) && !_.isUndefined(fullName) && _.isString(fullName) && !_.isNumber(fullName) && fullName.length > 0) {
            return true;
        }
        return false;
    },

    companyNameValidation: function(companyName) {
        if (!_.isNull(companyName) && !_.isUndefined(companyName) && _.isString(companyName) && !_.isNumber(companyName) && companyName.length > 0) {
            return true;
        }
        return false;
    },

    designationValidation: function(designation) {
        if (!_.isNull(designation) && !_.isUndefined(designation) && _.isString(designation) && !_.isNumber(designation) && designation.length > 0) {
            return true;
        }
        return false;
    },

    fileExistanceValidation: function(file) {
        if (!_.isNull(file) && !_.isUndefined(file)) {
            return true;
        }
        return false;
    },

    fileValidation: function(fileSize, fileExtension) {
        var flag = 0;
        var sizeInMb = parseFloat(fileSize / (bytes * bytes)); //computed size in MB
        var fileExtension = fileExtension.toLowerCase();

        if (sizeInMb > imageFileSizeMax || sizeInMb < imageFileSizeMin) {
            return false;
        } else {
            supportedImageFormats.forEach(function(ext) {
                if (ext === fileExtension) {
                    flag = 1;
                }
            });
            if (flag == 0) {
                return false;
            } else {
                return true;
            }
        }
    },

    companyNameValidation: function(companyName) {
        if (!_.isNull(companyName) && !_.isUndefined(companyName) && _.isString(companyName) && !_.isNumber(companyName) && companyName.length > 0) {
            return true;
        }
        return false;
    },

    domainValidation: function(domain) {
        if (!_.isNull(domain) && !_.isUndefined(domain) && _.isString(domain) && !_.isNumber(domain) && domain.length > 0 && domain.charAt(0) == '@') {
            return true;
        }
        return false;
    },

    companyModeValidation: function(mode) {
        if (!_.isNull(mode) && !_.isUndefined(mode) && _.isString(mode) && !_.isNumber(mode) && mode.length > 0 && mode === normalMode) {
            return true;
        }
        return false;
    },

    companyThresholdPerGroupValidation: function(thresholdPerGroup) {
        if (!_.isNull(thresholdPerGroup) && !_.isUndefined(thresholdPerGroup) && !_.isString(thresholdPerGroup) && _.isNumber(thresholdPerGroup)) {
            return true;
        }
        return false;
    },

    companyIsActiveValidation: function(isActive) {
        if (!_.isNull(isActive) && !_.isUndefined(isActive) && !_.isString(isActive) && !_.isNumber(isActive) && _.isBoolean(isActive)) {
            return true;
        }
        return false;
    },

    companyIdValidation: function(companyId) {
        if (!_.isUndefined(companyId) && !_.isNull(companyId) && !_.isString(companyId) && _.isInteger(companyId)) {
            return true;
        }
        return false;
    },

    domainIdValidation: function(domainId) {
        if (!_.isUndefined(domainId) && !_.isNull(domainId) && !_.isString(domainId) && _.isInteger(domainId)) {
            return true;
        }
        return false;
    },

    createdAtValidation: function(createdAt) {
        if (moment(createdAt).isValid()) {
            return true;
        }

        return false;
    }

}