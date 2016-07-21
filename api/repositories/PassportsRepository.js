'use strict';

var BaseRepository = require('./BaseRepository.js');

class PassportsRepository extends BaseRepository {

    constructor() {
        super(sails.models.passports);
    }

}

module.exports = PassportsRepository;