'use strict';

var BaseRepository = require('./BaseRepository.js');

class CompanyDomainsRepository extends BaseRepository {

    constructor() {
        super(sails.models.companydomains);
    }

}

module.exports = CompanyDomainsRepository;