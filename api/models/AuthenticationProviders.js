/**
 * AuthenticationProviders.js
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
        email: {
            type: Sequelize.STRING,
            require: true,
            validate: {
                isEmail: true
            }
        },
        isEmailVerified: {
            type: Sequelize.BOOLEAN,
            require: true
        },
        linkedInId: {
            type: Sequelize.STRING,
            unique: true
        },
        facebookId: {
            type: Sequelize.STRING,
            unique: true
        },
        isActivated: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isBlocked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        activatedAt: {
            type: Sequelize.DATE,
        },
        blockedAt: {
            type: Sequelize.DATE,
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