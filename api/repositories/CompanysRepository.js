'use strict';

var BaseRepository = require('./BaseRepository.js');

class CompanysRepository extends BaseRepository {

    constructor() {
        super(sails.models.companies);
    }

}

module.exports = CompanysRepository;