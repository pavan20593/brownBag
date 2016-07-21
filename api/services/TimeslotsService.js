'use strict';

var TimezoneRepository = require('../repositories/TimezoneRepository.js');
var GroupsRepository = require('../repositories/GroupsRepository.js');
var validations = require("../validations/validations.js");
var regExs = require("../regExs/regExs.js");
var error = require("../errors/errors.js");
var utils = require("../utils/utils.js");
var _ = require("lodash");
var moment = require('moment-timezone');
var TimeslotRepository = require('../repositories/TimeslotRepository.js')

class TimeslotsService {

    listOfTimeslots(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService();
        self = params;
        self.capability = "TIMESLOTS";
        self.subCapability = "GET";

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.invalidUserParams());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.invalidUserParams());
        }

        if (!validations.userAgentValidation(self.userAgent)) {
            return callback(error.invalidUserAgentProvided());
        }


        async.waterfall([
            async.apply(aclImplementationService.hasAppPermissions, self),
            getTimezoneDetails,
            getAllTimeslotsUsingTimezone

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

module.exports = TimeslotsService;

function getTimezoneDetails(self, callback) {

    var timezoneRepository = new TimezoneRepository();
    var query = ' SELECT * FROM Timezones WHERE Timezones.timezone=:timezone ';


    var replacements = {
        timezone: self.timezone
    }

    var queryType = sequelize.QueryTypes.SELECT;

    timezoneRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return error.invalidUserParams();
        }
        if (result) {
            self.timezonesDetails = result[0];
            return callback(null, self);
        }
    });
}

function getAllTimeslotsUsingTimezone(self, callback) {

    var timeslotRepository = new TimeslotRepository();
    var response = {};

    var query = ' select timeslots.id as timeSlotId, timeslots.timeSlot,IF( desired.timeSlotId is null,0,COUNT(*)) as count from brownBag.Timeslots as timeslots ' +
                ' left join(select userTimeSlots.userId as userId,userTimeSlots.timeSlotId as timeSlotId,userTimezones.timezoneId as timezoneId  from brownBag.UsersTimeSlots as userTimeSlots ' +
                ' inner join brownBag.UserTimezones as userTimezones on userTimezones.userId=userTimeSlots.userId ' +
                ' where userTimezones.timezoneId =:timezoneId and DATE(userTimezones.createdAt)=DATE(NOW()) and DATE(userTimeSlots.createdAt)=DATE(NOW())) as desired on desired.timeSlotId=timeslots.id ' +
                ' group by timeslots.id,desired.timeSlotId ' ;


    var replacements = {
        timezoneId: self.timezonesDetails.id
    }

    var queryType = sequelize.QueryTypes.SELECT;

    timeslotRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return error.invalidUserParams();
        }
        if (result) {
            response.timeslots = [];
            response.timeslots = result;
            return callback(null, response);
        }
    });
}