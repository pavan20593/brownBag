'use strict';

var BaseRepository = require('./BaseRepository.js');

class GroupsRepository extends BaseRepository {

    constructor() {
        super(sails.models.groups);
    }

}

module.exports = GroupsRepository;