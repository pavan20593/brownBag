'use strict';

var BaseRepository = require('./BaseRepository.js');

class SubCapabilitiesRepository extends BaseRepository {

    constructor() {
        super(sails.models.subcapabilities);
    }

}

module.exports = SubCapabilitiesRepository;