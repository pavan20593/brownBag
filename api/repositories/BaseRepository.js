'use strict';

var BaseRepositorySequelize = require('./sequelize/base/BaseRepositorySequelize.js');

class BaseRepository extends BaseRepositorySequelize {

    constructor(modelType) {
        super(modelType);
    }

}

module.exports = BaseRepositorySequelize;