/**
 * GroupsLocation.js
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
        latitude: {
            type: Sequelize.DECIMAL(10, 8),
            require: true
        },
        longitude: {
            type: Sequelize.DECIMAL(11, 8),
            require: true
        },
        location: {
            type: Sequelize.STRING(512),
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
        GroupsLocation.belongsTo(Groups, {
            foreignKey: {
                name: 'groupId',
                allowNull: true
            }
        });
    }
};