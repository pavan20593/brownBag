'use strict';

var BaseRepository = require('./BaseRepository.js');

class UsersTimeSlotsRepository extends BaseRepository {

    constructor() {
        super(sails.models.userstimeSlots);
    }

}

module.exports = UsersTimeSlotsRepository;