'use strict';

var BaseRepository = require('./BaseRepository.js');

class UserTimezoneRepository extends BaseRepository {

    constructor() {
        super(sails.models.usertimezones);
    }

}

module.exports = UserTimezoneRepository;