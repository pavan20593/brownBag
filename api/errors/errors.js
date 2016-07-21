// Error Codes for Appropriate Errors.
const badRequestErrorCode = sails.config.globals.badRequestErrorCode;
const forbiddenErrorCode = sails.config.globals.forbiddenErrorCode;
const internalServerErrorCode = sails.config.globals.internalServerErrorCode;
const unAuthorisedUserErrorCode = sails.config.globals.unAuthorisedUserErrorCode;
const routeNotFound = sails.config.globals.routeNotFound;

var err = {};

module.exports = {
    invalidEmailEntered: function() {
        err.code = badRequestErrorCode;
        err.exception = "Please enter a valid email";
        return err;
    },

    emailNotEntered: function() {
        err.code = badRequestErrorCode;
        err.exception = "Email Id not entered.";
        return err;
    },

    passwordNotEntered: function() {
        err.code = badRequestErrorCode;
        err.exception = "Password is not entered.";
        return err;
    },

    invalidDeviceIdProvided: function() {
        err.code = badRequestErrorCode;
        err.exception = "Invalid device Id provided.";
        return err;
    },

    invalidPlayerIdProvided: function() {
        err.code = badRequestErrorCode;
        err.exception = "Invalid Player Id provided.";
        return err;
    },

    invalidUserAgentProvided: function() {
        err.code = badRequestErrorCode;
        err.exception = "Invalid user Agent provided.";
        return err;
    },

    invalidRequestTypeProvided: function() {
        err.code = badRequestErrorCode;
        err.exception = "Invalid Request Type provided.";
        return err;
    },

    inconvenienceMessage: function() {
        err.code = badRequestErrorCode;
        err.exception = "Sorry for the inconvenience. The system is currently down. Please try again later";
        return err;
    },

    emailIdNotRegistered: function() {
        err.code = badRequestErrorCode;
        err.exception = "The email is not present on Brown Bag Platform. Please signup into the Brown Bag application.";
        return err;
    },

    missingData: function() {
        err.code = badRequestErrorCode;
        err.exception = "The data is missing. Please contact the admin.";
        return err;
    },

    invalidEmailOrPasswordEntered: function() {
        err.code = badRequestErrorCode;
        err.exception = "The given email or password entered is incorrect. Please enter the correct email or password";
        return err;
    },

    unableToCreateTheAccessToken: function() {
        err.code = badRequestErrorCode;
        err.exception = "Could not create access Token for the given user. Please contact Admin. ";
        return err;
    },

    invalidOsTypeProvided: function() {
        err.code = badRequestErrorCode;
        err.exception = "The given os type is not supported by Brown Bag Application.";
        return err;
    },

    userIsNotActivated: function() {
        err.code = badRequestErrorCode;
        err.exception = "The given user account is not activated. Please activate the account to log into Brown Bag application.";
        return err;
    },

    invalidUserParams: function() {
        err.exception = "Invalid user parameters passed.";
        err.code = badRequestErrorCode;
        return (err);
    },

    givenUserIsNotAuthorised: function() {
        err.exception = "The given user is not authorised.";
        err.code = badRequestErrorCode;
        return (err);
    },

    givenUserIsNotAdmin: function() {
        err.exception = "You are not an Admin. Hence you cannot log into the admin Portal.";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidAccessTokenParams: function() {
        err.exception = "Invalid access Tokens parameters passed.";
        err.code = badRequestErrorCode;
        return (err);
    },

    linkedInParamsMissing: function() {
        err.exception = "LinkedIn Parameters are missing.";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidProfilePicParams: function() {
        err.exception = "Invalid Profile Pic Parameter passed.";
        err.code = badRequestErrorCode;
        return (err);
    },

    newUserValidation: function(self) {
        err.exception = "The Given user is a new to Brown Bag Application.";
        err.code = unAuthorisedUserErrorCode;
        err.socialData = {
            deviceId: self.deviceId,
            playerId: self.playerId,
            deviceType: self.deviceType,
            requestType: self.requestType,
            fullName: self.fullName,
            email: self.email,
            linkedInId: self.linkedInId,
            profilePic: self.profilePic,
            linkedInPublicProfileUrl: self.linkedInPublicProfileUrl,
            companyName: self.companyName,
            designation: self.designation
        };

        return (err);
    },

    invalidTempPasswordPassed: function() {
        err.exception = "Please provide a valid temporary password.";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidNewPasswordPassed: function() {
        err.exception = "Please provide a valid password to reset.";
        err.code = badRequestErrorCode;
        return (err);
    },

    incorrectTempPasswordEntered: function() {
        err.exception = "The temporary password entered is incorrect. Please enter the correct temporary password to reset your password.";
        err.code = badRequestErrorCode;
        return (err);
    },

    incorrectAdminParamsPassed: function() {
        err.exception = "Incorrect admin parameters passed";
        err.code = badRequestErrorCode;
        return (err);
    },

    incorrectProximityEntered: function() {
        err.exception = "Please enter a valid proximity to be changed for general users.";
        err.code = badRequestErrorCode;
        return (err);
    },

    proximityMutipleEntriesPresent: function() {
        err.exception = "There are multiple entries for a proximity for general users in the database. Please correct the same in the database.";
        err.code = badRequestErrorCode;
        return (err);
    },

    fullNameValidationFailed: function() {
        err.exception = "Enter a valid name.";
        err.code = badRequestErrorCode;
        return (err);
    },

    companyNameValidationFailed: function() {
        err.exception = "Enter a valid company name";
        err.code = badRequestErrorCode;
        return (err);
    },

    designationValidationFailed: function() {
        err.exception = "Enter a valid designation";
        err.code = badRequestErrorCode;
        return (err);
    },

    profilePicValidationFailed: function() {
        err.exception = "Enter a valid profile pic url";
        err.code = badRequestErrorCode;
        return (err);
    },

    linkedInPublicProfilePicUrlFailed: function() {
        err.exception = "Enter a valid LinkedInPublicProfileUrl";
        err.code = badRequestErrorCode;
        return (err);
    },

    emailIsAlreadyRegistered: function() {
        err.exception = "The Given email is already registered. Please signIn/login into the brown bag Application";
        err.code = badRequestErrorCode;
        return (err);
    },

    fileNotExistValidation: function() {
        err.exception = "Please provide a image to upload as profile pic";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidFileProvided: function() {
        err.exception = "Either the image extension is not supported or the image size has crossed 7 Mb. Please provide a valid image to upload.";
        err.code = badRequestErrorCode;
        return (err);
    },

    companyDetailsProvidedIsIncorrect: function() {
        err.exception = "Invalid company details entered.";
        err.code = badRequestErrorCode;
        return (err);
    },

    domainIsAlreadyPresent: function() {
        err.exception = "The domain already exist. Please enter a valid a domain.";
        err.code = badRequestErrorCode;
        return (err);
    },

    domainDetailProvidedIsIncorrect: function() {
        err.exception = "Invalid Domain details entered.";
        err.code = badRequestErrorCode;
        return (err);
    },

    companyNotLinkedToDomain: function() {
        err.exception = "The given company is not linked to the given domain.";
        err.code = badRequestErrorCode;
        return (err);
    },

    companyIdMismatch: function() {
        err.exception = "The company details cannot be updated as companyName id and companyId have mismatched";
        err.code = badRequestErrorCode;
        return (err);
    },

    domainIdMismatch: function() {
        err.exception = "The company details cannot be updated as domain id and domainId have mismatched";
        err.code = badRequestErrorCode;
        return (err);
    },

    validDate: function() {
        err.exception = "The date provided is in invalid format. Please enter a valid date.";
        err.code = badRequestErrorCode;
        return (err);
    },

    companyParamsIncorrect: function() {
        err.exception = "The Company Parameters passed in incorrect";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidTimeslot: function() {
        err.exception = "The Given Timeslot is invalid";
        err.code = badRequestErrorCode;
        return (err);
    },

    invalidReasonIdPassed:function(){
        err.exception = "The Given Reason for Cancellation is not present in the database.";
        err.code = badRequestErrorCode;
        return (err);
    },

    cancellationReasonIdPresent: function() {
        err.exception = "You can not add the extra people.";
        err.code = badRequestErrorCode;
        return (err);
    }

}