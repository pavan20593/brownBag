'use strict';

var BaseRepository = require('./BaseRepository.js');

class GroupDetailsRepository extends BaseRepository {

    constructor() {
        super(sails.models.groupdetails);
    }

}

module.exports = GroupDetailsRepository;