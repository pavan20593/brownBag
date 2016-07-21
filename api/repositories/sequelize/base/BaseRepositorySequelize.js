'use strict';

class BaseRepositorySequelize {

    constructor(modelType) {
        this.modelType = modelType;
    }

    save(object, callback) {
        this.modelType.create(object).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    update(object, where, callback) {
        this.modelType.update(object,where).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    upsert(object, callback) {
        this.modelType.upsert(object).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    find(options, callback) {
        this.modelType.find(options).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    findAll(options, callback) {
        this.modelType.findAll(options).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    remove(id) {
        this.modelType.destroy(id).then(this.handleSuccessResponse).catch(handleException);
    }

    exec(query, replacements, queryType, callback) {
        sequelize.query(query, {
            replacements: replacements,
            type: queryType
        }).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }

    execNormal(query, callback) {
        sequelize.query(query).then(function(result) {
            callback(null, result);
        }).catch(function(exception) {
            callback(exception);
        });
    }


}

module.exports = BaseRepositorySequelize;