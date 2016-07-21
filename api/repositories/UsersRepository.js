'use strict';

var BaseRepository = require('./BaseRepository.js');

class UsersRepository extends BaseRepository {

    constructor() {
        super(sails.models.users);
    }

}

module.exports = UsersRepository;