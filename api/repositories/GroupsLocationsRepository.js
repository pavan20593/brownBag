'use strict';

var BaseRepository = require('./BaseRepository.js');

class GroupsLocationsRepository extends BaseRepository {

    constructor() {
        super(sails.models.groupslocations);
    }

}

module.exports = GroupsLocationsRepository;