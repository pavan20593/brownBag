'use strict';

var UserGroupRepository = require('../repositories/UserGroupRepository.js');
var LunchCancellationReasonRepository = require('../repositories/LunchCancellationReasonRepository.js');
var UsersTimeSlotsRepository = require('../repositories/UsersTimeSlotsRepository.js');
var UserTimezoneRepository = require('../repositories/UserTimezoneRepository.js');
var validations = require("../validations/validations.js");
var regExs = require("../regExs/regExs.js");
var error = require("../errors/errors.js");
var errors = require("../errors/errors.js");
var utils = require("../utils/utils.js");
var _ = require("lodash");

class UserGroupService {
    save(params, callback) {
        var userGroupRepository = new UserGroupRepository();
        userGroupRepository.save(params, callback);
    }

    find(params, callback) {
        var userGroupRepository = new UserGroupRepository();
        userGroupRepository.find(params, callback);
    }

    addExtraPeople(params, callback) {
        var self = this;
        self = params;

        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService();

        self.capability = "GROUPS";
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
                var userGroupRepository = new UserGroupRepository();

                var query = ' SELECT * FROM brownBag.UserGroups where UserGroups.userId =:userId and UserGroups.groupId =groupId and UserGroups.cancellationReasonId is null ';

                var replacements = {
                    userId: self.userId,
                    groupId: self.groupId
                }

                var queryType = sequelize.QueryTypes.SELECT;

                userGroupRepository.exec(query, replacements, queryType, function(err, result) {
                    if (err) {
                        return callback(error.invalidUserParams());
                    }
                    if (result.length < 0) {
                        return callback(error.cancellationReasonIdPresent());
                    }

                    if (result.length == 0) {
                        return callback(error.cancellationReasonIdPresent());
                    }
                    if (result.length > 0) {
                        var query = ' UPDATE UserGroups SET ' +
                                    ' extraPeople =:extraPeople WHERE UserGroups.userId =:userId and UserGroups.groupId =:groupId '; 

                        var replacements = {
                            extraPeople: self.extraPeople,
                            userId: self.userId,
                            groupId: self.groupId
                        }

                        var queryType = sequelize.QueryTypes.UPDATE;

                        userGroupRepository.exec(query, replacements, queryType, function(err, result) {
                            if (err) {
                                return callback(error.invalidUserParams());
                            }
                            if (result || !result) {
                                return callback(null, { message: "You are getting extra peoples for the lunch. Have a great lunch." });
                            }
                        });
                    }
                });
            }
        });
    }

    groupCancel(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService();
        self = params;

        self.capability = "GROUPS";
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

        async.waterfall([
            async.apply(aclImplementationService.hasAppPermissions, self),
            getLunchCancellationReasonId,
            lunchGroupCancellation,
            removeUserFromUserTimeslots,
            removeUserFromUserTimezones
        ], function(error, result) {
            if (error) {
                return callback(error);
            }
            if (result) {
                return callback(null, result);

            }
        });
    }
}

module.exports = UserGroupService;


function getLunchCancellationReasonId(self, callback) {

    var lunchCancellationReasonRepository = new LunchCancellationReasonRepository();
    var query = ' SELECT * FROM LunchCancellationReasons where id= :cancellationReasonId';


    var replacements = {
        cancellationReasonId: self.cancellationReasonId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    lunchCancellationReasonRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result.length > 0) {
            self.lunchGroupCancellationDetails = result;
            return callback(null, self);
        }

        if (result.length < 0) {
            return callback(error.invalidReasonIdPassed());
        }

        if (result.length == 0) {
            return callback(error.invalidReasonIdPassed());
        }
    });
}

function lunchGroupCancellation(self, callback) {


    var options = {}
    options = self.lunchGroupCancellationDetails;



    var userGroupRepository = new UserGroupRepository();
    var query = ' UPDATE UserGroups SET ';

    query += ' UserGroups.cancellationReasonId =:cancellationReasonId ';
    query += ' WHERE UserGroups.userId =:userId and UserGroups.groupId =:groupId ';

    var replacements = {
        cancellationReasonId: self.cancellationReasonId,
        userId: self.userId,
        groupId: self.groupId
    }

    var queryType = sequelize.QueryTypes.UPDATE;

    userGroupRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result || !result) {
            self.details = result;
            return callback(null, self);
        }
    });
}

function removeUserFromUserTimeslots(self, callback) {

    var usersTimeSlotsRepository = new UsersTimeSlotsRepository();

    var query = ' DELETE from UsersTimeSlots where UsersTimeSlots.userId =:userId and DATE(UsersTimeSlots.createdAt)=DATE(UTC_TIMESTAMP()) ';

    var replacements = {
        userId: self.userId
    }

    var queryType = sequelize.QueryTypes.UPDATE;

    usersTimeSlotsRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result || !result) {
            self.details = result;
            return callback(null, self);
        }
    });
}

function removeUserFromUserTimezones(self, callback) {

    var userTimezoneRepository = new UserTimezoneRepository();

    var query = ' DELETE from UserTimezones where UserTimezones.userId =:userId and DATE(UserTimezones.createdAt)=DATE(UTC_TIMESTAMP()) ';

    var replacements = {
        userId: self.userId
    }

    var queryType = sequelize.QueryTypes.UPDATE;

    userTimezoneRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result || !result) {
            return callback(null, { message: "You are successfully removed from the current group." });
        }
    });
}