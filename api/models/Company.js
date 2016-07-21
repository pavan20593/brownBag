/**
 * Company.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        companyName: {
            type: Sequelize.STRING,
            unique: true,
            require: true
        },
        proximity: {
            type: Sequelize.FLOAT,
            require: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        mode: {
            type: Sequelize.ENUM('normal', 'special'),
            require: true
        },
        thresholdPerGroup: {
            type: Sequelize.INTEGER,
            require: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }
};