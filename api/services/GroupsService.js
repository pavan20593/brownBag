'use strict';

var GroupsRepository = require('../repositories/GroupsRepository.js');
var CompanysRepository = require('../repositories/CompanysRepository.js');
var TimezoneRepository = require('../repositories/TimezoneRepository.js');
var TimeslotRepository = require('../repositories/TimeslotRepository.js');
var ProximityNormalGroupRepository = require('../repositories/ProximityNormalGroupRepository.js');
var AuthenticationProviderRepository = require('../repositories/AuthenticationProvidersRepository.js');
var UsersRepository = require('../repositories/UsersRepository.js');
var DevicesRepository = require('../repositories/DevicesRepository.js');
var DomainsRepository = require('../repositories/DomainsRepository.js');
var CompanyDomainsRepository = require('../repositories/CompanyDomainsRepository.js');
var GroupDetailsRepository = require('../repositories/GroupDetailsRepository.js');
var UserGroupRepository = require('../repositories/UserGroupRepository.js');
var GroupsLocationsRepository = require('../repositories/GroupsLocationsRepository.js');
var regExs = require("../regExs/regExs.js");
var validations = require("../validations/validations.js");
var _ = require("lodash");
var md5 = require("md5");
var moment = require("moment");
var error = require("../errors/errors.js");
var utils = require("../utils/utils.js");

class GroupsService {

    /**
     * save: It is an function to save the group details in the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var groupsRepository = new GroupsRepository();
        groupsRepository.save(params, callback);
    }

    /**
     * find: It is an function to find the group details in the database table based on the params passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var subCapabilitiesRepository = new GroupsRepository();
        groupsRepository.find(params, callback);
    }

    /**
     * upsert: It is an function to upsert the group details in the database table based on the params passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    upsert(params, callback) {
        var subCapabilitiesRepository = new GroupsRepository();
        groupsRepository.upsert(params, callback);
    }

    addToGroup(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var authenticationProvidersService = new AuthenticationProvidersService();
        self = params;
        self.capability = "GROUPS";
        self.subCapability = "POST";

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
            updateOffset,
            getTimeslotDetails,
            checkTimeslots,
            getEmail,
            getCompanyIdUsingEmailDomain,
            getAllTheDetailsUsingTimezoneIdTimesloIdCompanyId

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
     * getGroupDetails: It is an function to get the group details for the get group list on the admin portal.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getGroupDetails(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var companysService = new CompanysService();

        self = params;

        if (!validations.userIdValidation(self.userId)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (!validations.accessTokenValidation(self.accessToken)) {
            return callback(error.incorrectAdminParamsPassed());
        }

        if (self.query.createdAt) {
            self.createdAt = self.query.createdAt;
            if (!validations.createdAtValidation(self.createdAt)) {
                return callback(error.validDate());
            }
        }

        if (self.query.companyId) {
            self.companyId = parseInt(self.query.companyId);
            if (!validations.companyIdValidation(self.companyId)) {
                return callback(error.companyParamsIncorrect());
            }
        }

        if (!self.query.createdAt) {
            self.createdAt = null;
        }

        if (!self.query.companyId) {
            self.companyId = null;
        }

        async.waterfall([
            async.apply(aclImplementationService.hasAdminPermissions, self),
            companysService.getCompanyIdCheckForGetGroupDetails,
            companyIdCheckForGetGroupDetails,
            getAllGroupDetails,
            getAllUserDetailsForAGivenGroup
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
     * getUserStatus: It is an function to get user status for mobile application.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    getUserStatus(params, callback) {
        var self = this;
        var aclImplementationService = new AclImplementationService();
        var companysService = new CompanysService();

        self = params;

        self.capability = "USER";
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
            getGroupDetailsForAGivenUserOnAParticularDay,
            getAllUserDetailsForAGivenGroup
        ], function(err, result) {
            if (err) {
                return callback(err);
            }

            if (result) {
                return callback(null, result);
            }
        })
    }
}

module.exports = GroupsService;

function getTimezoneDetails(self, callback) {
    var timezoneRepository = new TimezoneRepository();
    var query = ' SELECT * FROM Timezones ';


    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    timezoneRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return error.invalidUserParams();
        }
        if (result) {
            self.timezonesDetails = result;
            return callback(null, self);
        }
    });
}

function updateOffset(self, callback) {

    var options = {};
    options = self.timezonesDetails;

    self.offset = moment.tz(self.tag)._offset * 60;

    var timezoneRepository = new TimezoneRepository();
    var query = ' UPDATE Timezones SET ';

    for (var i in options) {
        if (options[i].tag == self.tag) {
            query += ' Timezones.offset =:offset WHERE Timezones.tag=:tag ';
            break;
        }
    }

    var replacements = {
        offset: self.offset,
        tag: self.tag
    }

    var queryType = sequelize.QueryTypes.UPDATE;

    timezoneRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result || !result) {
            findTimezoneId(self, callback);
        }
    });
}

function findTimezoneId(self, callback) {
    var timezoneRepository = new TimezoneRepository();

    var query = ' SELECT Timezones.id FROM Timezones WHERE (Timezones.offset =:offset and Timezones.tag =:tag)';

    var replacements = {
        offset: self.offset,
        tag: self.tag
    }

    var queryType = sequelize.QueryTypes.SELECT;

    timezoneRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            self.timezoneId = result[0].id;
            return callback(null, self);
        }
    });
}

function getTimeslotDetails(self, callback) {

    var timeslotRepository = new TimeslotRepository();
    var query = ' SELECT * FROM Timeslots ';


    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    timeslotRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return error.invalidUserParams();
        }
        if (result) {
            self.timeslotDetails = result;
            return callback(null, self);
        }
    });
}

function checkTimeslots(self, callback) {

    var timeslotRepository = new TimeslotRepository();
    var flag = 0;

    var options = {};
    options = self.timeslotDetails;

    var query = ' SELECT Timeslots.id FROM Timeslots ';

    for (var i in options) {
        if (options[i].timeSlot != self.timeslot) {
            flag++;
            if (flag >= 48) {
                return callback(error.invalidTimeslot());
            }
        }
        if (options[i].timeSlot == self.timeslot) {
            query += ' WHERE Timeslots.timeSlot =:timeslot ';
            break;
        }

    }

    var replacements = {
        timeslot: self.timeslot
    }

    var queryType = sequelize.QueryTypes.SELECT;

    timeslotRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            self.timeslotId = result[0].id;
            return callback(null, self);
        }
    });
}

function getEmail(self, callback) {

    var usersRepository = new UsersRepository();
    var query = ' SELECT AuthenticationProviders.email FROM Users, AuthenticationProviders ' +
        ' WHERE AuthenticationProviders.id = Users.authenticationProviderId and Users.id =:userId ';

    var replacements = {
        userId: self.userId
    }


    var queryType = sequelize.QueryTypes.SELECT;

    usersRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            self.email = result[0].email;
            return callback(null, self);
        }
    });
}

function getCompanyIdUsingEmailDomain(self, callback) {

    var domainsRepository = new DomainsRepository();

    var email = self.email;
    var index = email.indexOf('@');
    var emailDomain = email.substring(index);

    var query = ' select  * from brownBag.Domains as domains ' +
        ' left join brownBag.CompanyDomains as companyDomains on domains.id=companyDomains.domainId ' +
        ' left join brownBag.Companies as companies on companies.id=companyDomains.companyId ' +
        ' where domains.domain =:emailDomain ';


    var replacements = {
        emailDomain:emailDomain
    };

    var queryType = sequelize.QueryTypes.SELECT;

    domainsRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return error.invalidUserParams();
        }
        if (result) {
            self.companyDetails = {};
            self.companyDetails = result[0];
            return callback(null, self);
        }
    });
}

function getAllTheDetailsUsingTimezoneIdTimesloIdCompanyId(self, callback) {
    var groupsRepository = new GroupsRepository();
    
    var query = ' select groups.id as groupId,groups.timeslotId,groups.timezoneId, ' +
                ' companies.id as companyId,companies.companyName,groupsLocations.latitude,groupsLocations.longitude, ' +
                ' companies.proximity,companies.thresholdPerGroup,companies.mode,companies.isActive,  ' +
                ' IF(countOfUsers.userCount is null,0,countOfUsers.userCount) as userCount,lat_lng_distance(groupsLocations.latitude,groupsLocations.longitude,:latitude,:longitude) as lat_lng_distance,  ' +
                ' IF(lat_lng_distance(groupsLocations.latitude,groupsLocations.longitude,:latitude,:longitude)<companies.proximity,true,false) as withinTheProximity, ' +
                ' IF(IF(countOfUsers.userCount is null,0,countOfUsers.userCount)<companies.thresholdPerGroup,true,false) as canBePutInThisGroup  ' +
                ' From brownBag.Groups as groups ' + 
                ' left join brownBag.GroupsLocations as groupsLocations on groupsLocations.groupid=groups.id ' +
                ' left join brownBag.Companies as companies on companies.id=groups.companyId ' + 
                ' left join (select UserGroups.groupId,count(*) as userCount from UserGroups  ' +
                ' where cancellationReasonid is null group by UserGroups.groupId ) as countOfUsers on countOfUsers.groupId=groups.id  ' +
                ' where groups.timeslotId=:timeslotId and groups.timezoneId =:timezoneId and  ' +
                ' groups.companyId=:companyId and DATE(groups.createdAt)=DATE(UTC_TIMESTAMP()) ' +
                ' ORDER BY groups.createdAt asc, lat_lng_distance asc limit 1 ';



    var replacements = {
        latitude: self.latitude,
        longitude: self.longitude,
        timeslotId: self.timeslotId,
        timezoneId: self.timezoneId,
        companyId: self.companyDetails.id
    }
    var queryType = sequelize.QueryTypes.SELECT;

    groupsRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result.length > 0) {
            self.groupDetails = {};
            self.groupDetails = result[0];
            addToUserGroup(self, callback);
        }
        if (result.length == 0) {
            self.details = [];
            createNewGroup(self, callback);
        }
    });
}


function addToUserGroup(self, callback) {


    var params = {}
    params.userId = self.userId;
    params.groupId = self.groupDetails.groupId;

    var userGroupService = new UserGroupService();
    userGroupService.save(params, function(err, result) {
        if (result) {
            self.details = {};
            self.details = result;
            getGroupDetails(self, callback);
        }
    });
}

function createNewGroup(self, callback) {
    return sequelize.transaction(function(t) {



        // chain all your queries here. make sure you return them.
        // Create Groups Details
        return Groups.create({
            isSpecial: false,
            isDisabled: false,
            createdAt: sequelize.fn('NOW'),
            updatedAt: sequelize.fn('NOW'),
            timeslotId: self.timeslotId,
            timezoneId: self.timezoneId,
            companyId: self.companyDetails.companyId
        }, { transaction: t }).then(function(groupsDetails) {
            self.groupsDetails = groupsDetails;

            // Create UserGroups Details
            return UserGroups.create({
                extraPeople: 0,
                createdAt: sequelize.fn('NOW'),
                updatedAt: sequelize.fn('NOW'),
                userId: self.userId,
                groupId: self.groupsDetails.id,
                cancellationReasonid: null
            }, { transaction: t }).then(function(userGroupsDetails) {
                self.userGroupsDetails = userGroupsDetails;

                //Create Group Details
                return GroupDetails.create({
                    pictureUrl: null,
                    description: null,
                    createdAt: sequelize.fn('NOW'),
                    updatedAt: sequelize.fn('NOW'),
                    groupId: self.groupsDetails.id
                }, { transaction: t }).then(function(groupDetails) {
                    self.groupDetails = groupDetails;

                    //create GroupsLocation Details
                    return GroupsLocation.create({
                        latitude: self.latitude,
                        longitude: self.longitude,
                        location: null,
                        createdAt: sequelize.fn('NOW'),
                        updatedAt: sequelize.fn('NOW'),
                        groupId: self.groupsDetails.id
                    }, { transaction: t }).then(function(groupsLocationDetails) {
                        self.groupsLocationDetails = groupsLocationDetails;

                        //create UserTimezones Details
                        return UserTimezones.create({
                            createdAt: sequelize.fn('NOW'),
                            updatedAt: sequelize.fn('NOW'),
                            timezoneId: self.timezoneId,
                            userId: self.userId
                        }, { transaction: t }).then(function(userTimezonesDetails) {
                            self.userTimezonesDetails = userTimezonesDetails;


                            //create UsersTimeSlots Details
                            return UsersTimeSlots.create({
                                createdAt: sequelize.fn('NOW'),
                                updatedAt: sequelize.fn('NOW'),
                                userId: self.userId,
                                timeSlotId: self.timeslotId
                            }, { transaction: t }).then(function(usersTimeSlotsDetails) {
                                self.usersTimeSlotsDetails = usersTimeSlotsDetails;
                            });
                        });
                    });
                });
            });
        });
    }).then(function(result) {
        // Transaction has been committed
        // result is whatever the result of the promise chain returned to the transaction callback
        getNewGroupDetails(self, callback);

    }).catch(function(err) {
        // Transaction has been rolled back
        // err is whatever rejected the promise chain returned to the transaction callback
        return callback(error.inconvenienceMessage());
    });

}

function getGroupDetails(self, callback) {

    var groupDetailsRepository = new GroupDetailsRepository();
    var response = {};

    var query = ' SELECT  GroupDetails.groupId, GroupDetails.pictureUrl, GroupDetails.description, ' +
                ' GroupsLocations.latitude, GroupsLocations.longitude, GroupsLocations.location,  ' +
                ' Companies.id as companyId, Companies.companyName, Groups.isSpecial,Timeslots.id as timeslotId, Timeslots.timeSlot as timeslot, 1 as isPresentInGroup ' +
                ' FROM GroupDetails ' +
                ' LEFT JOIN Groups ON Groups.id = GroupDetails.groupId ' +
                ' LEFT JOIN GroupsLocations ON GroupsLocations.groupId = Groups.id ' +
                ' LEFT JOIN Companies ON Companies.id = Groups.companyId ' +
                ' LEFT JOIN Timeslots on Timeslots.id = Groups.timeslotId ' +
                ' WHERE Groups.id =:groupId and Companies.id =:companyId ' ;


    var replacements = {
        groupId: self.groupDetails.groupId,
        companyId: self.companyDetails.id
    }

    var queryType = sequelize.QueryTypes.SELECT;

    groupDetailsRepository.exec(query, replacements, queryType, function(err, result) {


        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            response.groupList = [];
            response.groupList.push(result[0]);
            getUserDetails(self, response, callback);
        }
    });
}

function getUserDetails(self, response, callback) {
    var userGroupRepository = new UserGroupRepository();

    var query = ' SELECT Users.fullName, Users.linkedInPublicProfileUrl, Users.designation, Users.profilePic, ' +
        ' UserGroups.userId,UserGroups.extraPeople, AuthenticationProviders.email' +
        ' FROM UserGroups ' +
        ' LEFT JOIN Users ON Users.id = UserGroups.userId ' +
        ' LEFT JOIN AuthenticationProviders ON AuthenticationProviders.id = Users.authenticationProviderId ' +
        ' WHERE UserGroups.groupId =:groupId and cancellationReasonid is null ';

    var replacements = {
        groupId: self.groupDetails.groupId
    }

    var queryType = sequelize.QueryTypes.SELECT;

    userGroupRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            response.groupList[0].userDetails = result;
            return callback(null, response);
        }
    });
}

function getNewGroupDetails(self, callback) {

    var groupDetailsRepository = new GroupDetailsRepository();
    var response = {};

    var query = ' SELECT  GroupDetails.groupId, GroupDetails.pictureUrl, GroupDetails.description, ' +
                ' GroupsLocations.latitude, GroupsLocations.longitude, GroupsLocations.location,  ' +
                ' Companies.id as companyId, Companies.companyName, Groups.isSpecial,Timeslots.id as timeslotId, Timeslots.timeSlot as timeslot, 1 as isPresentInGroup ' +
                ' FROM GroupDetails ' +
                ' LEFT JOIN Groups ON Groups.id = GroupDetails.groupId ' +
                ' LEFT JOIN GroupsLocations ON GroupsLocations.groupId = Groups.id ' +
                ' LEFT JOIN Companies ON Companies.id = Groups.companyId ' +
                ' LEFT JOIN Timeslots on Timeslots.id = Groups.timeslotId ' +
                ' WHERE Groups.id =:groupId and Companies.id =:companyId ' ;



    var replacements = {
        groupId: self.groupsDetails.id,
        companyId: self.companyDetails.id
        
    }

    var queryType = sequelize.QueryTypes.SELECT;

    groupDetailsRepository.exec(query, replacements, queryType, function(err, result) {

        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
            response.groupList = [];
            response.groupList.push(result[0]);
            getNewUserDetails(self, response, callback);
        }
    });
}

function getNewUserDetails(self, response, callback) {
    var userGroupRepository = new UserGroupRepository();
    var details = {};
    details = response;


    var query = ' SELECT Users.fullName, Users.linkedInPublicProfileUrl, Users.designation, Users.profilePic, ' +
        ' UserGroups.userId,UserGroups.extraPeople, AuthenticationProviders.email' +
        ' FROM UserGroups ' +
        ' LEFT JOIN Users ON Users.id = UserGroups.userId ' +
        ' LEFT JOIN AuthenticationProviders ON AuthenticationProviders.id = Users.authenticationProviderId ' +
        ' WHERE UserGroups.groupId =:groupId ';

    var replacements = {
        groupId: self.groupsDetails.id
    }

    var queryType = sequelize.QueryTypes.SELECT;

    userGroupRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.invalidUserParams());
        }
        if (result) {
           response.groupList[0].userDetails = result;
            return callback(null, response);
        }
    });
}


/**
 * getAllGroupDetails: It is an function to get all the group details for the get group list on the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getAllGroupDetails(self, callback) {

    var groupsRepository = new GroupsRepository();

    var query = ' select groups.id as groupId, companies.id as companyId, companies.companyName, timeslots.id as timeslotId,' +
        ' timeslots.timeSlot as timeslot, groups.createdAt ' +
        ' from brownBag.Groups as groups ' +
        ' left join brownBag.Timeslots as timeslots on timeslots.id=groups.timeslotId ' +
        ' left join brownBag.Companies as companies on companies.id=groups.companyId ' +
        ' where groups.isDisabled=false ';

    var replacements = {};

    var queryType = sequelize.QueryTypes.SELECT;

    if (self.createdAt) {
        query = query + ' and DATE(groups.createdAt)= :createdAt'
        replacements.createdAt = self.createdAt;
    }

    if (self.companyId) {
        query = query + ' and companies.id= :companyId'
        replacements.companyId = self.companyId;
    }

    query = query + ' order by groups.createdAt desc,timeslots.timeSlot desc'


    groupsRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.groups = {};
            self.groups.groupList = [];
            self.groups.groupList = result;
            return callback(null, self);
        }

        if (result.length == 0) {
            self.groups = {};
            self.groups.groupList = [];
            return callback(null, self);
        }

        if (result.length < 0) {
            self.groups = {};
            self.groups.groupList = [];
            return callback(null, self);
        }
    });
}

/**
 * getAllUserDetailsForAGivenGroup: It is an function to get all the user details for the given group for the get group list on the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getAllUserDetailsForAGivenGroup(self, callback) {
    if (self.groups.groupList.length > 0) {

        async.forEach(self.groups.groupList, function(group, groupCallback) {
            var groupsRepository = new GroupsRepository();

            var query = ' select * from brownBag.UserGroups as userGroups ' +
                ' left join brownBag.Users as users on users.id=userGroups.userId ' +
                ' left join brownBag.AuthenticationProviders as authenticationProviders on authenticationProviders.id=users.authenticationProviderId ' +
                ' where userGroups.groupId= :groupId and userGroups.cancellationReasonId is null ';

            var replacements = {
                groupId: group.groupId
            };

            var queryType = sequelize.QueryTypes.SELECT;

            groupsRepository.exec(query, replacements, queryType, function(err, result) {
                if (err) {
                    return groupCallback(error.inconvenienceMessage());
                }

                if (result.length > 0) {
                    self.groups.groupList[self.groups.groupList.indexOf(group)].userDetails = result;
                    return groupCallback();
                }

                if (result.length == 0) {
                    return groupCallback();
                }

                if (result.length < 0) {
                    return groupCallback();
                }
            });
        }, function(err) {
            if (err) {
                return callback(err);
            }
            if (!err) {
                return callback(null, self.groups);
            }
        });
    }

    if (self.groups.groupList.length < 0) {
        return callback(null, self.groups);
    }

    if (self.groups.groupList.length == 0) {
        return callback(null, self.groups);
    }
}

/**
 * companyIdCheckForGetGroupDetails: It is an function to check for company id for the get group list on the admin portal.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function companyIdCheckForGetGroupDetails(self, callback) {
    if (self.companyExist) {
        return callback(null, self);
    }

    if (!self.companyExist) {
        return callback(error.companyDetailsProvidedIsIncorrect());
    }
}

/**
 * getGroupDetailsForAGivenUserOnAParticularDay: It is an function to get group details for a given user on a particular for the I'm IN Status API.
 * @return {object} callback Success or Failure response based on the parameters passed to this function
 */

function getGroupDetailsForAGivenUserOnAParticularDay(self, callback) {
    var groupsRepository = new GroupsRepository();

    var query = 'select groups.id as groupId, companies.id as companyId, companies.companyName, timeslots.id as timeslotId, ' +
        ' timeslots.timeSlot as timeslot, IF(TIMESTAMPDIFF(HOUR,userGroups.createdAt,UTC_TIMESTAMP())>1,false,true) as isPresentInGroup ' +
        ' from brownBag.Groups as groups ' +
        ' left join brownBag.Timeslots as timeslots on timeslots.id=groups.timeslotId ' +
        ' left join brownBag.Companies as companies on companies.id=groups.companyId ' +
        ' left join brownBag.UserGroups as userGroups on groups.id=userGroups.groupId ' +
        ' where groups.isDisabled=false  and DATE(userGroups.createdAt)=DATE(UTC_TIMESTAMP()) and userGroups.cancellationReasonId is null' +
        ' and userGroups.userId= :userId and TIMESTAMPDIFF(HOUR,userGroups.createdAt,UTC_TIMESTAMP())<1;';

    var replacements = {
        userId: self.userId
    };

    var queryType = sequelize.QueryTypes.SELECT;

    groupsRepository.exec(query, replacements, queryType, function(err, result) {
        if (err) {
            return callback(error.inconvenienceMessage());
        }

        if (result.length > 0) {
            self.groups = {};
            self.groups.groupList = [];
            self.groups.groupList = result;
            return callback(null, self);
        }

        if (result.length == 0) {
            self.groups = {};
            self.groups.groupList = [];
            return callback(null, self);
        }

        if (result.length < 0) {
            self.groups = {};
            self.groups.groupList = [];
            return callback(null, self);
        }
    });
}