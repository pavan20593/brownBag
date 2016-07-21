'use strict';

var BaseRepository = require('./BaseRepository.js');

class CapabilitiesRepository extends BaseRepository {

    constructor() {
        super(sails.models.capabilities);
    }

}

module.exports = CapabilitiesRepository;