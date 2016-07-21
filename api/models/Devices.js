/**
 * Devices.js
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
        deviceId: {
            type: Sequelize.STRING(512),
            require: true,
            unique: true
        },
        playerId: {
            type: Sequelize.STRING(512),
            require: true,
            unique: true
        },
        deviceType: {
            type: Sequelize.ENUM('android', 'ios')
        },
        requestType: {
            type: Sequelize.INTEGER,
            validate: {
                isNumeric: true,
                len: [0, 1]
            }
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    associations: function() {
        Devices.belongsTo(Users, {
            foreignKey: {
                name: 'userId',
                allowNull: true
            }
        });
    }
};